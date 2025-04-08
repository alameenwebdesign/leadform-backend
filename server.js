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
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// PostgreSQL setup
const db = new pg.Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Example API
app.post("/submit", async (req, res) => {
  const {name, email} = req.body;
  if (!name || !email) {
    return res.status(400).json({message: "All fields are required"});
  }

  try {
    await db.query("INSERT INTO leads (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);
    res.status(200).json({message: "Successfully submitted!"});
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({message: "Server error"});
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
