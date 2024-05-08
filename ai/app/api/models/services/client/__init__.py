from abc import *
from abc import abstractmethod
from typing import Any


class RepoClient(metaclass=ABCMeta):
    """
    레포지토리에서 파일, 커밋 데이터를 가져오기 위한 클라이언트의 기본 클래스입니다.
    """

    @abstractmethod
    async def load(self, author_name: str) -> dict[Any, Any]:
        pass


class RestRepoClient(RepoClient, metaclass=ABCMeta):
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

    async def load(self, author_name: str) -> dict[Any, Any]:
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
