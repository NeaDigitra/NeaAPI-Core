const { field } = require('utils/validators/index')

/**
 * Validation Rules
 * - This module defines validation rules for API endpoints.
 * - It includes rules for string length, email format, and sanitization.
 */
module.exports = [
  field('name').isString().length({ min: 3, max: 30 }).sanitize(),
  field('email').isEmail().length({ min: 5, max: 50 }).sanitize()
]