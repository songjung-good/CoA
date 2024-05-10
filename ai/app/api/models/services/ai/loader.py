from typing import Iterator, TypeVar, Generic

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document


class RepoLoader(BaseLoader):
    """
    레포 내용과 커밋을 불러오는 LangChain Document Loader
    """

    def __init__(self, repo_content, repo_commits):
        self.repo_content = repo_content
        self.repo_commits = repo_commits

    def lazy_load(self) -> Iterator[Document]:
        for file in self.repo_content:
            yield Document(
                page_content=file['file_content'],
                metadata={
                    'type': 'content',
                    'file_path': file['path']
                }
            )

        for commit in self.repo_commits:
            for patch in commit['patches']:
                yield Document(
                    page_content=patch,
                    metadata={
                        'type': 'commit',
                        'commit_id': commit['id']
                    }
                )