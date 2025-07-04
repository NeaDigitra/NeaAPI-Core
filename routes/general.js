const router = require('express').Router()
const allController = require('../controllers/all')
const apiSignature = require('../middlewares/signature')
const { field, validateInput } = require('../validator/index')

/**
 * Validation Rules
 * - This example demonstrates how to define validation rules for an API endpoint.
 * - It includes rules for string length, email format, and sanitization.
 */
const exampleValidator = [
  field('name').isString().length({ min: 3, max: 30 }).sanitize(),
  field('email').isEmail().length({ min: 5, max: 50 }).sanitize()
]

/**
  * Example Routes
  * - These routes demonstrate how to use the example controller.
  * - They provide example endpoints for testing and development purposes.
 */
router.get('/1', allController.getExample1)
router.get('/2', apiSignature, allController.getExample2)
router.post('/3', apiSignature, validateInput(exampleValidator), allController.postExample3)

/**
 * Exports
 */
module.exports = router