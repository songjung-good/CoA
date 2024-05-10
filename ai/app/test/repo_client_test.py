from api.models.dto import GithubAnalysisRequest
import asyncio
from dotenv import load_dotenv
import os

from api.models.services.client.github_rest import GithubRestClient


async def test_github():
    request = GithubAnalysisRequest()
    request.repoPath = "DoubleDeltas/CoaTest"
    request.accessToken = os.getenv("GITHUB_ACCESS_TOKEN")

    client = GithubRestClient(request)

    result = await client.load("DoubleDeltas")
    print('github complete:')
    print(result)


# async def test_gitlab():
#     client = GitLabClient(
#         base_url="https://lab.ssafy.com",
#         project_id=626637,
#         private_token=os.getenv('GITLAB_PRIVATE_TOKEN')
#     )
#
#     result = await client.load_commits("구본웅")
#     print('gitlab complete', len(result))

if __name__ == '__main__':
    load_dotenv()
    asyncio.run(test_github())
