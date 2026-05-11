const baseUrl = import.meta.env.VITE_API_URL; // Try find '.env' in root directory executed

export async function getGithubStats() {
    const res = await fetch(`${baseUrl}/github`);
    if (!res.ok) throw new Error(`[ERROR] STATUS : ${res.status} ${res.statusText}`);
    return res.json();
}
