import json
from typing import Any

from langchain.chains.base import Chain
from langchain_core.documents import Document

from api.models.dto import CommitScoreDto


class AiService:

    async def preprocess_content(self, file_data: list[dict[Any, Any]]) -> list[Document]:
        pass # TODO

    async def preprocess_commits(self, commit_data: list[dict[Any, Any]]) -> list[Document]:
        pass # TODO

    async def generate_readme(self, chain: Chain, data: list[Document]) -> str:
        """
        리드미를 생성합니다.
        """
        return chain.invoke(data)['output_text']

    async def score_commits(self, chain: Chain, data: list[Document]) -> CommitScoreDto:
        """
        평가한 커밋의 점수를 매깁니다.
        """
        output = chain.invoke(data)['output_text']
        dct = json.loads(output)
        return CommitScoreDto.from_dict(dct)
