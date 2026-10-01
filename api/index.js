const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../.env")
});

const { testConnection } = require("../lib/db");
const { error } = require("../lib/helpers/response");
const { authenticate, authorize } = require("../lib/auth");

const {
  registerUser,
  loginUser,
  registerEmployer,
  loginEmployer,
  me
} = require("../lib/controllers/authController");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
} = require("../lib/controllers/jobController");

const {
  applyForJob,
  getUserApplications,
  getEmployerApplications,
  updateApplicationStatus,
  getApplicationById
} = require("../lib/controllers/applicationController");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../lib/controllers/categoryController");

const {
  getEmployers,
  getEmployerById,
  updateEmployer,
  getEmployerJobsPublic
} = require("../lib/controllers/employerController");

const {
  getProfile,
  updateProfile,
  getUserById
} = require("../lib/controllers/profileController");

const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume
} = require("../lib/controllers/resumeController");

const {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob
} = require("../lib/controllers/savedJobController");

const {
  sendMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
} = require("../lib/controllers/contactController");

const {
  getDashboardStats,
  getUsers,
  deleteUser,
  getAllEmployers,
  deleteEmployer,
  getAllJobs,
  
  getAllApplications,
  updateApplicationStatus: updateAdminApplicationStatus,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getReports
} = require("../lib/controllers/adminController");

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(path.join(__dirname, "..")));

/* =========================
   BASIC API ROUTES
========================= */

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Online Job Portal API is running"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const database = await testConnection();

    res.json({
      success: true,
      message: "Server is healthy",
      database
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message
    });
  }
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API test successful"
  });
});

/* =========================
   AUTH ROUTES
========================= */

app.post("/api/auth/register", registerUser);

app.post("/api/auth/login", loginUser);

app.post("/api/auth/employer/register", registerEmployer);

app.post("/api/auth/employer/login", loginEmployer);

app.get("/api/auth/me", authenticate, me);

/* =========================
   JOB ROUTES
========================= */

app.get("/api/jobs", getJobs);

app.get("/api/jobs/:id", getJobById);

app.post(
  "/api/jobs",
  authenticate,
  authorize("employer"),
  createJob
);

app.put(
  "/api/jobs/:id",
  authenticate,
  authorize("employer"),
  updateJob
);

app.delete(
  "/api/jobs/:id",
  authenticate,
  authorize("employer", "admin"),
  deleteJob
);

app.get(
  "/api/employer/jobs",
  authenticate,
  authorize("employer"),
  getEmployerJobs
);

/* =========================
   APPLICATION ROUTES
========================= */

app.post(
  "/api/applications",
  authenticate,
  authorize("user"),
  applyForJob
);

app.get(
  "/api/applications/my",
  authenticate,
  authorize("user"),
  getUserApplications
);

app.get(
  "/api/applications/employer",
  authenticate,
  authorize("employer"),
  getEmployerApplications
);

app.get(
  "/api/applications/:id",
  authenticate,
  getApplicationById
);

app.put(
  "/api/applications/:id/status",
  authenticate,
  authorize("employer", "admin"),
  updateApplicationStatus
);

/* =========================
   CATEGORY ROUTES
========================= */

app.get("/api/categories", getCategories);

app.get("/api/categories/:id", getCategoryById);

app.post(
  "/api/categories",
  authenticate,
  authorize("admin"),
  createCategory
);

app.put(
  "/api/categories/:id",
  authenticate,
  authorize("admin"),
  updateCategory
);

app.delete(
  "/api/categories/:id",
  authenticate,
  authorize("admin"),
  deleteCategory
);

/* =========================
   EMPLOYER ROUTES
========================= */

app.get("/api/employers", getEmployers);

app.get("/api/employers/:id", getEmployerById);

app.get(
  "/api/employers/:id/jobs",
  getEmployerJobsPublic
);

app.put(
  "/api/employers/profile",
  authenticate,
  authorize("employer"),
  updateEmployer
);

/* =========================
   USER PROFILE ROUTES
========================= */

