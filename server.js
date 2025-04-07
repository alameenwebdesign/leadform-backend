// server.js

import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow requests from ANY frontend (you can restrict later)
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// PostgreSQL setup
const db = new pg.Client({
  host: process.env.PGHOST, // Must be a real database host (example: render's db host or railway db host)
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGNAME,
  port: process.env.PGPORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Render needs SSL for PostgreSQL
  },
});

// Connect to DB
db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// API endpoint
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query("INSERT INTO leads (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);
    res.status(200).json({ message: "Lead saved successfully!" });
  } catch (error) {
    console.error("Error saving lead:", error);
    res.status(500).json({ message: "Failed to save lead" });
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
