import { useState, useEffect } from "react";
import { getGithubStats } from "../services/api";

function StatsReveal() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const req = await getGithubStats();
                setData(req);
            } catch (err) {
                console.error("[ERROR]", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    function StatItem({label, value}) {
        return(
            <div className="flex justify-between text-sm"></div>
        )
    }
    if (loading)
        return (
            <h1 className="text-center text-white/50 font-bold animate-pulse space-y-4">
                Loading...
            </h1>
        );
    if (!data) return (
        <>
            <h1>[ERROR] No data</h1>
            <p>Try Again ↻</p>
        </>
    );
    return (
        <div style={{
            textAlign: "center",
            marginTop: "40px",
        }}>
            <h2> 📊 Stats</h2>
            <h3> 📦 Repository</h3>
            <p>Total Repositories: {data.totalRepos}</p>
            <ul>Top Repositories
                {Array.isArray(data.topRepos) &&
                    data.topRepos.map((repo) => (
                        <li key={repo}>{repo}</li>
                    ))}
            </ul>
            <p>Latest Repository: {data.latestRepo}</p>
            <p>Total Forks: {data.forks}</p>
            <h3>🌟 Stars</h3>
            <p>Total Stars: {data.totalStars}</p>
            <p>Average Stars: {data.avgStars}</p>
            <h3>👾 Languages</h3>
            <p>Top Language: {data.topLanguage}</p>
            <ul>
                {Object.entries(data.languages).map(([lang, count]) => (
                    <li key={lang}>
                        {lang}:{count}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default StatsReveal;