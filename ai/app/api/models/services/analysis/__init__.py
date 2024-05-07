from abc import ABCMeta, abstractmethod
from typing import TypeVar, Generic, Any

from redis import Redis

from api.models.code import AnalysisStatus, status_to_percentages
from api.models.dto import AnalysisRequest, AnalysisDataDto
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService(Generic[R], metaclass=ABCMeta):
    # abstract class AnalysisService<R extends AnalysisRequest> { ... }
    """분석 서비스의 기본 클래스"""

    def __init__(self, redis_client: Redis):
        self.redis_client = redis_client

    async def analyze(self, request: R) -> None:
        """
        분석을 시작합니다.
        DTO를 가져와 각 단계가 진행될 때마다 Redis에 상태를 업데이트합니다.
        """
        # TODO: 각 단계를 나누어 추상 메소드를 호출하고 처리 상태 변경

        # DTO 가져오기
        dto: AnalysisDataDto = await AnalysisDataDto.from_redis(self.redis_client, request.analysisId)
        if dto is None:
            raise AnalysisException(AnalysisStatus.NO_REDIS_OBJECT)

        try:
            # 레포 요청 가능 여부 확인하기
            self._update_status(dto, AnalysisStatus.CHECKING_FOR_REQUESTING)
            await self.assert_content_loadable(request)
            await self.assert_commits_loadable(request)

            # 레포에서 내용 가져오기
            self._update_status(dto, AnalysisStatus.REQUESTING_CONTENT)
            content = await self.load_content(request)

            # 레포에서 데이터 가져오기
            self._update_status(dto, AnalysisStatus.REQUESTING_COMMITS)
            commits = await self.load_commits(request)

            # total_commit_cnt, personal_commit_cnt 세기

            # AI Context 생성
            # ai_context = AiContext(request, content, commits)

            # AI 서비스 Lock 대기
            self._update_status(dto, AnalysisStatus.WAITING_AI)
            # TODO ...
            # ai_service = await ai_mutex.wait_for_ai_service()

            # AI에 학습 시키기
            self._update_status(dto, AnalysisStatus.LEARNING_DATA)
            # TODO ...
            # ai_service.learn(ai_context)

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

        except Exception:   # 알 수 없는 내부 오류 발생!
            dto.percentage = 0
            self._update_status(dto, AnalysisStatus.INTERNAL_SERVER_ERROR)

    def _update_status(self, dto: AnalysisDataDto, next_status: AnalysisStatus) -> None:
        """
        Redis에 분석 상태를 업데이트합니다.
        """
        dto.status = next_status
        dto.percentage = status_to_percentages[dto.status]
        dto.to_redis(redis_client=self.redis_client)

    @abstractmethod
    async def assert_content_loadable(self, request: R) -> None:
        """
        레포에서 레포 내용을 가져올 수 있는지 미리 확인합니다. 내용을 모두 가져올 수 없다면 `AnalysisException``을 발생시킵니다.
        """
        pass

    @abstractmethod
    async def assert_commits_loadable(self, request: R) -> bool:
        """
        레포에서 커밋 내용을 가져올 수 있는지 미리 확인합니다. 내용을 모두 가져올 수 없다면 `AnalysisException``을 발생시킵니다.
        """
        pass

    @abstractmethod
    async def load_content(self, request: R) -> dict[Any, Any]:
        """
        레포에서 레포 내용을 가져옵니다.
        """
        pass

    @abstractmethod
    async def load_commits(self, request: R) -> list[dict[Any, Any]]:
        """
        레포에서 커밋 내용을 가져옵니다.
        """
        pass
