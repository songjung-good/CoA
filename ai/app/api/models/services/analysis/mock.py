import asyncio
from typing import TypeVar, Any

from dependency_injector.wiring import inject, Provide

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisRequest, AnalysisDataDto, AiResultDto, CommitScoreDto
from api.models.services.analysis import AnalysisService
from api.models.services.client import RepoClient
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class MockAnalysisService(AnalysisService):
    """가짜 분석 서비스
    일정한 딜레이로 고정된 데이터를 보내줍니다.
    """

    @inject
    async def analyze(self, request: R) -> None:
        """
        분석을 시작합니다.
        DTO를 가져와 각 단계가 진행될 때마다 Redis에 상태를 업데이트합니다.

        Mock에서는 각 단계를 3초간 진행 후 'DONE' 상태일 때 고정된 값만을 반환합니다.
        """
        print(request)

        # DTO 가져오기
        dto: AnalysisDataDto = await AnalysisDataDto.from_redis(self.redis_client, request.analysisId)
        if dto is None:
            raise AnalysisException(AnalysisStatus.NO_REDIS_OBJECT)

        steps: list[AnalysisStatus] = [
            AnalysisStatus.REQUESTING_TO_REPO,
            AnalysisStatus.WAITING_AI,
            AnalysisStatus.LEARNING_DATA,
            AnalysisStatus.GENERATING_README,
            AnalysisStatus.JUDGING_COMMITS,
            AnalysisStatus.SCORING_COMMITS,
            AnalysisStatus.RESETTING_LEARNED_DATA,
            AnalysisStatus.DONE
        ]

        for step in steps:
            await asyncio.sleep(3)
            self._update_status(dto, step)

        dto.result = AiResultDto(
            total_commit_cnt=100,
            personal_commit_cnt=10,
            readme='안녕하세요',
            repo_view_result='짱입니다',
            commit_score=CommitScoreDto(
                readability=10,
                performance=20,
                reusability=30,
                testability=40,
                exception=50,
                score_comment='점수 코멘트입니다'
            ),
            lines_of_code={
                3001: 100,
                3002: 200
            }
        )

        dto.to_redis(self.redis_client)
