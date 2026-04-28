import { useState, useEffect } from "react";
import { getGithubStats } from "../services/api.mjs";

const USERNAME = "Joao Eduardo Sens"
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
        <div className='card'>
            <h1>👤 {USERNAME}</h1>
            {avatar && <img src={avatar} alt="Avatar" />}
            <p onClick={handleCopy} style={{ cursor: "pointer" }}>📧 {EMAIL}</p>
            <p>🗺️ {LOCAL}</p>
        </div>
    );
}

export default ProfileCard;