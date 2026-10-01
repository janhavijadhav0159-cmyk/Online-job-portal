const {
  query
} = require("../db");

const {
  success,
  error,
  created
} = require("../helpers/response");

// ----------------------------------
// Get Categories
// ----------------------------------

async function getCategories(req, res) {
  const result = await query(
    `
    SELECT
      c.*,
      COUNT(j.id)::integer AS job_count
    FROM categories c
    LEFT JOIN jobs j
      ON c.id = j.category_id
    GROUP BY c.id
    ORDER BY c.name ASC
    `
  );

  return success(
    res,
    result.rows,
    "Categories fetched successfully"
  );
}

// ----------------------------------
// Get Category
// ----------------------------------

async function getCategoryById(req, res) {
  const result = await query(
    `SELECT * FROM categories WHERE id = $1`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Category not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Category fetched successfully"
  );
}

// ----------------------------------
// Create Category
// ----------------------------------

async function createCategory(req, res) {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return error(res, "Category name is required", 400);
  }

  const existing = await query(
    `SELECT id FROM categories
     WHERE LOWER(name) = LOWER($1)`,
    [name.trim()]
  );

  if (existing.rows.length > 0) {
    return error(
      res,
      "Category already exists",
      409
    );
  }

  const result = await query(
    `
    INSERT INTO categories
    (name, description)
    VALUES ($1,$2)
    RETURNING *
    `,
    [
      name.trim(),
      description || null
    ]
  );

  return created(
    res,
    result.rows[0],
    "Category created successfully"
  );
}

// ----------------------------------
// Update Category
// ----------------------------------

async function updateCategory(req, res) {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return error(res, "Category name is required", 400);
  }

  const result = await query(
    `
    UPDATE categories
    SET
      name = $1,
      description = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [
      name.trim(),
      description || null,
      req.params.id
    ]
  );

  if (result.rows.length === 0) {
    return error(res, "Category not found", 404);
  }

  return success(
    res,
    result.rows[0],
    "Category updated successfully"
  );
}

// ----------------------------------
// Delete Category
// ----------------------------------

async function deleteCategory(req, res) {
  const result = await query(
    `DELETE FROM categories
     WHERE id = $1
     RETURNING id`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return error(res, "Category not found", 404);
  }

  return success(
    res,
    null,
    "Category deleted successfully"
  );
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};