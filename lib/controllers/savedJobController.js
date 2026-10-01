const {
  query
} = require("../db");

const {
  success,
  error,
  created
} = require("../helpers/response");

// ----------------------------------
// Save Job
// ----------------------------------

async function saveJob(req, res) {
  const {
    job_id
  } = req.body;

  if (!job_id) {
    return error(res, "Job ID is required", 400);
  }

  const job = await query(
    `SELECT id FROM jobs WHERE id = $1`,
    [job_id]
  );

  if (job.rows.length === 0) {
    return error(res, "Job not found", 404);
  }

  const existing = await query(
    `
    SELECT id
    FROM saved_jobs
    WHERE user_id = $1
      AND job_id = $2
    `,
    [
      req.user.id,
      job_id
    ]
  );

  if (existing.rows.length > 0) {
    return error(
      res,
      "Job is already saved",
      409
    );
  }

  const result = await query(
    `
    INSERT INTO saved_jobs
    (user_id, job_id)
    VALUES ($1,$2)
    RETURNING *
    `,
    [
      req.user.id,
      job_id
    ]
  );

  return created(
    res,
    result.rows[0],
    "Job saved successfully"
  );
}

// ----------------------------------
// Get Saved Jobs
// ----------------------------------

async function getSavedJobs(req, res) {
  const result = await query(
    `
    SELECT
      s.id AS saved_job_id,
      s.created_at AS saved_at,
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
      e.company_name,
      c.name AS category_name
    FROM saved_jobs s
    JOIN jobs j ON s.job_id = j.id
    JOIN employers e ON j.employer_id = e.id
    LEFT JOIN categories c
      ON j.category_id = c.id
    WHERE s.user_id = $1
    ORDER BY s.created_at DESC
    `,
    [req.user.id]
  );

  return success(
    res,
    result.rows,
    "Saved jobs fetched successfully"
  );
}

// ----------------------------------
// Remove Saved Job
// ----------------------------------

async function removeSavedJob(req, res) {
  const jobId = req.params.jobId;

  const result = await query(
    `
    DELETE FROM saved_jobs
    WHERE user_id = $1
      AND job_id = $2
    RETURNING id
    `,
    [
      req.user.id,
      jobId
    ]
  );

  if (result.rows.length === 0) {
    return error(
      res,
      "Saved job not found",
      404
    );
  }

  return success(
    res,
    null,
    "Job removed from saved jobs"
  );
}

// ----------------------------------
// Check Saved Job
// ----------------------------------

async function checkSavedJob(req, res) {
  const result = await query(
    `
    SELECT id
    FROM saved_jobs
    WHERE user_id = $1
      AND job_id = $2
    `,
    [
      req.user.id,
      req.params.jobId
    ]
  );

  return success(res, {
    saved: result.rows.length > 0
  });
}

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob
};