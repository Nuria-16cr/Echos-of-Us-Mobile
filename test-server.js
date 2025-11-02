import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  console.log("Request received:", req.body);
  res.json({ reply: "Test reply from server" });
});

app.listen(5000, () => console.log("Test server running on port 5000"));
