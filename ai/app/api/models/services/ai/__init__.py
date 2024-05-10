from typing import Any

from langchain.chains.conversation.base import ConversationChain

from api.models.dto import CommitScoreDto
from api.models.services.ai.mutex import AiMutex


class AiService:
    pass

    async def train(self, conversation: ConversationChain, repo_data: dict[Any, Any]):
        """
        conversation에 레포 데이터를 학습시킵니다.
        """
        pass        # TODO

    async def generate_readme(self, conversation: ConversationChain) -> str:
        """
        리드미를 생성합니다.
        """
        pass        # TODO

    async def judge_commits(self, conversation: ConversationChain) -> str:
        """
        커밋을 평가하여 세 줄 정도의 리뷰를 얻습니다.
        """
        pass        # TODO

    async def score_commits(self, conversation: ConversationChain) -> CommitScoreDto:
        """
        평가한 커밋의 점수를 매깁니다.
        """
        pass        # TODO