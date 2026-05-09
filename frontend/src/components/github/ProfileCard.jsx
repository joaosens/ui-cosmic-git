import { useState, useEffect } from "react";
import { getGithubStats } from "../../services/api.mjs";

const USERNAME = "João Eduardo Sens"
const EMAIL = "joaoeduardo.analytics@gmail.com"
const LOCAL = "Curitiba Paraná"

function ProfileCard() { // Components mustn't be 'async'
    const [avatar, setAvatar] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const stats = await getGithubStats();
            setAvatar(stats.avatar);
        }
        fetchData();
    }, []);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL)
            alert("Email copied")
        } catch (err) {
            alert("Copy failed")
        }
    }
    return (
        <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl mt-8 p-6 h-[200px] w-[250px] shadow-lg shadow-purple-500/50 text-center shadow-md hover:shadow-purple-700/50 transition-all duration-300">
            {avatar && (
                <img
                    className="w-20 h-20 rounded-full mx-auto border-2 border-purple-500 shadow-md hover:ring-2 hover:ring-purple-400 transition-all"
                    src={avatar}
                    alt="Avatar"
                />
            )}
            <h1 className="mt-4 text-lg font-semibold p-[6px] tracking-wide"> 👤 {USERNAME}</h1>
            <p
                className="text-sm text-gray-400 p-[6px] hover:text-purple-400 transition"
                onClick={handleCopy}
            >
                📧 {EMAIL}
            </p>
            <p className="text-xs p-[6px] text-gray-500 mt-1">🗺️ {LOCAL}</p>
        </div>
    );
}

export default ProfileCard;