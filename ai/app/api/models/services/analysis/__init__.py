import traceback
from typing import TypeVar

from dependency_injector.wiring import Provide
from redis import Redis

from api.models.code import AnalysisStatus, analysis_percentages
from api.models.dto import AnalysisRequest, AnalysisDataDto
from api.models.services.client import RepoClient
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService:
    """분석 서비스"""

    def __init__(self, redis_client: Redis):
        self.redis_client = redis_client

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
            repo_data = await repo_client.load(request.userName)

            # total_commit_cnt, personal_commit_cnt 세기

            # AI 서비스 Lock 대기
            self._update_status(dto, AnalysisStatus.WAITING_AI)
            # TODO ...
            # ai_service = await ai_mutex.wait_for_ai_service()

            # AI에 학습 시키기
            self._update_status(dto, AnalysisStatus.LEARNING_DATA)
            # TODO ...
            # ai_service.learn(repo_data)

            # 대화해서 학습 결과 긁어오기
            self._update_status(dto, AnalysisStatus.GENERATING_README)
            # TODO ...
            # dto.result.readme = await ai_service.generate_readme()

            self._update_status(dto, AnalysisStatus.JUDGING_COMMITS)
            # TODO ...
            # dto.result.repo_view_result = await ai_service.judge_commits()

            self._update_status(dto, AnalysisStatus.SCORING_COMMITS)
            # TODO ...
            # dto.result.commit_score = ai_service.score_commits()

            # 학습 되돌리기
            self._update_status(dto, AnalysisStatus.RESETTING_LEARNED_DATA)
            # TODO ...
            # ai_service.reset_learning()
            # ai_mutex.unlock()

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
        dto.percentage = analysis_percentages[dto.status]
        dto.to_redis(redis_client=self.redis_client)
