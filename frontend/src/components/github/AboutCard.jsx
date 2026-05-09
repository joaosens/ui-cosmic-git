import { useEffect, useState } from "react";
import { getGithubStats } from "../../services/api.mjs";

const ABOUTME = `
I am a systems builder focused on designing and developing end-to-end solutions that transform real-world problems into structured, scalable and production-oriented systems.
My core strength lies in Python-based data systems, automation and machine learning pipelines, where I have built and structured solutions involving data processing, API integrations, and backend architectures. I approach development with a strong emphasis on modularity, reproducibility and clarity, aiming to build systems that are not only functional, but maintainable and extensible.
Currently, I am expanding into fullstack development with JavaScript, focusing on building complete applications that integrate frontend, backend and external services. My goal is to bridge system design with product delivery, enabling faster iteration and real-world deployment.
I operate with a builder mindset: prioritizing execution, system thinking and continuous refinement. My current focus is on improving my ability to design and ship micro SaaS products that are reliable, consistent, user-oriented and built with speed — without compromising structure or quality.
I am committed to evolving toward engineering systems that are not just technically correct, but impactful, scalable and aligned with real-world use.
`

async function fetchData() {
    const stats = await getGithubStats()
    return stats;
}
function AboutCard() {
    return (
        <div className='w-lg mt-8 text-xs'>
            <h1>About Me</h1>
            <p className="text-center text-white mx-auto">{ABOUTME}</p>
            <h2>Tech Stack</h2>

            <h3>Languages</h3>
            <ul>
                <li>Python</li>
                <li>JavaScript</li>
                <li>SQL (PostgreSQL)</li>
            </ul>

            <h3>Data Engineering & ML</h3>
            <ul>
                <li>Pandas</li>
                <li>Numpy</li>
                <li>Scikit-learn</li>
                <li>SQLAlchemy</li>
            </ul>

            <h3>Automation</h3>
            <ul>
                <li>Selenium</li>
                <li>BeautifulSoup</li>
            </ul>

            <h3>Frontend</h3>
            <ul>
                <li>React</li>
                <li>Vite</li>
                <li>Tailwind CSS</li>
            </ul>

            <h3>Backend & APIs</h3>
            <ul>
                <li>FastAPI</li>
                <li>Node.js</li>
                <li>Express</li>
            </ul>

            <h3>DevOps & Tools</h3>
            <ul>
                <li>Docker</li>
                <li>Linux</li>
                <li>Logging</li>
                <li>Argparse</li>
            </ul>
        </div>
    );
}

export default AboutCard;