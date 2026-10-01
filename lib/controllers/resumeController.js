const {
  query
} = require("../db");

const {
  success,
  error,
  created
} = require("../helpers/response");

// ----------------------------------
// Create Resume
// ----------------------------------

async function createResume(req, res) {
  const {
    title,
    summary,
    education,
    skills,
    experience,
    projects
  } = req.body;

  if (!title || !title.trim()) {
    return error(res, "Resume title is required", 400);
  }

  const result = await query(
    `
    INSERT INTO resumes
    (
      user_id,
      title,
      summary,
      education,
      skills,
      experience,
      projects
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      req.user.id,
      title.trim(),
      summary || null,
      education || null,
      skills || null,
      experience || null,
      projects || null
    ]
  );

  return created(
    res,
    result.rows[0],
    "Resume created successfully"
  );
}

// ----------------------------------
// Get User Resumes
// ----------------------------------

async function getUserResumes(req, res) {
  const result = await query(
    `
    SELECT *
    FROM resumes
    WHERE user_id = $1
    ORDER BY updated_at DESC
    `,
    [req.user.id]
  );

  return success(
    res,
    result.rows,
    "Resumes fetched successfully"
  );
}

// ----------------------------------
// Get Resume By ID
// ----------------------------------

async function getResumeById(req, res) {
  const result = await query(
    `
    SELECT *
    FROM resumes
    WHERE id = $1
      AND user_id = $2
    `,
    [
      req.params.id,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return error(res, "Resume not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Resume fetched successfully"
  );
}

// ----------------------------------
// Update Resume
// ----------------------------------

async function updateResume(req, res) {
  const {
    title,
    summary,
    education,
    skills,
    experience,
    projects
  } = req.body;

  const result = await query(
    `
    UPDATE resumes
    SET
      title = COALESCE($1, title),
      summary = COALESCE($2, summary),
      education = COALESCE($3, education),
      skills = COALESCE($4, skills),
      experience = COALESCE($5, experience),
      projects = COALESCE($6, projects),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
      AND user_id = $8
    RETURNING *
    `,
    [
      title || null,
      summary || null,
      education || null,
      skills || null,
      experience || null,
      projects || null,
      req.params.id,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return error(res, "Resume not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Resume updated successfully"
  );
}

// ----------------------------------
// Delete Resume
// ----------------------------------

async function deleteResume(req, res) {
  const result = await query(
    `
    DELETE FROM resumes
    WHERE id = $1
      AND user_id = $2
    RETURNING id
    `,
    [
      req.params.id,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return error(res, "Resume not found", 404);
  }

  return success(
    res,
    null,
    "Resume deleted successfully"
  );
}

module.exports = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume
};