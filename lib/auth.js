const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "online-job-portal-secret-key";

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "7d";

// ----------------------------------
// Hash Password
// ----------------------------------

async function hashPassword(password) {
  if (!password) {
    throw new Error("Password is required");
  }

  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
}

// ----------------------------------
// Compare Password
// ----------------------------------

async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    return false;
  }

  return await bcrypt.compare(password, hashedPassword);
}

// ----------------------------------
// Generate JWT Token
// ----------------------------------

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

// ----------------------------------
// Verify JWT Token
// ----------------------------------

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ----------------------------------
// Authentication Middleware
// ----------------------------------

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing"
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

// ----------------------------------
// Role Authorization Middleware
// ----------------------------------

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource"
      });
    }

    next();
  };
}

// ----------------------------------
// Optional Authentication
// ----------------------------------

function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      req.user = null;
      return next();
    }

    req.user = verifyToken(token);

    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  optionalAuthenticate
};