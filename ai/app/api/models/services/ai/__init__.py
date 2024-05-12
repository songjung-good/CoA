from typing import Any

from langchain.chains.conversation.base import ConversationChain

from api.models.code import AnalysisStatus
from api.models.dto import CommitScoreDto
from api.models.services.ai.mutex import AiMutex
from exception import AnalysisException


class AiService:

    CONVERSATION_START: str = """You are an useful repository readme file generator and also a code judge.
Your goal has 4 steps.
- You must understand the content of the repository.
- You must understand the commits of the repository that some contributer commited.
- You must generate the template of README.md file according to given content of the repository. 
- You must judge the code of the given commits, following some criteria.

From now on, Note that "---" stands for the start of the step and "^^^" stands for the end of the step.

Firstly, I inform you the content of the repository file by file, text files only.

If you understood the given file perfectly, send only "OK".
If you didn't understand some of the given file, send "NO" and say the reason following the next line and I'll stop the task.

The first line of the input is the file path.
From the second line, the contents of the file are given.
The form of the given will be:
- FILE PATH: <FILE_PATH>
- FILE CONTENT:
<FILE_CONTENT>

---
"""

    def assert_ok(self, output: dict[str, Any]) -> None:
        if output['response'] != 'OK':
            raise AnalysisException(status=AnalysisStatus.LEARNING_DATA, msg=output['response'])


    async def train(self, conversation: ConversationChain, repo_data: dict[Any, Any]):
        """
        conversation에 레포 데이터를 학습시킵니다.
        """
        output = conversation.invoke({'input': AiService.CONVERSATION_START})
        self.assert_ok(output)

        print(output['response'])

        for file in repo_data['content']:
            output = conversation.invoke({
                'input': f"- FILE PATH: {file['file_path']}\n- FILE CONTENT:\n{file['file_content']}"
            })
            self.assert_ok(output)


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