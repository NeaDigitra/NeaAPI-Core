const router = require('express').Router()
const allController = require('controllers/all')
const globalRules = require('modules/global/rules')
const { validateInput } = require('utils/validators/index')

/**
  * Example Routes
  * - These routes demonstrate how to use the example controller.
  * - They provide example endpoints for testing and development purposes.
 */
router.get('/1', allController.getExample1)
router.get('/2', allController.getExample2)
router.post('/3', validateInput(globalRules), allController.postExample3)

/**
 * Exports
 */
module.exports = router