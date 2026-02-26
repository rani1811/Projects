const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* Serve frontend */
app.use(express.static(path.join(__dirname, "frontend")));

/* Serve music */
app.use(
  "/music",
  express.static(path.join(__dirname, "frontend/Playlist"))
);

/* API */
app.get("/api/songs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM songs");
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

/* Fallback */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
