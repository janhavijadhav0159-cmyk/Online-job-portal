// ----------------------------------
// Success Response
// ----------------------------------

function success(
  res,
  data = null,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

// ----------------------------------
// Error Response
// ----------------------------------

function error(
  res,
  message = "Something went wrong",
  statusCode = 500,
  details = null
) {
  const response = {
    success: false,
    message
  };

  if (details !== null) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
}

// ----------------------------------
// Created Response
// ----------------------------------

function created(
  res,
  data = null,
  message = "Created successfully"
) {
  return success(res, data, message, 201);
}

// ----------------------------------
// No Content Response
// ----------------------------------

function noContent(res) {
  return res.status(204).send();
}

module.exports = {
  success,
  error,
  created,
  noContent
};