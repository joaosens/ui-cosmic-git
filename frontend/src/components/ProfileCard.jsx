import { useState, useEffect } from "react";
import { getGithubStats } from "../services/api.mjs";

const username = "Joao Eduardo Sens"
const email = "joaoeduardo.analytics@gmail.com"
const local = "Curitiba, Paraná"

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
            await navigator.clipboard.writeText(email)
            alert("Email copied")
        } catch (err) {
            alert("Copy failed")
        }
    }
    return (
        <div className='card'>
            <h1>👤 {username}</h1>
            {avatar && <img src={avatar} alt="Avatar" />}
            <p onClick={handleCopy} style={{ cursor: "pointer" }}>📧 {email}</p>
            <p>🗺️ {local}</p>
        </div>
    );
}

export default ProfileCard;