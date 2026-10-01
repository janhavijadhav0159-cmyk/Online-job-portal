const {
  query
} = require("../db");

const {
  success,
  error
} = require("../helpers/response");

// ----------------------------------
// Get User Profile
// ----------------------------------

async function getProfile(req, res) {
  if (req.user.role === "user") {
    const result = await query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, "Profile not found", 404);
    }

    return success(
      res,
      result.rows[0],
      "Profile fetched successfully"
    );
  }

  if (req.user.role === "employer") {
    const result = await query(
      `
      SELECT
        id,
        company_name,
        email,
        phone,
        location,
        website,
        description,
        created_at
      FROM employers
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, "Profile not found", 404);
    }

    return success(
      res,
      result.rows[0],
      "Profile fetched successfully"
    );
  }

  return error(
    res,
    "Profile not available for this role",
    400
  );
}

// ----------------------------------
// Update User Profile
// ----------------------------------

async function updateProfile(req, res) {
  if (req.user.role !== "user") {
    return error(
      res,
      "This endpoint is only for job seekers",
      403
    );
  }

  const {
    name,
    phone
  } = req.body;

  if (!name || !name.trim()) {
    return error(res, "Name is required", 400);
  }

  const result = await query(
    `
    UPDATE users
    SET
      name = $1,
      phone = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING
      id,
      name,
      email,
      phone,
      created_at
    `,
    [
      name.trim(),
      phone || null,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return error(res, "Profile not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Profile updated successfully"
  );
}

// ----------------------------------
// Get User By ID - Admin
// ----------------------------------

async function getUserById(req, res) {
  const result = await query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      created_at
    FROM users
    WHERE id = $1
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "User not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "User profile fetched successfully"
  );
}

module.exports = {
  getProfile,
  updateProfile,
  getUserById
};