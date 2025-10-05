import axios from "axios";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const TEMP_DIR = "./temp";

export const deployApp = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).send("Missing repo URL");

    // Clean temp directory
    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true });
    fs.mkdirSync(TEMP_DIR);

    console.log("Cloning repo...");
    const git = simpleGit();
    await git.clone(repoUrl, TEMP_DIR);

    // Check for package.json
    const pkgPath = path.join(TEMP_DIR, "package.json");
    if (!fs.existsSync(pkgPath)) {
      return res.status(400).send("Repo does not contain a web app!");
    }

    console.log("Installing dependencies...");
    execSync("npm install", { cwd: TEMP_DIR, stdio: "inherit" });

    console.log("Building app...");
    execSync("npm run build", { cwd: TEMP_DIR, stdio: "inherit" });

    console.log("Deploying to Vercel...");
    const response = await axios.post(
      "https://api.vercel.com/v13/deployments",
      {
        name: "github-preview",
        files: [],
        gitSource: { type: "github", repoUrl },
        projectSettings: { framework: "create-react-app" }
      },
      {
        headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` }
      }
    );

    res.json({ previewUrl: response.data.url });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
