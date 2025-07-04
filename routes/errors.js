const router = require('express').Router()
const responsePage = require('../helpers/renderErrorPage')

/**
 * Error Documentation
 * - This route serves html pages for error documentation.
 * - The errorKey is used to identify the specific error page to be served.
 */
router.get('/:errorKey', (req, res) => {
  return res.send(responsePage(req, req.params.errorKey))
})

/**
 * Exports
 */
module.exports = router