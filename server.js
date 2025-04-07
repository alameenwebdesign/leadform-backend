import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend requests
    methods: "POST",
    credentials: true,
  })
);

const db = new pg.Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_NAME,
  port: process.env.PG_PORT || 5432,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL database!"))
  .catch((err) => console.error("Database connection failed:", err));

app.post("/submit", async (req, res) => {
  const {name, email} = req.body;
  if (!name || !email) {
    return res.status(400).json({message: "All fields are required"});
  }

  try {
    const sql = "INSERT INTO users (name, email) VALUES ($1, $2)";
    await db.query(sql, [name, email]);
    res.status(200).json({message: "Successfully submitted!"});
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({message: "Server error"});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
//
