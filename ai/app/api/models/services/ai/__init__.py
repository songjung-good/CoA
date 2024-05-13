from typing import Any

from langchain.chains.conversation.base import ConversationChain

from api.models.code import AnalysisStatus
from api.models.dto import CommitScoreDto
from api.models.services.ai.mutex import AiMutex
from exception import AnalysisException


class AiService:

    # TODO: 하드코드 파일로 옮기기
    CONVERSATION_START: str = """You are an useful repository readme file generator and also a code judge.
Your goal has 5 steps.
1. You must understand the content of the repository.
2. You must understand the commits that a contributor of the repository commited.
3. You must generate the template of README.md file according to given content of the repository. 
4. You must judge the code of the given commits, following some criteria.
5. You must score the code of the given commits, following your judgement.

From now on, Note that "---" stands for the start of the step and "^^^" stands for the end of the step.

Step 1, I inform you the content of the repository file by file, text files only.

If you understood the given file perfectly, send only "OK".
If you didn't understand some of the given file, send "NO" and say the reason following the next line and I'll stop the task.

The first line of the input is the file path.
From the second line, the contents of the file are given.
The form of the given will be:
- FILE PATH: <file path>
- FILE CONTENT:
<file content>

---
"""

    CONVERSATION_LEARNING: str = """^^^
Good.
    
Step 2, I inform you the commits' diff of a contributor of the repository.

If you understood the given commit diff perfectly, send only "OK".
If you didn't understand some of the given diff, send "NO" and say the reason following the next line and I'll stop the task.

The first line of the input is the file path.
From the second line, the contents of the file are given.
The form of the given will be:
- COMMIT ID: <commit id or sha>
- COMMIT DIFFS:
1.
<commit diff 1>
2.
<commit diff 2>
3.
...
 
---
"""

    CONVERSATION_README: str = """^^^
Good.

Step 3. You must generate README.md template according to repository content, in Korean.

Summary up with following paragraphs:
  - 주제
  - 서비스 설명
  - 프로젝트 전체 구현 기능
  - 기술 스택
  
Each paragraph should be seperated with "##"(Heading level 2).
---
"""

    CONVERSATION_JUDGING: str = """^^^
Good.

Step 4. You must judge the code of the given commits, following some criteria.

The criteria are:
 * Readability: How easy is it to read and understand the code?
 * Reusability: How much the code has been reused, and have few duplicates?
 * Performance: How quick the code perform its intended function?
 * Testability: Is the code easy to test and debug?
 * Exception Handling: Are there proper exception handling mechanisms implemented in the code?
  
Each paragraph should be seperated with "##"(Heading level 2).
---
"""

    def assert_ok(self, output: dict[str, Any]) -> None:
        if output['response'] != 'OK':
            raise AnalysisException(status=AnalysisStatus.LEARNING_DATA, msg=output['response'])

    async def train(self, conversation: ConversationChain, repo_data: dict[Any, Any]) -> None:
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

        output = conversation.invoke({'input': AiService.CONVERSATION_LEARNING})
        self.assert_ok(output)

        for commit in repo_data['commits']:
            patches = commit['patches']

            input_ = f"- COMMIT_ID: {commit['id']}\n"
            for i in range(len(patches)):
                input_ += f"{i + 1}."
                input_ += patches[i]

            output = conversation.invoke({'input': input_})
            self.assert_ok(output)

    async def generate_readme(self, conversation: ConversationChain) -> str:
        """
        리드미를 생성합니다.
        """
        output = conversation.invoke({'input': AiService.CONVERSATION_README})
        return output['response']

    async def score_commits(self, conversation: ConversationChain) -> CommitScoreDto:
        """
        평가한 커밋의 점수를 매깁니다.
        """
        pass        # TODO

    async def judge_commits(self, conversation: ConversationChain) -> str:
        """
        커밋을 평가하여 세 줄 정도의 리뷰를 얻습니다.
        """
        pass        # TODO