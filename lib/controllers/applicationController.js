const {
  query
} = require("../db");

const {
  success,
  error,
  created
} = require("../helpers/response");

// ----------------------------------
// Apply For Job
// ----------------------------------

async function applyForJob(req, res) {
  const {
    job_id,
    cover_letter,
    resume_id
  } = req.body;

  if (!job_id) {
    return error(res, "Job ID is required", 400);
  }

  const job = await query(
    `SELECT id FROM jobs
     WHERE id = $1 AND status = 'active'`,
    [job_id]
  );

  if (job.rows.length === 0) {
    return error(
      res,
      "Job not found or no longer active",
      404
    );
  }

  const existing = await query(
    `SELECT id FROM applications
     WHERE job_id = $1 AND user_id = $2`,
    [job_id, req.user.id]
  );

  if (existing.rows.length > 0) {
    return error(
      res,
      "You have already applied for this job",
      409
    );
  }

  const result = await query(
    `
    INSERT INTO applications
    (
      job_id,
      user_id,
      resume_id,
      cover_letter,
      status
    )
    VALUES ($1,$2,$3,$4,'pending')
    RETURNING *
    `,
    [
      job_id,
      req.user.id,
      resume_id || null,
      cover_letter || null
    ]
  );

  return created(
    res,
    result.rows[0],
    "Application submitted successfully"
  );
}

// ----------------------------------
// User Applications
// ----------------------------------

async function getUserApplications(req, res) {
  const result = await query(
    `
    SELECT
      a.*,
      j.title AS job_title,
      j.location,
      j.type,
      j.salary,
      e.company_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN employers e ON j.employer_id = e.id
    WHERE a.user_id = $1
    ORDER BY a.applied_at DESC
    `,
    [req.user.id]
  );

  return success(
    res,
    result.rows,
    "Applications fetched successfully"
  );
}

// ----------------------------------
// Employer Applications
// ----------------------------------

async function getEmployerApplications(req, res) {
  const result = await query(
    `
    SELECT
      a.id,
      a.job_id,
      a.user_id,
      a.resume_id,
      a.cover_letter,
      a.status,
      a.applied_at,
      u.name,
      u.email,
      u.phone,
      j.title AS job_title
    FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN jobs j ON a.job_id = j.id
    WHERE j.employer_id = $1
    ORDER BY a.applied_at DESC
    `,
    [req.user.id]
  );

  return success(
    res,
    result.rows,
    "Employer applications fetched successfully"
  );
}

// ----------------------------------
// Update Application Status
// ----------------------------------

async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "reviewing",
    "shortlisted",
    "rejected",
    "selected"
  ];

  if (!allowedStatuses.includes(status)) {
    return error(
      res,
      "Invalid application status",
      400
    );
  }

  const result = await query(
    `
    UPDATE applications a
    SET status = $1
    FROM jobs j
    WHERE a.id = $2
      AND a.job_id = j.id
      AND j.employer_id = $3
    RETURNING a.*
    `,
    [
      status,
      id,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return error(
      res,
      "Application not found or permission denied",
      404
    );
  }

  return success(
    res,
    result.rows[0],
    "Application status updated"
  );
}

// ----------------------------------
// Get Application Details
// ----------------------------------

async function getApplicationById(req, res) {
  const { id } = req.params;

  const result = await query(
    `
    SELECT
      a.*,
      u.name,
      u.email,
      u.phone,
      j.title AS job_title,
      e.company_name
    FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN jobs j ON a.job_id = j.id
    JOIN employers e ON j.employer_id = e.id
    WHERE a.id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return error(res, "Application not found", 404);
  }

  const application = result.rows[0];

  const allowed =
    req.user.role === "admin" ||
    (
      req.user.role === "user" &&
      application.user_id === req.user.id
    ) ||
    (
      req.user.role === "employer" &&
      application.company_name
    );

  if (!allowed) {
    return error(res, "Permission denied", 403);
  }

  return success(
    res,
    application,
    "Application details fetched"
  );
}

module.exports = {
  applyForJob,
  getUserApplications,
  getEmployerApplications,
  updateApplicationStatus,
  getApplicationById
};