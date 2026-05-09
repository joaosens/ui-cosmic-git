import cors from 'cors';
import express from "express";
import getGithubAnalysis from "../services/github-analytics.mjs";
import dotenv from 'dotenv';
import path from 'node:path'; 
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env")});


const app = express()
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173"] }));  // Allows traffic of another server 
/* 
req, res = requests, response

- First parameter of express is name of endpoint http, 
where reach our fn send by Handler.
- 'app' works as router and send response at path (endpoint)   
*/
app.get("/github", async (req, res) => {
    try {
        const data = await getGithubAnalysis();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message }) // '500' Means internal Server Error 
    }
});

app.listen(process.env.PORT, () => {
    console.log(`[INFO] Server running in port ${process.env.PORT}: http://localhost:/${process.env.PORT} \nIf you wanna API Stats: http://localhost:${process.env.PORT}/github`)
})