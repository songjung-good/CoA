import logging
import traceback
from typing import TypeVar

from redis import Redis

from api.models.code import AnalysisStatus, analysis_percentages
from api.models.dto import AnalysisRequest, AnalysisDataDto, AiResultDto
from api.models.services.ai import AiService
from api.models.services.ai.mutex import AiMutex
from api.models.services.client import RepoClient
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService:
    """분석 서비스"""

    def __init__(self, redis_client: Redis, ai_mutex: AiMutex, ai_service: AiService):
        self.redis_client = redis_client
        self.ai_mutex = ai_mutex
        self.ai_service = ai_service

    async def analyze(self, request: R) -> None:
        """
        분석을 시작합니다.
        DTO를 가져와 각 단계가 진행될 때마다 Redis에 상태를 업데이트합니다.
        """
        # TODO: 각 단계를 나누어 추상 메소드를 호출하고 처리 상태 변경
        from config.containers import Container         # runtime import to prevent circular import
        repo_client: RepoClient[R] = Container.repo_client[type(request)](request)

        # DTO 가져오기
        dto: AnalysisDataDto = await AnalysisDataDto.from_redis(self.redis_client, request.analysisId)
        if dto is None:
            raise AnalysisException(AnalysisStatus.NO_REDIS_OBJECT)

        try:
            # 레포 요청 가능 여부 확인하기
            self._update_status(dto, AnalysisStatus.CHECKING_FOR_REQUESTING)
            await repo_client.check_loadability(request)

            # 레포에서 데이터 가져오기
            self._update_status(dto, AnalysisStatus.REQUESTING_TO_REPO)

            logging.error(f'{request.analysisId} START TO COLLECTING DATA')
            repo_data = await repo_client.load(request.userName)
            logging.error(f'{request.analysisId} FILTERED FILE CNT: {len(repo_data["content"])}')
            logging.error(f'{request.analysisId} FILTERED COMMITS CNT: {len(repo_data["commits"])}')

            # total_commit_cnt, personal_commit_cnt 세기
            # TODO
            # dto.result.total_commit_cnt = 123       # TODO: client에 커밋 개수 세는 로직 추가
            # dto.result.personal_commit_cnt = 123    # TODO: client에 커밋 개수 세는 로직 추가

            preprocessed_content_doc = await self.ai_service.preprocess_content(repo_data['content'])
            preprocessed_commits_doc = await self.ai_service.preprocess_commits(repo_data['commits'])
            logging.error(request.analysisId + ' FILTERED SPLIT FILE DOCS CNT: ' + str(len(preprocessed_content_doc)))
            logging.error(request.analysisId + ' FILTERED SPLIT COMMIT DOCS CNT: ' + str(len(preprocessed_commits_doc)))

            # AI 서비스 Readme Lock 대기
            # TODO ...
            chain = await self.ai_mutex.wait_for_readme_chain(request.analysisId)

            logging.error(request.analysisId + ' START TO GENERATE README')

            # 리드미 생성
            self._update_status(dto, AnalysisStatus.GENERATING_README)
            readme_result = await self.ai_service.generate_readme(chain, preprocessed_content_doc)

            # Mutex chain 되돌리기
            await self.ai_mutex.release(chain)

            # AI 서비스 Commit Lock 대기
            # TODO ...
            chain = await self.ai_mutex.wait_for_commit_chain(request.analysisId)

            logging.error(request.analysisId + ' START TO SCORE COMMITS')

            # 커밋 점수 매기기
            self._update_status(dto, AnalysisStatus.SCORING_COMMITS)
            commit_result = await self.ai_service.score_commits(chain, preprocessed_commits_doc)

            # Mutex chain 되돌리기
            await self.ai_mutex.release(chain)

            dto.result = AiResultDto(
                total_commit_cnt=0,
                personal_commit_cnt=0,
                readme=readme_result,
                repo_view_result='',
                commit_score=commit_result
            )

            # 완료 처리
            self._update_status(dto, AnalysisStatus.DONE)

        except AnalysisException as ex:
            dto.percentage = 0
            self._update_status(dto, ex.status)

        except Exception as ex:   # 알 수 없는 내부 오류 발생!
            dto.percentage = 0
            self._update_status(dto, AnalysisStatus.INTERNAL_SERVER_ERROR)
            traceback.print_exc()

    def _update_status(self, dto: AnalysisDataDto, next_status: AnalysisStatus) -> None:
        """
        Redis에 분석 상태를 업데이트합니다.
        """
        dto.status = next_status
        dto.percentage = analysis_percentages.get(dto.status, 0)
        dto.to_redis(redis_client=self.redis_client)
