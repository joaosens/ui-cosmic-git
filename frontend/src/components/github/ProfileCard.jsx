import { useState, useEffect } from "react";
import { getGithubStats } from "../../services/api.mjs";

const USERNAME = "João Eduardo Sens"
const EMAIL = "joaoeduardo.analytics@gmail.com"
const LOCAL = "Curitiba Paraná"

function ProfileCard() { // Components mustn't be 'async'
    const [avatar, setAvatar] = useState(null);
    const [popupAvatar, setPopupAvatar] = useState(false);
    useEffect(() => {
        async function fetchData() {
            var stats = await getGithubStats();
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
        <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl mt-8 p-6 h-[400px] w-[400px] shadow-lg shadow-purple-500/50 text-center shadow-md hover:shadow-purple-700/50 transition-all duration-300">
            {avatar && (
                <img
                    onClick={()=> setPopupAvatar(true)} className="w-30 h-30 rounded-full mx-auto border-2 border-purple-500 shadow-[5px_5px_20px_rgba(0,0,0,1)] cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
                    src={avatar}
                    alt="Avatar"
                />
            )}{setPopupAvatar && (<div onClick={() => setPopupAvatar(false)} className="fixed inset-0 z-40 flex items-center justify-center">
                <div className="relative"> 
                    <img className="w-80 h-80 rounded-lg" src={avatar} alt="Popup-Avatar"/>
                    <button onClick={() => setPopupAvatar(false)} className="absolute -top-[0px] -right-[0px] w-8 h-8 bg-red-500 text-white cursor-pointer">X</button></div>
            </div>)}
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