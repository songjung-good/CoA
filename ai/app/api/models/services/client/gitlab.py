import base64
from typing import Any

import requests
from pathspec import PathSpec
from requests import Response

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisRequest, GitLabAnalysisRequest
from api.models.services.client import RestRepoClient
from exception import AnalysisException


class GitLabClient(RestRepoClient[GitLabAnalysisRequest]):
    """
    GitLab REST API에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    """

    def __init__(self, request: GitLabAnalysisRequest, accept_spec: PathSpec, ignore_spec: PathSpec):
        """
        GitLab 클라이언트를 만듭니다.

        Parameters:
            base_url: GitLab 저장소 기본 URL (예: https://github.example.com)
            project_id: GitLab Project ID
        """
        super().__init__(request, accept_spec, ignore_spec)
        self.base_url = request.baseUrl
        self.project_id = request.projectId
        self.private_token = request.privateToken

    async def check_loadability(self, request: AnalysisRequest) -> AnalysisStatus | None:
        return None     # TODO - 일단은 항상 load할 수 있다고 생각합시다

    async def _request_get(self, url: str) -> Response:
        """
        특정 URL로 HTTP GET 요청을 보냅니다.

        Parameters:
            url: 요청을 보낼 URL

        Returns:
            응답 객체
        """
        headers = {}
        if self.private_token is not None:
            headers['PRIVATE-TOKEN'] = self.private_token

        return requests.get(url=url, headers=headers)

    async def load_content(self) -> list[dict[Any, Any]]:
        # TODO: 리팩토링은 나중에...

        result: list[dict[Any, Any]] = []

        tree_list = []

        tree_response = await self._request_get(
            f'https://lab.ssafy.com/api/v4/projects/{self.project_id}/repository/tree?per_page=100&recursive=1'
        )
        tree_response.raise_for_status()
        for file in tree_response.json():
            tree_list.append(file)
        next_url = self.__get_next_from_link(tree_response.headers['Link'])
        while True:
            tree_response = await self._request_get(next_url)
            tree_response.raise_for_status()
            for file in tree_response.json():
                tree_list.append(file)
            next_url = self.__get_next_from_link(tree_response.headers['Link'])
            if next_url is None:
                break

        for entry in tree_list:
            if entry['type'] == 'tree':     # 해당 entry는 directory
                continue
            print(entry)
            path = entry['path']
            if not self.accept_spec.match_file(path): # 허용된 파일인지 검사
                continue
            if self.ignore_spec.match_file(path):  # 무시할 파일일지 검사
                continue

            file_json = await self._request_json(
                f"https://lab.ssafy.com/api/v4/projects/{self.project_id}/repository/blobs/{entry['id']}"
            )

            try:
                encoded_content = file_json['content']
                decoded_content = base64.b64decode(encoded_content).decode('utf-8')

                result.append({
                    'file_path': entry['path'],
                    'file_content': decoded_content
                })
            except UnicodeDecodeError:      # binary file?
                continue

        return result

    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name: 커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits?author={author_name}'

    def _get_commit_id_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 ID를 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 ID
        """
        return commit_json["id"]

    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        commit_id = self._get_commit_id_from_commit(commit_json)
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits/{commit_id}/diff'

    def _get_files_from_diff(self, diff_json: Any) -> list[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json: 커밋 상세 JSON

        Returns:
            파일 정보 JSON 객체 리스트
        """
        return diff_json

    def _get_patch_from_file(self, file_json: Any) -> str | None:
        """
        커밋 상세 정보의 파일 정보에서 변경 내용(patch)를 가져옵니다.

        Parameters:
            file_json: 커밋 상세 JSON

        Returns:
            변경 내용
        """
        return file_json.get('diff', None)

    async def load_total_commit_cnt(self) -> int:
        """
        해당 레포에 총 커밋 개수를 불러옵니다.
        """
        url = f'https://lab.ssafy.com/api/v4/projects/{self.project_id}/repository/commits?per_page=1&page=1'
        try:
            return await self._load_page_cnt(url)
        except Exception:
            raise AnalysisException(AnalysisStatus.REPO_REQUEST_FAILED, msg="총 커밋 수 불러오기 실패")

    async def load_personal_commit_cnt(self, author_name: str) -> int:
        """
        해당 레포에 개인 커밋 개수를 불러옵니다.
        """
        url = f'https://lab.ssafy.com/api/v4/projects/{self.project_id}/repository/commits?per_page=1&page=1&author={author_name}'
        try:
            return await self._load_page_cnt(url)
        except Exception:
            raise AnalysisException(AnalysisStatus.REPO_REQUEST_FAILED, msg="개인 커밋 수 불러오기 실패")

    async def _load_page_cnt(self, url: str) -> int:
        response = await self._request_get(url)

        # link: <https://api.github.com/repositories/1300192/issues?page=2>; rel="prev", <https://api.github.com/repositories/1300192/issues?page=4>; rel="next", <https://api.github.com/repositories/1300192/issues?page=515>; rel="last", <https://api.github.com/repositories/1300192/issues?page=1>; rel="first"
        link = response.headers['Link']
        for section in link.split(', '):
            encased_url, rel_equals_rel = section.split('; ')
            if rel_equals_rel != 'rel="last"':
                continue
            rel_url = encased_url[1:-1]
            _, query_string = rel_url.split('?')
            queries = query_string.split('&')
            for query in queries:
                key, value = query.split('=')
                if key == 'page':
                    return int(value)

        raise Exception("응답 헤더 'link'에서 페이지 수 가져오기 실패")

    def __get_next_from_link(self, link_header: str) -> str | None:
        """
        응답 헤더 Link에서 다음 페이지 URL을 가져옵니다.
        """
        for section in link_header.split(', '):
            encased_url, rel_equals_rel = section.split('; ')
            if rel_equals_rel != 'rel="next"':
                continue
            rel_url = encased_url[1:-1]
            return rel_url
        return None