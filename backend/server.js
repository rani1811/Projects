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

app.listen(PORT, async() => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initDatabase();
});




/* ===========================
   AUTO DATABASE INIT
=========================== */
const initDatabase = async () => {
  try {
    // Create songs table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ songs table checked/created");

    // Check if table is empty
    const [rows] = await db.query("SELECT COUNT(*) as count FROM songs");

    if (rows[0].count === 0) {
      console.log("📦 Seeding initial songs...");

      await db.query(`
        INSERT INTO songs (title, artist, file_url) VALUES
        ('ilayaraja-best-flute', 'ilayaraja', '/music/ilayaraja-best-flute-65674.mp3'),
        ('love-bgm-tamil', 'love', '/music/love-bgm-tamil-65673.mp3'),
        ('radha-krishna-flute-theme-music', 'Modern', '/music/radha-krishna-flute-theme-music-pobitrosarkerpijush-ringtone-256k-m-65681.mp3'),
        ('vande-mataram', 'a-r-rehmman', '/music/vande-mataram-a-r-rahman-ringtone-download-mobcup-com-co-65965.mp3'),
        ('veer-lovetone', 'veer', '/music/veer-lovetone-19-65701.mp3')
      `);

      console.log("✅ Initial songs inserted");
    }
  } catch (err) {
    console.error("❌ Database init error:", err.message);
  }
};
