import { useEffect, useState } from "react";
import { getGithubStats } from "./services/api";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const result = await getGithubStats();
        setData(result);
      } catch (error) {
        console.error(`[ERROR] ${error}`);
      } finally {
        setLoading(false)
      }
    } load();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (!data) return <h1>[ERROR] No data</h1>;
  return (
    <div className="stats">
      <h1>GitHub Stats</h1>
      <p>Total Repositories: {data.totalRepos}</p>
      <p>Total Stars: {data.totalStars}</p>
      <p>Top Language: {data.topLanguage}</p><br />
      <h2>Top Repositories</h2>
      <ul>{data.topRepos.map((repo) => (
        <li key={repo}>{repo}</li>
      ))}
      </ul>
    </div>
  );
}


export default App

