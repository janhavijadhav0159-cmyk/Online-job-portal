const {
  query
} = require("../db");

const {
  success,
  error
} = require("../helpers/response");

// ----------------------------------
// Get All Employers
// ----------------------------------

async function getEmployers(req, res) {
  const {
    search,
    location
  } = req.query;

  let sql = `
    SELECT
      e.id,
      e.company_name,
      e.email,
      e.phone,
      e.location,
      e.website,
      e.description,
      e.created_at,
      COUNT(j.id)::integer AS job_count
    FROM employers e
    LEFT JOIN jobs j
      ON e.id = j.employer_id
  `;

  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);

    conditions.push(`
      (
        e.company_name ILIKE $${params.length}
        OR e.description ILIKE $${params.length}
      )
    `);
  }

  if (location) {
    params.push(`%${location}%`);

    conditions.push(
      `e.location ILIKE $${params.length}`
    );
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += `
    GROUP BY e.id
    ORDER BY e.company_name ASC
  `;

  const result = await query(sql, params);

  return success(
    res,
    result.rows,
    "Employers fetched successfully"
  );
}

// ----------------------------------
// Get Employer Details
// ----------------------------------

async function getEmployerById(req, res) {
  const result = await query(
    `
    SELECT
      e.id,
      e.company_name,
      e.email,
      e.phone,
      e.location,
      e.website,
      e.description,
      e.created_at,
      COUNT(j.id)::integer AS job_count
    FROM employers e
    LEFT JOIN jobs j
      ON e.id = j.employer_id
    WHERE e.id = $1
    GROUP BY e.id
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Employer not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Employer fetched successfully"
  );
}

// ----------------------------------
// Update Employer
// ----------------------------------

async function updateEmployer(req, res) {
  const {
    company_name,
    phone,
    location,
    website,
    description
  } = req.body;

  const result = await query(
    `
    UPDATE employers
    SET
      company_name = COALESCE($1, company_name),
      phone = COALESCE($2, phone),
      location = COALESCE($3, location),
      website = COALESCE($4, website),
      description = COALESCE($5, description),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING
      id,
      company_name,
      email,
      phone,
      location,
      website,
      description,
      created_at
    `,
    [
      company_name || null,
      phone || null,
      location || null,
      website || null,
      description || null,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return error(res, "Employer not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Employer profile updated successfully"
  );
}

// ----------------------------------
// Employer's Jobs
// ----------------------------------

async function getEmployerJobsPublic(req, res) {
  const result = await query(
    `
    SELECT
      j.id,
      j.title,
      j.location,
      j.type,
      j.salary,
      j.experience,
      j.skills,
      j.deadline,
      j.status,
      j.created_at,
      c.name AS category_name
    FROM jobs j
    LEFT JOIN categories c
      ON j.category_id = c.id
    WHERE j.employer_id = $1
      AND j.status = 'active'
    ORDER BY j.created_at DESC
    `,
    [req.params.id]
  );

  return success(
    res,
    result.rows,
    "Employer jobs fetched successfully"
  );
}

module.exports = {
  getEmployers,
  getEmployerById,
  updateEmployer,
  getEmployerJobsPublic
};