app.get(
  "/api/profile",
  authenticate,
  authorize("user"),
  getProfile
);

app.put(
  "/api/profile",
  authenticate,
  authorize("user"),
  updateProfile
);

app.get(
  "/api/users/:id",
  authenticate,
  getUserById
);

/* =========================
   RESUME ROUTES
========================= */

app.post(
  "/api/resumes",
  authenticate,
  authorize("user"),
  createResume
);

app.get(
  "/api/resumes",
  authenticate,
  authorize("user"),
  getUserResumes
);

app.get(
  "/api/resumes/:id",
  authenticate,
  authorize("user"),
  getResumeById
);

app.put(
  "/api/resumes/:id",
  authenticate,
  authorize("user"),
  updateResume
);

app.delete(
  "/api/resumes/:id",
  authenticate,
  authorize("user"),
  deleteResume
);

/* =========================
   SAVED JOB ROUTES
========================= */

app.post(
  "/api/saved-jobs/:jobId",
  authenticate,
  authorize("user"),
  saveJob
);

app.get(
  "/api/saved-jobs",
  authenticate,
  authorize("user"),
  getSavedJobs
);

app.delete(
  "/api/saved-jobs/:jobId",
  authenticate,
  authorize("user"),
  removeSavedJob
);

app.get(
  "/api/saved-jobs/check/:jobId",
  authenticate,
  authorize("user"),
  checkSavedJob
);

/* =========================
   CONTACT ROUTES
========================= */

app.post(
  "/api/contact",
  sendMessage
);

app.get(
  "/api/contact",
  authenticate,
  authorize("admin"),
  getMessages
);

app.get(
  "/api/contact/:id",
  authenticate,
  authorize("admin"),
  getMessageById
);

app.put(
  "/api/contact/:id/status",
  authenticate,
  authorize("admin"),
  updateMessageStatus
);

app.delete(
  "/api/contact/:id",
  authenticate,
  authorize("admin"),
  deleteMessage
);

/* =========================
   ADMIN ROUTES
========================= */

app.get(
  "/api/admin/dashboard",
  authenticate,
  authorize("admin"),
  getDashboardStats
);

app.get(
  "/api/admin/users",
  authenticate,
  authorize("admin"),
  getUsers
);

app.delete(
  "/api/admin/users/:id",
  authenticate,
  authorize("admin"),
  deleteUser
);

app.get(
  "/api/admin/employers",
  authenticate,
  authorize("admin"),
  getAllEmployers
);

app.delete(
  "/api/admin/employers/:id",
  authenticate,
  authorize("admin"),
  deleteEmployer
);

app.get(
  "/api/admin/jobs",
  authenticate,
  authorize("admin"),
  getAllJobs
);

app.delete(
  "/api/admin/jobs/:id",
  authenticate,
  authorize("admin"),
  deleteJob
);

app.get(
  "/api/admin/applications",
  authenticate,
  authorize("admin"),
  getAllApplications
);

app.put(
  "/api/admin/applications/:id/status",
  authenticate,
  authorize("admin"),
  updateAdminApplicationStatus
);

app.get(
  "/api/admin/profile",
  authenticate,
  authorize("admin"),
  getAdminProfile
);

app.put(
  "/api/admin/profile",
  authenticate,
  authorize("admin"),
  updateAdminProfile
);

app.put(
  "/api/admin/password",
  authenticate,
  authorize("admin"),
  changeAdminPassword
);

app.get(
  "/api/admin/reports",
  authenticate,
  authorize("admin"),
  getReports
);

/* =========================
   API 404
========================= */

app.use("/api", (req, res) => {
  return error(
    res,
    "API route not found",
    404
  );
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  return error(
    res,
    err.message || "Internal server error",
    err.statusCode || 500
  );
});

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.error(
      "Unable to start server:",
      err.message
    );

    process.exit(1);
  }
}

/*
  Local development:
  npm start

  Vercel:
  Export the Express app.
*/

if (require.main === module) {
  startServer();
}

module.exports = app;