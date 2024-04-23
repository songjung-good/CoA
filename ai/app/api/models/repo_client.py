from abc import *
import requests
from typing import Any, Dict, List


class RepoClient(metaclass=ABCMeta):
    """
    레포지토리에서 파일, 커밋 데이터를 가져오기 위한 클라이언트의 기본 클래스입니다.
    """

    @staticmethod
    def __request_json(url: str) -> Any:
        """
        특정 URL로 JSON 파일을 요청합니다.

        Parameters:
            url(str): 요청을 보낼 URL

        Returns:
            커밋 목록 JSON 객체
        """
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4XX and 5XX status codes
        return response.json()

    @abstractmethod
    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name(str):커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        pass

    @abstractmethod
    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commit_json(Any):커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        pass

    @abstractmethod
    def _get_files_from_diff(self, diff_json: Any) -> List[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json:커밋 상세 JSON

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


class GithubClient(RepoClient):
    """
    Github에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    """

    def __init__(self, path: str):
        """
        Github 클라이언트를 만듭니다.

        Parameters:
            path(str):Github 저장소 경로 (예: DoubleDeltas/MineCollector)
        """
        self.path = path

    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name (str):커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        return f'https://api.github.com/repos/{self.path}/commits?author={author_name}'

    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commits_json(Any):커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        return f'https://api.github.com/repos/{self.path}/commits/{commit_json["sha"]}'

    def _get_files_from_diff(self, diff_json: Any) -> List[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json(Any):커밋 상세 JSON

        Returns:
            파일 정보 JSON 객체 리스트
        """
        return diff_json['files']

    def _get_patch_from_file(self, file_json: Any) -> str:
        """
        커밋 상세 정보의 파일 정보에서 변경 내용(patch)를 가져옵니다.

        Parameters:
            file_json: 커밋 상세 JSON

        Returns:
            변경 내용
        """
        return file_json['patch']


class GitLabClient(RepoClient):
    """
    GitLab에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    """

    def __init__(self, base_url: str, project_id: int):
        """
        GitLab 클라이언트를 만듭니다.

        Parameters:
            base_url(str):GitLab 저장소 기본 URL (예: https://github.example.com)
            project_id(int):Project ID
        """
        self.base_url = base_url
        self.project_id = project_id

    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name (str):커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits?author={author_name}'

    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commit_json(Any):커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits/{commit_json["id"]}/diff'

    def _get_files_from_diff(self, diff_json: Any) -> List[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json(Any):커밋 상세 JSON

        Returns:
            파일 정보 JSON 객체 리스트
        """
        return diff_json

    def _get_patch_from_file(self, file_json: Any) -> str:
        """
        커밋 상세 정보의 파일 정보에서 변경 내용(patch)를 가져옵니다.

        Parameters:
            file_json: 커밋 상세 JSON

        Returns:
            변경 내용
        """
        return file_json['diff']
