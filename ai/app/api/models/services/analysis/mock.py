import asyncio
from typing import Generic, TypeVar, Any

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisRequest, AnalysisDataDto, AiResultDto, CommitScoreDto
from api.models.services.analysis import AnalysisService
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class MockAnalysisService(Generic[R], AnalysisService[R]):
    """가짜 분석 서비스
    일정한 딜레이로 고정된 데이터를 보내줍니다.
    """

    async def analyze(self, request: R) -> None:
        """
        분석을 시작합니다.
        DTO를 가져와 각 단계가 진행될 때마다 Redis에 상태를 업데이트합니다.

        Mock에서는 각 단계를 3초간 진행 후 'DONE' 상태일 때 고정된 값만을 반환합니다.
        """

        # DTO 가져오기
        dto: AnalysisDataDto = AnalysisDataDto.from_redis(self.redis_client, request.analysisId)
        if dto is None:
            raise AnalysisException(AnalysisStatus.NO_REDIS_OBJECT)

        steps: list[AnalysisStatus] = [
            AnalysisStatus.REQUESTING_CONTENT,
            AnalysisStatus.REQUESTING_COMMITS,
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
            self.__update_status(dto, step)

        new_dto = AnalysisDataDto(
            analysis_id=dto.analysis_id,
            repo_path='DoubleDeltas/MineCollector',
            user_name='DoubleDeltas',
            result=AiResultDto(
                total_commit_cnt=100,
                personal_commit_cnt=10,
                readme='안녕하세요',
                repo_view_result='짱입니다',
                commit_score=CommitScoreDto(
                    readability=10,
                    performance=20,
                    reusability=30,
                    testability=40,
                    exception=50
                ),
                lines_of_code={
                    3001: 100,
                    3002: 200
                }
            ),
            percentage=100,
            status=AnalysisStatus.DONE
        )

        new_dto.to_redis(self.redis_client)

    async def assert_content_loadable(self, request: R) -> None:
        """
        레포에서 레포 내용을 가져올 수 있는지 미리 확인합니다. 내용을 모두 가져올 수 없다면 `AnalysisException``을 발생시킵니다.
        이 구현체에선 호출한 지 1초 후 '호출 가능'으로 평가합니다.
        """
        await asyncio.sleep(1)
        return

    async def assert_commits_loadable(self, request: R) -> None:
        """
        레포에서 커밋 내용을 가져올 수 있는지 미리 확인합니다. 내용을 모두 가져올 수 없다면 `AnalysisException``을 발생시킵니다.
        이 구현체에선 호출한 지 1초 후 '호출 가능'으로 평가합니다.
        """
        await asyncio.sleep(1)
        return

    async def load_content(self, request: R) -> dict[Any, Any]:
        """
        레포에서 레포 내용을 가져옵니다.
        이 구현체에선 호출한 지 3초 후 미리 정의된 고정값을 가져옵니다.
        """
        await asyncio.sleep(3)
        return {}

    async def load_commits(self, request: R) -> list[dict[Any, Any]]:
        """
        레포에서 커밋 내용을 가져옵니다.
        이 구현체에선 호출한 지 3초 후 미리 정의된 고정값을 가져옵니다.
        """
        await asyncio.sleep(3)
        return [
            {
                'id': '5c47a3c8c3892f5277680a3f0cb934a9843ab1a3',
                'patches': ['@@ -0,0 +1 @@\n+Hello, ssafy!']
            },
            {
                'id': '71541e9e6d7850a27476063d10313f5f6d1d9baf',
                'patches': ['@@ -0,0 +1,2 @@\n+# CoATest\n+test repo']
            }
        ]