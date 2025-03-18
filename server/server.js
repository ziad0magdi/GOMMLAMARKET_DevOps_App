const express = require("express");
const sql = require("mssql");
const db = require("./config/db");
const flash = require("connect-flash");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const env = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();

env.config();
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

let PORT = process.env.PORT;

const routesPath = path.join(__dirname, "./routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    app.use("/", route);
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route for notifications
app.get("/test", async (req, res) => {
  try {
    let pool = await db.getPool();
    if (pool) {
      return res.json({ isconnect: true });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return res
      .status(500)
      .json({ done: false, error: "Database connection failed" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Worker running at http://localhost:${PORT}`);
});
