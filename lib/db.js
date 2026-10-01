const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const databaseConfig = {
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
};

// Use DATABASE_URL if available
if (process.env.DATABASE_URL) {
  databaseConfig.connectionString = process.env.DATABASE_URL;

  if (process.env.NODE_ENV === "production") {
    databaseConfig.ssl = {
      rejectUnauthorized: false
    };
  }
} else {
  // Local PostgreSQL configuration
  databaseConfig.host = process.env.DB_HOST || "localhost";
  databaseConfig.port = process.env.DB_PORT || 5432;
  databaseConfig.database = process.env.DB_NAME || "online_job_portal";
  databaseConfig.user = process.env.DB_USER || "postgres";
  databaseConfig.password = process.env.DB_PASSWORD || "postgres";
}

const pool = new Pool(databaseConfig);

// Database error
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err.message);
});

// Test database connection
async function testConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully.");
    console.log("Database time:", result.rows[0].now);

    return result.rows[0];
  } finally {
    client.release();
  }
}

// Simple query function
async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result;
}

// Get database client
async function getClient() {
  return pool.connect();
}

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};