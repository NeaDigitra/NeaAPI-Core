const validatorField = require('./field')
const validatorInput = require('./input')

/**
 * Validation Middleware
 * - This module exports validation middleware for API endpoints.
 * - It includes field validation and input validation functions.
 */
module.exports = {
  ...validatorField,
  ...validatorInput
}