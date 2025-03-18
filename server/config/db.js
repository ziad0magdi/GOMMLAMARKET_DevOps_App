const sql = require("mssql");
const env = require("dotenv");
env.config();

const host = process.env.DB_HOST;
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
    charset: "UTF-8",
  },
  driver: "msnodesqlv8",
};

let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log(`Database connection pool initialized on ${host}`);
    } catch (err) {
      console.error("Error initializing database pool:", err);
      throw err;
    }
  }
  return pool;
}

async function executeQuery(query, params = {}) {
  const pool = await getPool();
  try {
    const request = pool.request();
    // Adding parameters to the query
    Object.keys(params).forEach((key) => {
      request.input(key, params[key]);
    });
    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}

const cleanup = async () => {
  if (pool) {
    console.log("Closing database connection pool...");
    await pool.close();
  }
  process.exit(0);
};

process.on("exit", cleanup);
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

module.exports = {
  getPool,
  cleanup,
  executeQuery,
  host,
};
