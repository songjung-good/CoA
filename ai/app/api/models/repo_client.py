from abc import *

class RepoClient(metaclass=ABCMeta):
    u'''
    레포지토리에서 파일, 커밋 데이터를 가져오기 위한 클라이언트의 기본 클래스입니다.
    '''

    @abstractmethod
    def get_commits_root_url(self, author_name: str):
        u'''
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
        author_name(str):커밋 작성자 이름

        Returns:
        커밋 목록을 가져올 수 있는 API의 Root URL
        '''
        pass


class GithubClient(RepoClient):
    u'''
    Github에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    '''

    def __init__(self, path: str):
        u'''
        Github 클라이언트를 만듭니다.

        Parameters:
        path(str):Github 저장소 경로 (예: DoubleDeltas/MineCollector)
        '''
        self.path = path

    def get_commits_root_url(self, author_name: str):
        u'''
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
        author_name (str):커밋 작성자 이름

        Returns:
        커밋 목록을 가져올 수 있는 API의 Root URL
        '''
        return f'https://api.github.com/repos/{self.path}/commits?author={author_name}'


class GitLabClient(RepoClient):
    u'''
    GitLab에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    '''

    def __init__(self, base_url: str, project_id: int):
        u'''
        GitLab 클라이언트를 만듭니다.

        Parameters:
        base_url(str):GitLab 저장소 기본 URL (예: https://github.example.com)
        project_id(int):Project ID
        '''
        self.base_url = base_url
        self.project_id = project_id

    def get_commits_root_url(self, author_name: str):
        u'''
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
        author_name (str):커밋 작성자 이름

        Returns:
        커밋 목록을 가져올 수 있는 API의 Root URL
        '''
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits?author={author_name}'