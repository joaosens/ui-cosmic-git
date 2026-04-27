export async function getGithubStats() {
    const res = await fetch("http://localhost:3000/api/github");
    if (!res.ok) throw new Error(`[ERROR] STATUS : ${res.status} ${res.statusText}`);
    return res.json();
}