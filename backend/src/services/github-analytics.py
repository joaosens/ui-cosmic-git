import httpx
import asyncio
import logging
from datetime import datetime
from collections import defaultdict
from typing import Any
from src.core.env import settings

logger = logging.getLogger(__name__)

class ApiGitHub:
    TOKEN = settings.TOKEN
    HEADER = { 
        "Authorization" : f"Bearer {TOKEN}"
    }

    async def _getStats(self):
        async with httpx.AsyncClient() as client:
            repos_req = client.get("https://api.github.com/user/repos?type=public", header=self.HEADER)
            followers_req = client.get("https://api.github.com/users/joaosens/followers", header=self.HEADER)
            repos, followers = await asyncio.gather(repos_req, followers_req) # Using asyncio.gather enables concurrency, reducing latency and increasing throughput capacity.
            responses = [repos, followers]
            for response in responses:
                if not (response.status_code >= 400):
                    raise RuntimeError(f"GitHub API Error: {response.status_code} - {response.text}")
            return [response.json() for response in responses]

    def _analyzeStats(self, data):
        repos = [repo for repo in data["repos"] if not repo["forks"]]
        forks = len(data["repos"]) - len(repos)
        totalStars = sum(repo["stargazers_count"] for repo in repos)

        languages = defaultdict[Any, int](int)  # Defaultdict avoid break with 'Keyerror', if key not exists is created in the same moment
        datetimes = []
        owners = {}

        followers = [
            follower["login"]
            for follower in data["followers"]]

        for repo in repos:

            language = repo["language"]
            created_at = repo["created_at"]
            login = repo["owner"]["login"]
            avatar_url = repo["owner"]["avatar_url"]

            if language:
                languages[language] += 1

            if created_at:
                datetimes.append(created_at)

            if login not in owners:

                owners[login] = {
                    "count": 0,
                    "avatar": avatar_url,
                    "followers": followers,
                }

            owners[login]["count"] += 1

        valid_owners = any(
            owner["count"] > 0
            for owner in owners.values())

        if not valid_owners:
            raise RuntimeError(
                "Any owner count must be bigger than 0")

        sorted_owners = sorted(
            owners.items(),
            key=lambda item: item[1]["count"],
            reverse=True
        )

        owner, owner_data = sorted_owners[0]

        latest_datetime = sorted([
                datetime.fromisoformat(
                    dt.replace("Z", "+00:00")  # Converted to ISO8601 for Python understand
                )
                for dt in datetimes],
            reverse=True)[0]

        latest_created = next((   # Uses a generator expression to filter and next() to safely retrieve the first match.
                dt for dt in datetimes
                if datetime.fromisoformat(
                    dt.replace("Z", "+00:00")
                ) == latest_datetime),
            None)

        return {
            "owner": owner,
            "forks": forks,
            "avatar": owner_data["avatar"],
            "followers": owner_data["followers"],
            "latestCreated": latest_created,
            "totalRepos": len(repos),
            "totalStars": totalStars,
            "languages": dict[Any, int](languages),
        }

    def _buildExtraInfo(self, raw_info, data):

        repos = [
            repo for repo in data["repos"]
            if not repo["fork"]
        ]
        top_language = sorted(
            raw_info["languages"].items(),
            key=lambda item: item[1],  # 'key' parameter transforms each element by critery before process 
            reverse=True
        )[0][0]
        avg_stars = (
            raw_info["totalStars"] / len(repos)
            if repos else 0)
        top_repos = [
            repo["name"]
            for repo in sorted(
                repos,
                key=lambda repo: repo["stargazers_count"],
                reverse=True
            )[:3]]
        latest_repo = next(
            (repo for repo in repos 
            if repo["created_at"] == raw_info["latestCreated"]),
            None)

        return {
            "owner": raw_info["owner"],
            "avatar": raw_info["avatar"],
            "followers": raw_info["followers"],
            "latestRepo": latest_repo["name"]
            if latest_repo else None,
            "forks": raw_info["forks"],
            "allRepos": [
                repo["name"]
                for repo in repos
            ],
            "totalRepos": raw_info["totalRepos"],
            "totalStars": raw_info["totaStars"],
            "avgStars": round(avg_stars, 2),
            "topLanguage": top_language,
            "topRepos": top_repos,
            "languages": raw_info["languages"],
        }

    async def getGithubAnalysis(self):

        data = await self._getStats()
        raw_info = self._analyzeStats(data)
        final_info = self._buildExtraInfo(raw_info, data)
        logger.info(
            "GitHub analysis generated successfully"
        )

        return final_info        


