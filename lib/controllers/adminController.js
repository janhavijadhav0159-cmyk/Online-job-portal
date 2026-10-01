const {
  query
} = require("../db");

const {
  hashPassword
} = require("../auth");

const {
  success,
  error
} = require("../helpers/response");

// ----------------------------------
// Admin Dashboard Statistics
// ----------------------------------

async function getDashboardStats(req, res) {
  const users = await query(
    "SELECT COUNT(*)::integer AS count FROM users"
  );

  const employers = await query(
    "SELECT COUNT(*)::integer AS count FROM employers"
  );

  const jobs = await query(
    "SELECT COUNT(*)::integer AS count FROM jobs"
  );

  const applications = await query(
    "SELECT COUNT(*)::integer AS count FROM applications"
  );

  const activeJobs = await query(
    `
    SELECT COUNT(*)::integer AS count
    FROM jobs
    WHERE status = 'active'
    `
  );

  const pendingApplications = await query(
    `
    SELECT COUNT(*)::integer AS count
    FROM applications
    WHERE status = 'pending'
    `
  );

  return success(
    res,
    {
      users: users.rows[0].count,
      employers: employers.rows[0].count,
      jobs: jobs.rows[0].count,
      applications: applications.rows[0].count,
      activeJobs: activeJobs.rows[0].count,
      pendingApplications:
        pendingApplications.rows[0].count
    },
    "Dashboard statistics fetched successfully"
  );
}

// ----------------------------------
// Get All Users
// ----------------------------------

async function getUsers(req, res) {
  const result = await query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.created_at,
      COUNT(a.id)::integer AS application_count
    FROM users u
    LEFT JOIN applications a
      ON u.id = a.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
    `
  );

  return success(
    res,
    result.rows,
    "Users fetched successfully"
  );
}

// ----------------------------------
// Delete User
// ----------------------------------

async function deleteUser(req, res) {
  const result = await query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING id
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "User not found", 404);
  }

  return success(
    res,
    null,
    "User deleted successfully"
  );
}

// ----------------------------------
// Get All Employers
// ----------------------------------

async function getAllEmployers(req, res) {
  const result = await query(
    `
    SELECT
      e.id,
      e.company_name,
      e.email,
      e.phone,
      e.location,
      e.website,
      e.created_at,
      COUNT(j.id)::integer AS job_count
    FROM employers e
    LEFT JOIN jobs j
      ON e.id = j.employer_id
    GROUP BY e.id
    ORDER BY e.created_at DESC
    `
  );

  return success(
    res,
    result.rows,
    "Employers fetched successfully"
  );
}

// ----------------------------------
// Delete Employer
// ----------------------------------

async function deleteEmployer(req, res) {
  const result = await query(
    `
    DELETE FROM employers
    WHERE id = $1
    RETURNING id
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Employer not found", 404);
  }

  return success(
    res,
    null,
    "Employer deleted successfully"
  );
}

// ----------------------------------
// Get All Jobs - Admin
// ----------------------------------

async function getAllJobs(req, res) {
  const result = await query(
    `
    SELECT
      j.*,
      e.company_name,
      c.name AS category_name
    FROM jobs j
    JOIN employers e
      ON j.employer_id = e.id
    LEFT JOIN categories c
      ON j.category_id = c.id
    ORDER BY j.created_at DESC
    `
  );

  return success(
    res,
    result.rows,
    "Jobs fetched successfully"
  );
}

// ----------------------------------
// Delete Job - Admin
// ----------------------------------

async function deleteJob(req, res) {
  const result = await query(
    `
    DELETE FROM jobs
    WHERE id = $1
    RETURNING id
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Job not found", 404);
  }

  return success(
    res,
    null,
    "Job deleted successfully"
  );
}

// ----------------------------------
// Get All Applications
// ----------------------------------

async function getAllApplications(req, res) {
  const result = await query(
    `
    SELECT
      a.*,
      u.name AS applicant_name,
      u.email AS applicant_email,
      j.title AS job_title,
      e.company_name
    FROM applications a
    JOIN users u
      ON a.user_id = u.id
    JOIN jobs j
      ON a.job_id = j.id
    JOIN employers e
      ON j.employer_id = e.id
    ORDER BY a.applied_at DESC
    `
  );

  return success(
    res,
    result.rows,
    "Applications fetched successfully"
  );
}

// ----------------------------------
// Update Application Status - Admin
// ----------------------------------

async function updateApplicationStatus(req, res) {
  const {
    status
  } = req.body;

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
    UPDATE applications
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [
      status,
      req.params.id
    ]
  );

  if (result.rows.length === 0) {
    return error(
      res,
      "Application not found",
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
// Admin Profile
// ----------------------------------

async function getAdminProfile(req, res) {
  const result = await query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      created_at
    FROM admins
    WHERE id = $1
    `,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Admin not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Admin profile fetched successfully"
  );
}

// ----------------------------------
// Update Admin Profile
// ----------------------------------

async function updateAdminProfile(req, res) {
  const {
    name,
    phone
  } = req.body;

  if (!name || !name.trim()) {
    return error(res, "Name is required", 400);
  }

  const result = await query(
    `
    UPDATE admins
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
    return error(res, "Admin not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Admin profile updated successfully"
  );
}

// ----------------------------------
// Change Admin Password
// ----------------------------------

async function changeAdminPassword(req, res) {
  const {
    currentPassword,
    newPassword
  } = req.body;

  if (!currentPassword || !newPassword) {
    return error(
      res,
      "Current and new password are required",
      400
    );
  }

  if (newPassword.length < 6) {
    return error(
      res,
      "New password must contain at least 6 characters",
      400
    );
  }

  const admin = await query(
    `
    SELECT password_hash
    FROM admins
    WHERE id = $1
    `,
    [req.user.id]
  );

  if (admin.rows.length === 0) {
    return error(res, "Admin not found", 404);
  }

  const bcrypt = require("bcryptjs");

  const valid = await bcrypt.compare(
    currentPassword,
    admin.rows[0].password_hash
  );

  if (!valid) {
    return error(
      res,
      "Current password is incorrect",
      401
    );
  }

  const newHash = await hashPassword(newPassword);

  await query(
    `
    UPDATE admins
    SET
      password_hash = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    [
      newHash,
      req.user.id
    ]
  );

  return success(
    res,
    null,
    "Password changed successfully"
  );
}

// ----------------------------------
// Reports
// ----------------------------------

async function getReports(req, res) {
  const jobsByStatus = await query(
    `
    SELECT
      status,
      COUNT(*)::integer AS count
    FROM jobs
    GROUP BY status
    ORDER BY status
    `
  );

  const applicationsByStatus = await query(
    `
    SELECT
      status,
      COUNT(*)::integer AS count
    FROM applications
    GROUP BY status
    ORDER BY status
    `
  );

  const jobsByCategory = await query(
    `
    SELECT
      c.name,
      COUNT(j.id)::integer AS count
    FROM categories c
    LEFT JOIN jobs j
      ON c.id = j.category_id
    GROUP BY c.id, c.name
    ORDER BY count DESC
    `
  );

  return success(
    res,
    {
      jobsByStatus: jobsByStatus.rows,
      applicationsByStatus:
        applicationsByStatus.rows,
      jobsByCategory:
        jobsByCategory.rows
    },
    "Reports fetched successfully"
  );
}

module.exports = {
  getDashboardStats,

  getUsers,
  deleteUser,

  getAllEmployers,
  deleteEmployer,

  getAllJobs,
  deleteJob,

  getAllApplications,
  updateApplicationStatus,

  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,

  getReports
};