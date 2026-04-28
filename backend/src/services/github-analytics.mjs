import 'dotenv/config'

/*
node -> JavaScript runtime (runs JS outside the browser)
npm  -> package manager (installs libraries)

Modules:
- CommonJS (older default):
  const x = require('x')

- ES Modules (modern):
  import x from 'x'

To use ES Modules in Node:
package.json → { "type": "module" }

dotenv:
- loads variables from .env into process.env
*/

const TOKEN = process.env.TOKEN;
const HEADER = {
    headers: {
        Authorization: `Bearer ${TOKEN}`
    }
};

if (!TOKEN) {
    throw new Error("Missing TOKEN in environment");
}

/*
&&  → AND → returns the first falsy or the last value
||  → OR  → returns the first truthy
!   → NOT → inverts boolean
!!  → converts any value to boolean (true/false)
??  → nullish coalescing → only checks null or undefined
? : → TERNAR → example: condition ? true : false 
null = absence of value (similar to Python None)


--> Truthy & Falsy <--

Falsy (only these):
false
0
-0
0n
""
null
undefined
NaN

Truthy:
- everything else

Examples:
"0", "false", [], {}, function(){}, -1, Infinity → truthy
*/

/*
fetch → Web API (not part of core JS language)
- performs HTTP requests
- returns a Promise

response.ok:
- true  → status 200–299

IMPORTANT:
fetch does NOT throw on HTTP errors (e.g., 404)
→ you must manually check response.ok

throw → throws an error (similar to Python raise)

new → creates an instance of an object (e.g., new Error())
*/

async function getRepos(token) {
    const repositories = await fetch("https://api.github.com/user/repos?type=public", HEADER
    );
    const followers = await fetch("https://api.github.com/users/joaosens/followers", HEADER
    );
    const datas = [repositories, followers];
    for (let data of datas) {
        if (!data.ok) {
            throw new Error(`GitHub API Error: ${data.status}`);
        }
    }
    const [reposData, followersData,] = await Promise.all([
        repositories.json(),
        followers.json(),
    ]);
    return {
        repos: reposData,
        followers: followersData,
    }
}

/*
for...of → iterates over values (similar to "for x in list" in Python)

reduce() → aggregates array values into a single result
(acc = accumulator)

map() → transforms each element → returns a new array

slice() → returns a portion of the array (does not mutate)

sort() → sorts the array (MUTATES original!)
→ use [...array] to avoid mutation

spread (...) → creates a shallow copy of array/object
*/

function analyzeRepos(data) {
    const repos = data.repos.filter(
        (repo) => !repo.fork);
    const forks = data.repos.length - repos.length
    const totalStars = repos.reduce(
        (acc, repo) => acc + repo.stargazers_count,
        0
    );

    const languages = {};
    const datetimes = [];
    const owners = {};

    for (let repo of repos) {
        const lang = repo.language;
        const created_at = repo.created_at;
        const login = repo.owner.login;
        const avatar_url = repo.owner.avatar_url;
        const followers = data.followers.map((f) => f.login);

        if (lang) {
            if (!languages[lang]) languages[lang] = 0;
            languages[lang]++;
        }
        if (created_at) {
            datetimes.push(created_at)
        }
        if (!login) continue;
        if (!owners[login]) {
            owners[login] = {
                count: 0,
                avatar: avatar_url,
                followers: followers,
            };
        }
        owners[login].count++;
    }
    const validOwners = Object.values(owners).some((o) => o.count > 0);
    if (!validOwners) {
        throw new Error(`Any 'count' must be bigger than 0`)
    }
    const sortedOwners = Object.entries(owners).sort((a, b) => b[1].count - a[1].count);
    const [owner, ownerData] = sortedOwners[0];
    const latestDatetime = [...datetimes].map(d => new Date(d)).sort(
        (a, b) => b - a)[0];
    const verifyDate = [...datetimes].find(
        d => new Date(d).getTime() == latestDatetime.getTime());
    const latestCreated = verifyDate ? verifyDate : undefined;
    return {
        owner,
        forks,
        avatar: ownerData.avatar,
        followers: ownerData.followers,
        latestCreated: latestCreated,
        totalRepos: repos.length,
        totalStars,
        languages
    };
}

/*
Object → key-value data structure
 
Object.entries(obj):
→ converts into array of [key, value] pairs
Example:
{a:1} → [["a", 1]]
*/

function extraRepos(rawInfo, data) {
    const repos = data.repos.filter(repo => !repo.fork);
    const topLanguage = Object.entries(rawInfo.languages)
        .sort((a, b) => b[1] - a[1])[0][0];

    const avgStars = rawInfo.totalStars / repos.length;

    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3)
        .map(r => r.name);

    const latestRepo = [...repos].find((repo) => repo.created_at === rawInfo.latestCreated);
    const repoName = latestRepo ? latestRepo.name : undefined;

    return {
        owner: rawInfo.owner,
        avatar: rawInfo.avatar,
        followers: rawInfo.followers,
        latestRepo: repoName,
        forks: rawInfo.forks,
        totalRepos: rawInfo.totalRepos,
        totalStars: rawInfo.totalStars,
        avgStars: Number(avgStars.toFixed(2)),
        topLanguage: topLanguage,
        topRepos: topRepos,
        languages: rawInfo.languages,
    };
}

/*
Template literals:
`text ${variable}`
→ allows value interpolation
 
Arrow Function:
(x) => x * 2
→ similar lambda in python 
*/

let cache = null;

async function getGithubAnalysis() {
    if (cache) return cache
    try {
        const data = await getRepos();
        const rawInfo = analyzeRepos(data);
        const finalInfo = extraRepos(rawInfo, data);
        console.log("Final Analyze:", finalInfo);
        cache = finalInfo;

        return finalInfo;
    } catch (error) {
        console.error(`[ERROR]: ${error}`);
    }
}
getGithubAnalysis()
export default getGithubAnalysis