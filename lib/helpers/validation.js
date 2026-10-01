// ----------------------------------
// Required Field
// ----------------------------------

function required(value, fieldName) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return `${fieldName} is required`;
  }

  return null;
}

// ----------------------------------
// Email Validation
// ----------------------------------

function isEmail(email) {
  if (!email) {
    return false;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(String(email).trim());
}

// ----------------------------------
// Password Validation
// ----------------------------------

function isValidPassword(password) {
  if (!password) {
    return false;
  }

  return String(password).length >= 6;
}

// ----------------------------------
// Name Validation
// ----------------------------------

function isValidName(name) {
  if (!name) {
    return false;
  }

  const namePattern = /^[A-Za-z\s]+$/;

  return namePattern.test(String(name).trim());
}

// ----------------------------------
// Positive Integer
// ----------------------------------

function isPositiveInteger(value) {
  const number = Number(value);

  return (
    Number.isInteger(number) &&
    number > 0
  );
}

// ----------------------------------
// Number Validation
// ----------------------------------

function isNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    !isNaN(Number(value))
  );
}

// ----------------------------------
// URL Validation
// ----------------------------------

function isValidUrl(value) {
  if (!value) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch (err) {
    return false;
  }
}

// ----------------------------------
// Validate Required Fields
// ----------------------------------

function validateRequiredFields(data, fields) {
  const errors = {};

  fields.forEach((field) => {
    const message = required(
      data[field],
      field
    );

    if (message) {
      errors[field] = message;
    }
  });

  return errors;
}

// ----------------------------------
// Validate Registration
// ----------------------------------

function validateRegistration(data) {
  const errors = {};

  if (!data.name || String(data.name).trim() === "") {
    errors.name = "Name is required";
  } else if (!isValidName(data.name)) {
    errors.name = "Name can contain only letters and spaces";
  }

  if (!data.email || String(data.email).trim() === "") {
    errors.email = "Email is required";
  } else if (!isEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (!isValidPassword(data.password)) {
    errors.password = "Password must contain at least 6 characters";
  }

  return errors;
}

// ----------------------------------
// Validate Login
// ----------------------------------

function validateLogin(data) {
  const errors = {};

  if (!data.email || String(data.email).trim() === "") {
    errors.email = "Email is required";
  } else if (!isEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
}

module.exports = {
  required,
  isEmail,
  isValidPassword,
  isValidName,
  isPositiveInteger,
  isNumber,
  isValidUrl,
  validateRequiredFields,
  validateRegistration,
  validateLogin
};