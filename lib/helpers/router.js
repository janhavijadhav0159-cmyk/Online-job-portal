const express = require("express");

// ----------------------------------
// Create Router
// ----------------------------------

function createRouter() {
  return express.Router();
}

// ----------------------------------
// Async Handler
// ----------------------------------

function asyncHandler(controller) {
  return function (req, res, next) {
    Promise.resolve(
      controller(req, res, next)
    ).catch(next);
  };
}

// ----------------------------------
// Register GET Route
// ----------------------------------

function get(router, path, controller) {
  router.get(
    path,
    asyncHandler(controller)
  );

  return router;
}

// ----------------------------------
// Register POST Route
// ----------------------------------

function post(router, path, controller) {
  router.post(
    path,
    asyncHandler(controller)
  );

  return router;
}

// ----------------------------------
// Register PUT Route
// ----------------------------------

function put(router, path, controller) {
  router.put(
    path,
    asyncHandler(controller)
  );

  return router;
}

// ----------------------------------
// Register PATCH Route
// ----------------------------------

function patch(router, path, controller) {
  router.patch(
    path,
    asyncHandler(controller)
  );

  return router;
}

// ----------------------------------
// Register DELETE Route
// ----------------------------------

function remove(router, path, controller) {
  router.delete(
    path,
    asyncHandler(controller)
  );

  return router;
}

module.exports = {
  createRouter,
  asyncHandler,
  get,
  post,
  put,
  patch,
  remove
};