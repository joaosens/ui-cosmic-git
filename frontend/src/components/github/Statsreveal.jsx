import { useState, useEffect, forwardRef } from "react";
import { getGithubStats } from "../../services/api";

const StatsReveal = forwardRef(function StatsReveal({ onClick }, ref) {
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

    const topRepos = Array.isArray(data.topRepos) ? data.topRepos : [];
    const languageEntries = Object.entries(data.languages || {});

    return (
        <MainBox icon="📊" title="Stats" ref={ref} onClick={onClick} loading={loading}>
            <StatsSection icon="📦" title="Repository">
                <StatItem label="Total Repositories" value={<SlotMachine value={data.totalRepos} data={data}/>} />
                <StatItem
                    label="Top Repositories"
                    value={ <SlotMachine value={topRepos} data={data}/>
                    } highlight
                />
                <StatItem label="Latest" value={<SlotMachine value={data.latestRepo} data={data}/>} />
            </StatsSection>
            <StatsSection icon="🌟" title="Stars">
                <StatItem label="Total Stars" value={<SlotMachine value={data.totalStars} data={data}/>} />
                <StatItem label="Average" value={<SlotMachine value={data.avgStars} data={data}/>} />
            </StatsSection>

            <StatsSection icon="👾" title="Languages">
                <StatItem label="Top Language" value={<SlotMachine value={data.topLanguage} data={data}/>} highlight />
                <StatItem
                    label="Distribution"
                    value={
                        <ul className="space-y-1">
                            {languageEntries.map(([lang, count]) => (
                                <li key={lang}>
                                    🢒 {lang}: <span className="text-gray-400"><SlotMachine value={count} data={data}/></span>
                                </li>
                            ))}
                        </ul>
                    }
                />
            </StatsSection>
        </MainBox>
    );
});

const MainBox = forwardRef(function MainBox({icon, title, children, onClick}, ref){
    return (
        <div className="group relative z-40
        mx-auto my-8 max-w-[80%] 
        p-10 bg-white/5 
        backdrop-blur-md 
        ring-1 ring-white/10 
        rounded-xl 
        shadow-lg shadow-purple-500/50 
        cursor-pointer
        hover:shadow-purple-700/50 
        hover:scale-120
        transition-all duration-300
        animate-fadeIn" onClick={onClick} ref={ref}>    {/* Glassmorphism with FadeIn Animation*/}
            <h1 className="text-center text-2xl font-bold uppercase tracking-tight mb-10">
                <span className="mr-2">{icon}</span><span className={`text-white hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:text-purple-400 ${title} transition-all duration-300`}>{title}</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{children}</div></div> 
    )
});

function StatsSection({icon, title, children}) {
    return (
        <section>
            <h3 className="flex items-center text-indigo-400 font-bold uppercase text-xs tracking-widest mb-4">
                <span className="mr-2">{icon}</span>{title}</h3>
                <div className="space-y-5 pl-4 border-l border-white/10">{children}</div>
        </section>
    )
}

function StatItem({label, value, highlight = false}) {
    return (
        <div className="space-y-1">
            <p className= "text-gray-400 text-[9px] uppercase font-bold tracking-wider">{label}</p>
            <div className={`text-[11px] font-medium ${highlight ? "group-hover:text-indigo-300" : "text-white"}`}>{value}</div>
        </div>
    )
}

function SlotMachine({ value, data }) {

    const [offset, setOffset] = useState(0)

    const ITEM_HEIGHT = 15

    let items = []

    // ARRAY
    if (Array.isArray(value)) {

        items = value

    }

    // NUMBER
    else if (typeof value === "number") {

        const fakeNumbers = Array.from(
            { length: 20 },
            () => Math.floor(Math.random() * 100)
        )

        items = [...fakeNumbers, value]

    }
    else if (typeof value === "string") {

        const repoNames =
            data?.topRepos || []

        const languages =
            Object.keys(data?.languages || {})

        const fakeStrings = [
            ...repoNames,
            ...languages
        ]

        items = [...fakeStrings, ...fakeStrings, ...fakeStrings, ...fakeStrings, value]

    }

    const last =
        (items.length - 1)
        * ITEM_HEIGHT

    useEffect(() => {

        const interval = setInterval(() => {

            setOffset(prev => {

                if (prev >= last) {

                    clearInterval(interval)

                    return last
                }

                return prev + ITEM_HEIGHT

            })

        }, 120)

        return () => clearInterval(interval)

    }, [last])

    return (

        <div className="
            h-[15px]
            overflow-hidden
        ">

            <div
                className="
                    transition-transform
                    duration-100
                    ease-linear
                "
                style={{
                    transform:
                        `translateY(-${offset}px)`
                }}
            >

                {items.map((item, i) => (

                    <div
                        key={i}
                        className="
                            h-[15px]
                            flex
                            items-center
                            text-[11px]
                        "
                    >
                        {item}
                    </div>

                ))}

            </div>

        </div>
    )
}
export default StatsReveal;