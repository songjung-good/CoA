from langchain.chains.conversation.base import ConversationChain
from langchain.memory import ConversationSummaryMemory, ConversationBufferMemory
from langchain_core.language_models import BaseChatModel


class AiMutex:

    def __init__(self, chat_model: BaseChatModel):
        self.chat_model = chat_model

    async def wait_for_conversation(self, conversation_id: str) -> ConversationChain:
        """
        AI 사용이 가능해질 때까지 대기 후, 사용 가능한 상태가 되면 conversation을 반환합니다.
        """
        # TODO: waiting (mutex?)

        return ConversationChain(
            llm=self.chat_model,
            memory=ConversationBufferMemory()
        )

    async def release(self, conversation: ConversationChain) -> None:
        """
        conversation을 소멸시키고 해당 conversation에 대한 AI 사용을 종료 처리합니다.
        """
        # TODO: unlocking mutex

        del conversation
