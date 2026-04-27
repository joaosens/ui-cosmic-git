import 'dotenv/config'

/*
========================
--> Runtime & Environment <--
========================

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

if (!TOKEN) {
    throw new Error("Missing TOKEN in environment");
}

/*
========================
--> Logical Operators <--
========================

&&  → AND → returns the first falsy or the last value
||  → OR  → returns the first truthy
!   → NOT → inverts boolean
!!  → converts any value to boolean (true/false)
??  → nullish coalescing → only checks null or undefined

null = absence of value (similar to Python None)
*/

/*
========================
--> Truthy & Falsy <--
========================

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
========================
--> Fetch & HTTP <--
========================

fetch → Web API (not part of core JS language)
- performs HTTP requests
- returns a Promise

response:
- object returned by fetch

response.ok:
- true  → status 200–299
- false → other status codes

IMPORTANT:
fetch does NOT throw on HTTP errors (e.g., 404)
→ you must manually check response.ok

throw → throws an error (similar to Python raise)

new → creates an instance of an object (e.g., new Error())
*/

async function getRepos(token) {
    const response = await fetch("https://api.github.com/user/repos?type=public", {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
    }

    return await response.json();
}

/*
========================
--> Arrays & Methods <--
========================

for...of → iterates over values (similar to "for x in list" in Python)

reduce() → aggregates array values into a single result
(acc = accumulator)

map() → transforms each element → returns a new array

slice() → returns a portion of the array (does not mutate)

sort() → sorts the array (MUTATES original!)
→ use [...array] to avoid mutation

spread (...) → creates a shallow copy of array/object
*/

function analyzeRepos(repos) {
    const totalStars = repos.reduce(
        (acc, repo) => acc + repo.stargazers_count,
        0
    );

    const languages = {};

    for (let repo of repos) {
        let lang = repo.language || "Unknown";

        if (!languages[lang]) {
            languages[lang] = 0;
        }

        languages[lang]++;
    }

    return {
        totalRepos: repos.length,
        totalStars,
        languages
    };
}

/*
========================
--> Objects & Utilities <--
========================

Object → key-value data structure

Object.entries(obj):
→ converts into array of [key, value] pairs

Example:
{a:1} → [["a", 1]]
*/

function extraRepos(rawInfo, repos) {
    const topLanguage = Object.entries(rawInfo.languages)
        .sort((a, b) => b[1] - a[1])[0][0];

    const avgStars = rawInfo.totalStars / repos.length;

    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3)
        .map(r => r.name);

    return {
        totalRepos: rawInfo.totalRepos,
        totalStars: rawInfo.totalStars,
        avgStars: avgStars,
        topLanguage: topLanguage,
        topRepos: topRepos,
        languages: rawInfo.languages,
    };
}

/*
========================
--> Strings & Syntax <--
========================

Template literals:
`text ${variable}`

→ allows value interpolation

Arrow Function:
(x) => x * 2

→ concise function syntax
*/

let cache = null;

async function getGithubAnalysis() {
    if (cache) return cache
    try {
        const repos = await getRepos();
        const rawInfo = analyzeRepos(repos);
        const finalInfo = extraRepos(rawInfo, repos);

        cache = finalInfo;
        //console.log("Final Analyze:", finalInfo);
        return finalInfo;
    } catch (error) {
        console.error(`[ERROR]: ${error}`);
    }
}

export default getGithubAnalysis