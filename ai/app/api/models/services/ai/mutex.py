from langchain.chains.base import Chain
from langchain.chains.conversation.base import ConversationChain
from langchain.memory import ConversationBufferMemory

from api.models.services.ai.chains import AiChains


class AiMutex:

    def __init__(self, ai_chains: AiChains):
        self.ai_chains = ai_chains

    async def wait_for_readme_chain(self, conversation_id: str) -> Chain:
        """
        AI 사용이 가능해질 때까지 대기 후, 사용 가능한 상태가 되면 Readme 요청을 위한 Chain을 반환합니다.
        """
        # TODO: waiting (mutex?)

        return self.ai_chains.readme_map_reduce_chain

    async def wait_for_commit_chain(self, conversation_id: str) -> Chain:
        """
        AI 사용이 가능해질 때까지 대기 후, 사용 가능한 상태가 되면 Commit 요청을 위한 Chain을 반환합니다.
        """
        # TODO: waiting (mutex?)

        return self.ai_chains.commit_map_reduce_chain

    async def release(self, chain: Chain) -> None:
        """
        conversation을 소멸시키고 해당 conversation에 대한 AI 사용을 종료 처리합니다.
        """
        # TODO: unlocking mutex
        pass
