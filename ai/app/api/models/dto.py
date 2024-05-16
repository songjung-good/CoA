import json
from abc import ABCMeta
from typing import Union

from pydantic import BaseModel
from redis import Redis

from api.models.code import AnalysisStatus


class CommitScoreDto:
    def __init__(
            self,
            readability: int,
            performance: int,
            reusability: int,
            testability: int,
            exception: int,
            score_comment: str
    ):
        self.readability = readability
        self.performance = performance
        self.reusability = reusability
        self.testability = testability
        self.exception = exception
        self.score_comment = score_comment

    @property
    def total(self):
        return (self.readability + self.performance + self.reusability + self.testability + self.exception) // 5

    @staticmethod
    def from_dict(dct: dict) -> 'CommitScoreDto':
        return CommitScoreDto(
            readability=dct['readability'],
            performance=dct['performance'],
            reusability=dct['reusability'],
            testability=dct['testability'],
            exception=dct['exception'],
            score_comment=dct['scoreComment']
        )

    def to_camel_dict(self):
        return {
            'readability': self.readability,
            'performance': self.performance,
            'reusability': self.reusability,
            'testability': self.testability,
            'exception': self.exception,
            'total': self.total,
            'scoreComment': self.score_comment
        }


class AiResultDto:
    def __init__(
            self,
            total_commit_cnt: int,
            personal_commit_cnt: int,
            readme: str = '',
            repo_view_result: str = '',
            commit_score: CommitScoreDto | None = None,
            lines_of_code: dict[int, int] | None = None
    ):
        self.total_commit_cnt = total_commit_cnt
        self.personal_commit_cnt = personal_commit_cnt
        self.readme = readme
        self.repo_view_result = repo_view_result
        self.commit_score = commit_score
        self.lines_of_code = lines_of_code

    @staticmethod
    def from_dict(dct: dict) -> 'AiResultDto':
        return AiResultDto(
            total_commit_cnt=dct['totalCommitCnt'],
            personal_commit_cnt=dct['personalCommitCnt'],
            readme=dct['readme'],
            repo_view_result=dct['repoViewResult'],
            commit_score=dct['commitScore'],
            lines_of_code=dct['linesOfCode']
        )

    def to_camel_dict(self):
        return {
            'totalCommitCnt': self.total_commit_cnt,
            'personalCommitCnt': self.personal_commit_cnt,
            'readme': self.readme,
            'repoViewResult': self.repo_view_result,
            'commitScore': self.commit_score,
            'linesOfCode': self.lines_of_code
        }


class AnalysisDataDto:
    REDIS_KEY_PREFIX = "result:"

    def __init__(
            self,
            analysis_id: str | None,
            repo_path: str | None = None,
            project_id: str | None = None,
            user_name: str | None = None,
            member_id: int | None = None,
            is_own: bool | None = None,
            percentage: int | None = None,
            repo_start_date: str | None = None,
            repo_end_date: str | None = None,
            repo_member_cnt: int | None = None,
            result: AiResultDto | None = None,
            status: AnalysisStatus | None = None,
            expire_sec: int | None = None
    ):
        self.analysis_id = analysis_id
        self.repo_path = repo_path
        self.project_id = project_id
        self.user_name = user_name
        self.member_id = member_id
        self.is_own = is_own
        self.percentage = percentage
        self.repo_start_date = repo_start_date
        self.repo_end_date = repo_end_date
        self.repo_member_cnt = repo_member_cnt
        self.result = result
        self.status = status
        self.expire_sec = expire_sec

    @staticmethod
    def from_dict(analysis_id: str, dct: dict) -> 'AnalysisDataDto':
        return AnalysisDataDto(
            analysis_id=analysis_id,
            repo_path=dct.get('repoPath', None),
            project_id=dct.get('projectId', None),
            user_name=dct.get('userName', None),
            member_id=dct.get('memberId', None),
            is_own=dct.get('isOwn', None),
            percentage=dct.get('percentage', None),
            repo_start_date=dct.get('repoStartDate', None),
            repo_end_date=dct.get('repoEndDate', None),
            repo_member_cnt=dct.get('repoMemberCnt', None),
            result=AiResultDto.from_dict(dct['result']) if 'result' in dct else None,
            status=AnalysisStatus(int(dct.get('status', 000))),
            expire_sec=dct.get('expiredSec', None)
        )

    def to_camel_dict(self) -> dict:
        return {
            'analysisId': self.analysis_id,
            'repoPath': self.repo_path,
            'projectId': self.project_id,
            'userName': self.user_name,
            'memberId': self.member_id,
            'isOwn': self.is_own,
            'percentage': self.percentage,
            'repoStartDate': self.repo_start_date,
            'repoEndDate': self.repo_end_date,
            'repoMemberCnt': self.repo_member_cnt,
            'result': self.result.to_camel_dict() if self.result else None,
            'status': str(self.status),
            'expireSec': self.expire_sec
        }

    @staticmethod
    async def from_redis(redis_client: Redis, analysis_id: str) -> Union['AnalysisDataDto', None]:
        json_str: str | None = redis_client.get(AnalysisDataDto.REDIS_KEY_PREFIX + analysis_id)
        if json_str is None:
            return None
        return AnalysisDataDto.from_dict(analysis_id, json.loads(json_str))

    def to_redis(self, redis_client: Redis, **redis_set_args) -> None:
        redis_client.set(
            name=self.analysis_id,
            value=json.dumps(self, default=lambda obj: obj.to_camel_dict(), separators=(',', ':')),
            **redis_set_args
        )


class AnalysisRequest(BaseModel, metaclass=ABCMeta):
    """분석 요청에 대한 body DTO 추상 클래스"""
    analysisId: str
    userName: str


class GithubAnalysisRequest(AnalysisRequest):
    """Github 분석 요청에 대한 body DTO"""
    repoPath: str
    accessToken: str


class GitLabAnalysisRequest(AnalysisRequest):
    """GitLab 분석 요청에 대한 body DTO"""
    baseUrl: str
    projectId: str
    privateToken: str
