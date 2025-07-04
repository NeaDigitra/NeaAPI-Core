
/**
 * Validation Middleware
 * - This module exports validation middleware for API endpoints.
 * - It includes field validation and input validation functions.
 */
module.exports = {
  field: require('./field').field,
  validateInput: require('./input').validateInput
}