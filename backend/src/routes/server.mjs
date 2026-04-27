import cors from 'cors';
import express from "express";
import getGithubAnalysis from "../services/github-analytics.mjs";

const app = express()
app.use(cors({ origin: "http://localhost:5174" }));
/* 
req, res = requests, response

- First parameter of express is name of endpoint http, 
where reach our fn send by Handler.
- 'app' works as router and send response at path (endpoint)   
*/
app.get("/api/github", async (req, res) => {
    try {
        const data = await getGithubAnalysis();
        res.json(data);
        res.send("[INFO] API running");
    } catch (err) {
        res.status(500).json({ error: err.message }) // '500' Means internal Server Error 
    }
});

app.listen(3000, () => {
    console.log("[INFO] Server running in port 3000: http://localhost:3000/")
})