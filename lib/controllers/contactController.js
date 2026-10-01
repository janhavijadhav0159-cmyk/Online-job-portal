const {
  query
} = require("../db");

const {
  success,
  error,
  created
} = require("../helpers/response");

const {
  isEmail
} = require("../helpers/validation");

// ----------------------------------
// Send Contact Message
// ----------------------------------

async function sendMessage(req, res) {
  const {
    name,
    email,
    message
  } = req.body;

  if (!name || !name.trim()) {
    return error(res, "Name is required", 400);
  }

  if (!email || !isEmail(email)) {
    return error(
      res,
      "Valid email is required",
      400
    );
  }

  if (!message || !message.trim()) {
    return error(
      res,
      "Message is required",
      400
    );
  }

  const result = await query(
    `
    INSERT INTO contacts
    (name, email, message, status)
    VALUES ($1,$2,$3,'unread')
    RETURNING *
    `,
    [
      name.trim(),
      email.toLowerCase().trim(),
      message.trim()
    ]
  );

  return created(
    res,
    result.rows[0],
    "Message sent successfully"
  );
}

// ----------------------------------
// Get Messages - Admin
// ----------------------------------

async function getMessages(req, res) {
  const result = await query(
    `
    SELECT *
    FROM contacts
    ORDER BY created_at DESC
    `
  );

  return success(
    res,
    result.rows,
    "Messages fetched successfully"
  );
}

// ----------------------------------
// Get Message
// ----------------------------------

async function getMessageById(req, res) {
  const result = await query(
    `
    SELECT *
    FROM contacts
    WHERE id = $1
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Message not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Message fetched successfully"
  );
}

// ----------------------------------
// Update Message Status
// ----------------------------------

async function updateMessageStatus(req, res) {
  const {
    status
  } = req.body;

  const allowedStatuses = [
    "unread",
    "read",
    "replied"
  ];

  if (!allowedStatuses.includes(status)) {
    return error(
      res,
      "Invalid message status",
      400
    );
  }

  const result = await query(
    `
    UPDATE contacts
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
    return error(res, "Message not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Message status updated"
  );
}

// ----------------------------------
// Delete Message
// ----------------------------------

async function deleteMessage(req, res) {
  const result = await query(
    `
    DELETE FROM contacts
    WHERE id = $1
    RETURNING id
    `,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Message not found", 404);
  }

  return success(
    res,
    null,
    "Message deleted successfully"
  );
}

module.exports = {
  sendMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
};