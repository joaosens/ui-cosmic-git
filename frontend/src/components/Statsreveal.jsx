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
        <div className="mx-auto my-8 max-w-[80%] p-10 bg-black/30 backdrop-blur-md rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-700/50 transition-all border border-white/5">
            <h2 className="text-center text-2xl font-bold uppercase tracking-tight mb-10 hover:text-purple-400 transition-colors"> 
                📊 Stats 
            </h2>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* --- SEÇÃO REPOSITORY --- */}
                <section>
                    <h3 className="flex items-center text-indigo-400 font-bold uppercase text-xs tracking-widest mb-4">
                        <span className="mr-2">📦</span> Repository
                    </h3>
                    <div className="space-y-5 pl-4 border-l border-white/10">
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Total Repositories</p>
                            <p className="text-[11px] text-white font-medium">🢞 {data.totalRepos}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Top Repositories</p>
                            <ul className="space-y-1">
                                {Array.isArray(data.topRepos) && data.topRepos.map((repo) => (
                                    <li key={repo} className="text-[11px] text-white font-medium">➤ {repo}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Latest</p>
                            <p className="text-[11px] text-white font-medium">➤ {data.latestRepo}</p>
                        </div>
                    </div>
                </section>
    
                {/* --- SEÇÃO STARS --- */}
                <section>
                    <h3 className="flex items-center text-indigo-400 font-bold uppercase text-xs tracking-widest mb-4">
                        <span className="mr-2">🌟</span> Stars
                    </h3>
                    <div className="space-y-5 pl-4 border-l border-white/10">
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Total Stars</p>
                            <p className="text-[11px] text-white font-medium">🢞 {data.totalStars}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Average</p>
                            <p className="text-[11px] text-white font-medium">🢞 {data.avgStars}</p>
                        </div>
                    </div>
                </section>
    
                {/* --- SEÇÃO LANGUAGES --- */}
                <section>
                    <h3 className="flex items-center text-indigo-400 font-bold uppercase text-xs tracking-widest mb-4">
                        <span className="mr-2">👾</span> Languages
                    </h3>
                    <div className="space-y-5 pl-4 border-l border-white/10">
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Top Language</p>
                            <p className="text-[11px] text-white font-medium text-purple-400">🢒 {data.topLanguage}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[9px] uppercase font-bold mb-1">Distribution</p>
                            <ul className="space-y-1">
                                {Object.entries(data.languages).map(([lang, count]) => (
                                    <li key={lang} className="text-[11px] text-white font-medium">
                                        🢒 {lang}: <span className="text-gray-400">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default StatsReveal;