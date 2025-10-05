import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

app.post("/preview", (req, res) => {
  const { repo } = req.body;
  res.json({ message: `Received repo: ${repo}` });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
    