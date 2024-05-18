import json
import logging
import time
from typing import Any

from langchain.chains.base import Chain
from langchain_community.callbacks import get_openai_callback
from langchain_core.documents import Document
from langchain_text_splitters import TextSplitter

from api.models.dto import CommitScoreDto
from api.models.services.ai.loader import RepoContentLoader, RepoCommitLoader


class AiService:
    def __init__(self, text_splitter: TextSplitter):
        self.text_splitter = text_splitter

    async def preprocess_content(self, file_data: list[dict[Any, Any]]) -> list[Document]:
        content_loader = RepoContentLoader(file_data)
        docs = content_loader.load()
        split_docs = self.text_splitter.split_documents(docs)
        return split_docs

    async def preprocess_commits(self, commit_data: list[dict[Any, Any]]) -> list[Document]:
        commit_loader = RepoCommitLoader(commit_data)
        docs = commit_loader.load()
        split_docs = self.text_splitter.split_documents(docs)
        return split_docs

    async def generate_readme(self, chain: Chain, data: list[Document]) -> str:
        """
        리드미를 생성합니다.
        """
        with get_openai_callback() as cb:
            start = time.time()

            result = chain.invoke(data)['output_text']

            end = time.time()

            logging.debug('README TOTAL TOKEN CNT: ' + str(cb.total_tokens))
            logging.debug('README TOTAL TOKEN COST: ' + f'$ {cb.total_cost:.6f}')
            logging.debug('README TOTAL TIME: ' + f'{end - start:.2f} secs')
            return result

    async def score_commits(self, chain: Chain, data: list[Document]) -> CommitScoreDto:
        """
        평가한 커밋의 점수를 매깁니다.
        """
        with get_openai_callback() as cb:
            start = time.time()

            output = chain.invoke(data)['output_text']
            dct = json.loads(output)
            result = CommitScoreDto.from_dict(dct)

            end = time.time()

            logging.debug('COMMITS TOTAL TOKEN CNT: ' + str(cb.total_tokens))
            logging.debug('COMMITS TOTAL TOKEN COST: ' + f'$ {cb.total_cost:.6f}')
            logging.debug('COMMITS TOTAL TIME: ' + f'{end - start:.2f} secs')

            return result
