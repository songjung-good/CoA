from abc import *
from abc import abstractmethod
from typing import Any, TypeVar, Generic

from requests import HTTPError, Timeout

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisRequest
from exception import AnalysisException

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class RepoClient(Generic[R], metaclass=ABCMeta):
    """
    레포지토리에서 파일, 커밋 데이터를 가져오기 위한 클라이언트의 기본 클래스입니다.
    """

    HTTP_STATUS_TO_ANALYSIS_STATUS: dict[int, AnalysisStatus] = {
        401: AnalysisStatus.REPO_TOKEN_ERROR,
        403: AnalysisStatus.ACCESS_TOKEN_INVALID
    }

    @abstractmethod
    def __init__(self, request: R):
        pass

    @abstractmethod
    async def check_loadability(self, request: AnalysisRequest) -> AnalysisStatus | None:
        """
        레포 API로부터 데이터를 가져올 수 있을 지 미리 확인합니다.

        Returns:
            레포 API에서 데이터를 가져올 수 없는 원인으로 추측되는 상태, 없으면 ``None``.
        """
        pass

    async def load(self, author_name: str) -> dict[Any, Any]:
        try:
            return await self._load_repo_data(author_name)
        except HTTPError as err:
            analysis_status = RepoClient.HTTP_STATUS_TO_ANALYSIS_STATUS.get(
                err.response.status_code,
                AnalysisStatus.REPO_REQUEST_FAILED
            )
            raise AnalysisException(analysis_status)
        except Timeout:
            raise AnalysisException(AnalysisStatus.REPO_REQUEST_TIMEOUT)

    @abstractmethod
    async def _load_repo_data(self, author_name: str) -> dict[Any, Any]:
        pass


class RestRepoClient(Generic[R], RepoClient[R], metaclass=ABCMeta):
    """
    REST API를 통해 레포에서 파일, 커밋 데이터를 가져오기 위한 클라이언트의 기본 클래스입니다.
    """

    @abstractmethod
    async def _request_json(self, url: str) -> Any:
        """
        특정 URL로 JSON 파일을 요청합니다.

        Parameters:
            url: 요청을 보낼 URL

        Returns:
            커밋 목록 JSON 객체
        """
        pass

    async def _load_repo_data(self, author_name: str) -> dict[Any, Any]:
        return {
            'content': await self.load_content(),
            'commits': await self.load_commits(author_name)
        }

    async def load_content(self) -> list[dict[Any, Any]]:
        # TODO
        pass

    async def load_commits(self, author_name: str) -> list[dict[Any, Any]]:
        """
        특정 작성자가 작성한 커밋의 변경 내용을 가져옵니다.

        Parameters:
            author_name: 커밋 작성자 이름

        Returns:
            커밋 별 변경사항 리스트
        """
        commits = []
        commits_json = await self._request_json(self._get_commits_root_url(author_name))
        for commit_json in commits_json:
            commit = {
                'id': self._get_commit_id_from_commit(commit_json),
                'patches': []
            }

            diff_json = await self._request_json(self._get_diff_url_from_commit(commit_json))
            files_json = self._get_files_from_diff(diff_json)
            for file_json in files_json:
                patch = self._get_patch_from_file(file_json)
                commit['patches'].append(patch)

            commits.append(commit)

        return commits

    @abstractmethod
    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name: 커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        pass

    @abstractmethod
    def _get_commit_id_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 ID를 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 ID
        """
        pass

    @abstractmethod
    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        pass

    @abstractmethod
    def _get_files_from_diff(self, diff_json: Any) -> list[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json: 커밋 상세 JSON

        Returns:
            파일 정보 JSON 객체 리스트
        """
        pass

    @abstractmethod
    def _get_patch_from_file(self, file_json: Any) -> str:
        """
        커밋 상세 정보의 파일 정보에서 변경 내용(diff, patch)를 가져옵니다.

        Parameters:
            file_json: 커밋 상세 JSON

        Returns:
            변경 내용
        """
        pass
