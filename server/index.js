import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import repoRouter from "./routes/repoRoutes.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//app.get("/api/github/user/:username", async );

//app.get("/api/github/user/:username/repos");

//app.get("/api/github/user/:username/events/public");

//app.get("/api/github/user/:username/contributions", );

app.use("/api/github/user/", repoRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
