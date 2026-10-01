const {
  query
} = require("../db");

const {
  success,
  error,
  created
} = require("../helpers/response");

const {
  isPositiveInteger
} = require("../helpers/validation");

// ----------------------------------
// Get All Jobs
// ----------------------------------

async function getJobs(req, res) {
  const {
    search,
    category,
    location,
    type,
    status = "active"
  } = req.query;

  let sql = `
    SELECT
      j.id,
      j.title,
      j.description,
      j.location,
      j.type,
      j.salary,
      j.experience,
      j.skills,
      j.deadline,
      j.status,
      j.created_at,
      e.id AS employer_id,
      e.company_name,
      e.website,
      c.id AS category_id,
      c.name AS category_name
    FROM jobs j
    JOIN employers e ON j.employer_id = e.id
    LEFT JOIN categories c ON j.category_id = c.id
    WHERE 1 = 1
  `;

  const params = [];

  if (status) {
    params.push(status);
    sql += ` AND j.status = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    sql += `
      AND (
        j.title ILIKE $${params.length}
        OR j.description ILIKE $${params.length}
        OR j.skills ILIKE $${params.length}
        OR e.company_name ILIKE $${params.length}
      )
    `;
  }

  if (category) {
    params.push(category);
    sql += ` AND j.category_id = $${params.length}`;
  }

  if (location) {
    params.push(`%${location}%`);
    sql += ` AND j.location ILIKE $${params.length}`;
  }

  if (type) {
    params.push(type);
    sql += ` AND j.type = $${params.length}`;
  }

  sql += " ORDER BY j.created_at DESC";

  const result = await query(sql, params);

  return success(
    res,
    result.rows,
    "Jobs fetched successfully"
  );
}

// ----------------------------------
// Get Single Job
// ----------------------------------

async function getJobById(req, res) {
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    return error(res, "Invalid job ID", 400);
  }

  const result = await query(
    `
    SELECT
      j.*,
      e.company_name,
      e.email AS employer_email,
      e.phone AS employer_phone,
      e.location AS employer_location,
      e.website AS employer_website,
      c.name AS category_name
    FROM jobs j
    JOIN employers e ON j.employer_id = e.id
    LEFT JOIN categories c ON j.category_id = c.id
    WHERE j.id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "Job not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Job fetched successfully"
  );
}

// ----------------------------------
// Create Job
// ----------------------------------

async function createJob(req, res) {
  const {
    title,
    description,
    location,
    type,
    salary,
    experience,
    skills,
    deadline,
    category_id
  } = req.body;

  if (!title || !title.trim()) {
    return error(res, "Job title is required", 400);
  }

  if (!description || !description.trim()) {
    return error(res, "Job description is required", 400);
  }

  if (!location || !location.trim()) {
    return error(res, "Location is required", 400);
  }

  if (!type || !type.trim()) {
    return error(res, "Job type is required", 400);
  }

  const result = await query(
    `
    INSERT INTO jobs
    (
      employer_id,
      category_id,
      title,
      description,
      location,
      type,
      salary,
      experience,
      skills,
      deadline,
      status
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active')
    RETURNING *
    `,
    [
      req.user.id,
      category_id || null,
      title.trim(),
      description.trim(),
      location.trim(),
      type.trim(),
      salary || null,
      experience || null,
      skills || null,
      deadline || null
    ]
  );

  return created(
    res,
    result.rows[0],
    "Job posted successfully"
  );
}

// ----------------------------------
// Update Job
// ----------------------------------

async function updateJob(req, res) {
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    return error(res, "Invalid job ID", 400);
  }

  const {
    title,
    description,
    location,
    type,
    salary,
    experience,
    skills,
    deadline,
    category_id,
    status
  } = req.body;

  const check = await query(
    `SELECT id FROM jobs
     WHERE id = $1 AND employer_id = $2`,
    [id, req.user.id]
  );

  if (check.rows.length === 0) {
    return error(
      res,
      "Job not found or you do not have permission",
      404
    );
  }

  const result = await query(
    `
    UPDATE jobs
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      location = COALESCE($3, location),
      type = COALESCE($4, type),
      salary = COALESCE($5, salary),
      experience = COALESCE($6, experience),
      skills = COALESCE($7, skills),
      deadline = COALESCE($8, deadline),
      category_id = COALESCE($9, category_id),
      status = COALESCE($10, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING *
    `,
    [
      title || null,
      description || null,
      location || null,
      type || null,
      salary || null,
      experience || null,
      skills || null,
      deadline || null,
      category_id || null,
      status || null,
      id
    ]
  );

  return success(
    res,
    result.rows[0],
    "Job updated successfully"
  );
}

// ----------------------------------
// Delete Job
// ----------------------------------

async function deleteJob(req, res) {
  const { id } = req.params;

  const result = await query(
    `DELETE FROM jobs
     WHERE id = $1 AND employer_id = $2
     RETURNING id`,
    [id, req.user.id]
  );

  if (result.rows.length === 0) {
    return error(
      res,
      "Job not found or permission denied",
      404
    );
  }

  return success(
    res,
    null,
    "Job deleted successfully"
  );
}

// ----------------------------------
// Employer Jobs
// ----------------------------------

async function getEmployerJobs(req, res) {
  const result = await query(
    `
    SELECT
      j.*,
      c.name AS category_name,
      COUNT(a.id)::integer AS application_count
    FROM jobs j
    LEFT JOIN categories c
      ON j.category_id = c.id
    LEFT JOIN applications a
      ON j.id = a.job_id
    WHERE j.employer_id = $1
    GROUP BY j.id, c.name
    ORDER BY j.created_at DESC
    `,
    [req.user.id]
  );

  return success(
    res,
    result.rows,
    "Employer jobs fetched successfully"
  );
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
};