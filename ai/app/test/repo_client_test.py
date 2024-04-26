from app.api.models.repo_client import GithubClient, GitLabClient
import asyncio
from dotenv import load_dotenv
import os


async def test_github():
    client = GithubClient(
        path="DoubleDeltas/MineCollector",
        access_token=os.getenv('GITHUB_ACCESS_TOKEN')
    )

    result = await client.load("DoubleDeltas")
    print('github complete:', len(result))


async def test_gitlab():
    client = GitLabClient(
        base_url="https://lab.ssafy.com",
        project_id=626637,
        private_token=os.getenv('GITLAB_PRIVATE_TOKEN')
    )

    result = await client.load("구본웅")
    print('gitlab complete', len(result))

if __name__ == '__main__':
    load_dotenv()
    asyncio.run(test_github())
    asyncio.run(test_gitlab())
