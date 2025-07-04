const router = require('express').Router()
const renderPage = require('helpers/response/render')

/**
 * Error Documentation
 * - This route serves html pages for error documentation.
 * - The errorKey is used to identify the specific error page to be served.
 */
router.get('/:errorKey', (req, res) => {
  return res.send(renderPage(req, req.params.errorKey))
})

/**
 * Exports
 */
module.exports = router