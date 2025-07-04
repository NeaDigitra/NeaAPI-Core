const router = require('express').Router()
const allController = require('../controllers/all')
const apiSignature = require('../middlewares/signature')
const globalRules = require('../modules/global/rules')
const { validateInput } = require('../validator/index')

/**
  * Example Routes
  * - These routes demonstrate how to use the example controller.
  * - They provide example endpoints for testing and development purposes.
 */
router.get('/1', allController.getExample1)
router.get('/2', apiSignature, allController.getExample2)
router.post('/3', apiSignature, validateInput(globalRules), allController.postExample3)

/**
 * Exports
 */
module.exports = router