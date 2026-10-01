const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "../.env")
});

const { query, testConnection } = require("../lib/db");

async function createAdmin() {
  try {
    console.log("Connecting to database...");

    await testConnection();

    const name = "Admin";
    const email = "admin@jobportal.com";
    const password = "admin123";

    // Check whether admin already exists
    const existingAdmin = await query(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("Admin already exists.");
      console.log(`Email: ${email}`);
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await query(
      `INSERT INTO admins
       (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, passwordHash]
    );

    console.log("----------------------------------");
    console.log("Admin created successfully!");
    console.log("----------------------------------");
    console.log("Admin ID :", result.rows[0].id);
    console.log("Name     :", result.rows[0].name);
    console.log("Email    :", result.rows[0].email);
    console.log("Password : admin123");
    console.log("----------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:");
    console.error(error.message);

    process.exit(1);
  }
}

createAdmin();