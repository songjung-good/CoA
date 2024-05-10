from langchain_core.language_models import BaseChatModel, BaseLLM


class AiService:
    def __init__(self, llm: BaseLLM, chat_model: BaseChatModel):
        self.llm: BaseLLM = llm
        self.chat_model: BaseChatModel = chat_model