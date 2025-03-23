import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// Database Connection Pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();
