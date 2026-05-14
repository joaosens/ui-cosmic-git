import asyncio
import logging
from collections import defaultdict
from datetime import datetime

import httpx

from src.core.env import settings

logger = logging.getLogger(__name__)


class GitHubApi:

    TOKEN = settings.TOKEN

    HEADERS = {
        "Authorization": f"Bearer {TOKEN}"
    }

    async def _get_stats(self):

        async with httpx.AsyncClient() as client:

            repos_req = client.get(
                "https://api.github.com/user/repos?type=public",
                headers=self.HEADERS
            )

            followers_req = client.get(
                "https://api.github.com/users/joaosens/followers",
                headers=self.HEADERS
            )

            repos, followers = await asyncio.gather(
                repos_req,
                followers_req
            )

            responses = [repos, followers]

            for response in responses:

                if response.status_code >= 400:

                    raise RuntimeError(
                        f"GitHub API Error: "
                        f"{response.status_code} - {response.text}"
                    )

            return {
                "repos": repos.json(),
                "followers": followers.json(),
            }

    def _analyze_stats(self, data):

        repos = [
            repo for repo in data["repos"]
            if not repo["fork"]
        ]

        forks = len(data["repos"]) - len(repos)

        total_stars = sum(
            repo["stargazers_count"]
            for repo in repos
        )

        languages = defaultdict(int)

        datetimes = []

        owners = {}

        followers = [
            follower["login"]
            for follower in data["followers"]
        ]

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
            for owner in owners.values()
        )

        if not valid_owners:

            raise RuntimeError(
                "Any owner count must be bigger than 0"
            )

        sorted_owners = sorted(
            owners.items(),
            key=lambda item: item[1]["count"],
            reverse=True
        )

        owner, owner_data = sorted_owners[0]

        latest_datetime = sorted(
            [
                datetime.fromisoformat(
                    dt.replace("Z", "+00:00")
                )
                for dt in datetimes
            ],
            reverse=True
        )[0]

        latest_created = next(
            (
                dt for dt in datetimes
                if datetime.fromisoformat(
                    dt.replace("Z", "+00:00")
                ) == latest_datetime
            ),
            None
        )

        return {
            "owner": owner,
            "forks": forks,
            "avatar": owner_data["avatar"],
            "followers": owner_data["followers"],
            "latest_created": latest_created,
            "total_repos": len(repos),
            "total_stars": total_stars,
            "languages": dict(languages),
        }

    def _build_extra_info(self, raw_info, data):

        repos = [
            repo for repo in data["repos"]
            if not repo["fork"]
        ]

        top_language = sorted(
            raw_info["languages"].items(),
            key=lambda item: item[1],
            reverse=True
        )[0][0]

        avg_stars = (
            raw_info["total_stars"] / len(repos)
            if repos else 0
        )

        top_repos = [
            repo["name"]
            for repo in sorted(
                repos,
                key=lambda repo: repo["stargazers_count"],
                reverse=True
            )[:3]
        ]

        latest_repo = next(
            (
                repo for repo in repos
                if repo["created_at"] == raw_info["latest_created"]
            ),
            None
        )

        return {
            "owner": raw_info["owner"],
            "avatar": raw_info["avatar"],
            "followers": raw_info["followers"],
            "latest_repo": latest_repo["name"]
            if latest_repo else None,
            "forks": raw_info["forks"],
            "all_repos": [
                repo["name"]
                for repo in repos
            ],
            "total_repos": raw_info["total_repos"],
            "total_stars": raw_info["total_stars"],
            "avg_stars": round(avg_stars, 2),
            "top_language": top_language,
            "top_repos": top_repos,
            "languages": raw_info["languages"],
        }

    async def get_github_analysis(self):

        data = await self._get_stats()

        raw_info = self._analyze_stats(data)

        final_info = self._build_extra_info(raw_info, data)

        logger.info(
            "GitHub analysis generated successfully"
        )

        return final_info


github_api = GitHubApi()