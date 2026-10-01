const {
  query
} = require("../db");

const {
  hashPassword,
  comparePassword,
  generateToken
} = require("../auth");

const {
  success,
  error,
  created
} = require("../helpers/response");

const {
  validateRegistration,
  validateLogin,
  isEmail
} = require("../helpers/validation");

// ----------------------------------
// User Registration
// ----------------------------------

async function registerUser(req, res) {
  const {
    name,
    email,
    password,
    phone
  } = req.body;

  const errors = validateRegistration(req.body);

  if (Object.keys(errors).length > 0) {
    return error(res, "Validation failed", 400, errors);
  }

  const existingUser = await query(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  if (existingUser.rows.length > 0) {
    return error(res, "Email already registered", 409);
  }

  const passwordHash = await hashPassword(password);

  const result = await query(
    `INSERT INTO users
     (name, email, password_hash, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, phone, created_at`,
    [
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      phone || null
    ]
  );

  const user = {
    ...result.rows[0],
    role: "user"
  };

  const token = generateToken(user);

  return created(
    res,
    {
      user,
      token
    },
    "User registered successfully"
  );
}

// ----------------------------------
// User Login
// ----------------------------------

async function loginUser(req, res) {
  const {
    email,
    password
  } = req.body;

  const errors = validateLogin(req.body);

  if (Object.keys(errors).length > 0) {
    return error(res, "Validation failed", 400, errors);
  }

  const result = await query(
    `SELECT id, name, email, password_hash, phone
     FROM users
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) {
    return error(res, "Invalid email or password", 401);
  }

  const user = result.rows[0];

  const validPassword = await comparePassword(
    password,
    user.password_hash
  );

  if (!validPassword) {
    return error(res, "Invalid email or password", 401);
  }

  delete user.password_hash;

  const token = generateToken({
    ...user,
    role: "user"
  });

  return success(
    res,
    {
      user: {
        ...user,
        role: "user"
      },
      token
    },
    "Login successful"
  );
}

// ----------------------------------
// Employer Registration
// ----------------------------------

async function registerEmployer(req, res) {
  const {
    company_name,
    email,
    password,
    phone,
    location,
    website,
    description
  } = req.body;

  if (!company_name || !company_name.trim()) {
    return error(res, "Company name is required", 400);
  }

  if (!email || !isEmail(email)) {
    return error(res, "Valid email is required", 400);
  }

  if (!password || password.length < 6) {
    return error(
      res,
      "Password must contain at least 6 characters",
      400
    );
  }

  const existingEmployer = await query(
    "SELECT id FROM employers WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  if (existingEmployer.rows.length > 0) {
    return error(res, "Email already registered", 409);
  }

  const passwordHash = await hashPassword(password);

  const result = await query(
    `INSERT INTO employers
     (company_name, email, password_hash, phone, location, website, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, company_name, email, phone, location, website, description, created_at`,
    [
      company_name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      phone || null,
      location || null,
      website || null,
      description || null
    ]
  );

  const employer = {
    ...result.rows[0],
    role: "employer"
  };

  const token = generateToken(employer);

  return created(
    res,
    {
      employer,
      token
    },
    "Employer registered successfully"
  );
}

// ----------------------------------
// Employer Login
// ----------------------------------

async function loginEmployer(req, res) {
  const {
    email,
    password
  } = req.body;

  if (!email || !isEmail(email)) {
    return error(res, "Valid email is required", 400);
  }

  if (!password) {
    return error(res, "Password is required", 400);
  }

  const result = await query(
    `SELECT id, company_name, email, password_hash,
            phone, location, website, description
     FROM employers
     WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) {
    return error(res, "Invalid email or password", 401);
  }

  const employer = result.rows[0];

  const validPassword = await comparePassword(
    password,
    employer.password_hash
  );

  if (!validPassword) {
    return error(res, "Invalid email or password", 401);
  }

  delete employer.password_hash;

  const token = generateToken({
    ...employer,
    role: "employer"
  });

  return success(
    res,
    {
      employer: {
        ...employer,
        role: "employer"
      },
      token
    },
    "Employer login successful"
  );
}

// ----------------------------------
// Current User
// ----------------------------------

async function me(req, res) {
  if (!req.user) {
    return error(res, "Authentication required", 401);
  }

  if (req.user.role === "user") {
    const result = await query(
      `SELECT id, name, email, phone, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, "User not found", 404);
    }

    return success(res, {
      ...result.rows[0],
      role: "user"
    });
  }

  if (req.user.role === "employer") {
    const result = await query(
      `SELECT id, company_name, email, phone,
              location, website, description, created_at
       FROM employers
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, "Employer not found", 404);
    }

    return success(res, {
      ...result.rows[0],
      role: "employer"
    });
  }

  if (req.user.role === "admin") {
    const result = await query(
      `SELECT id, name, email, phone, created_at
       FROM admins
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return error(res, "Admin not found", 404);
    }

    return success(res, {
      ...result.rows[0],
      role: "admin"
    });
  }

  return error(res, "Invalid user role", 400);
}

module.exports = {
  registerUser,
  loginUser,
  registerEmployer,
  loginEmployer,
  me
};