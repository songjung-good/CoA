import os

from dotenv import load_dotenv
from redis import Redis

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisDataDto, AiResultDto, CommitScoreDto

original_dto = AnalysisDataDto(
    analysis_id='0',
    repo_path='DoubleDeltas/MineCollector',
    project_id='0',
    user_name='DoubleDeltas',
    member_id=9,
    is_own=True,
    percentage=0,
    repo_start_date='2024-04-16',
    repo_end_date='2024-05-16',
    repo_member_cnt=1,
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
            exception=50,
            score_comment="점수 코멘트"
        ),
    ),
    status=AnalysisStatus.BEFORE_RECEIVING,
    expire_sec=86400,
)


if __name__ == '__main__':
    load_dotenv()

    redis_client = Redis(os.getenv('REDIS_HOST'), os.getenv('REDIS_PORT'))

    dto = original_dto
    dto.to_redis(redis_client, ex=60)

    print(redis_client.get('result:0'))

    # dto2 = AnalysisDataDto.from_redis(redis_client, '0')
    # print('TEST:', dto2.to_camel_dict())
    # print(type(dto2))

