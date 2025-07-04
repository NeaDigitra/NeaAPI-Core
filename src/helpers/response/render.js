const generateError = require('./generator')

/**
 * Escape HTML Special Characters  
 * - This function escapes special HTML characters in a string to prevent XSS attacks.
 * - It replaces characters like &, <, >, ", and ' with their corresponding HTML entities
 */
function escapeHtml(inputString) {
  if (typeof inputString !== 'string') {
    return ''
  }
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return inputString.replace(/[&<>"']/g, (char) => {
    return escapeMap[char]
  })
}

/**
 * Generate Error HTML Page
 * - This function generates an HTML page for a specific error based on the request and identifier.
 * - It uses the generateError function to get error details and formats them into a user-friendly
 */
function generatePage(request, identifier) {
  const errorData = generateError(request, identifier)
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>${escapeHtml(errorData.title)} - ${escapeHtml(String(errorData.status))}</title>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <style>
        body { font-family: sans-serif; max-width: 500px; margin: 40px auto; }
        pre { background: #f6f8fa; padding: 12px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(errorData.title)} <span style="font-size:16px;color:#888">(${escapeHtml(String(errorData.status))})</span></h1>
      <p><b>Description:</b> ${escapeHtml(errorData.detail)}</p>
      <p><b>Solution:</b> ${escapeHtml(errorData.solution)}</p>
      <h3>Example Response:</h3>
      <pre>${escapeHtml(JSON.stringify((({ solution, ...rest }) => rest)(errorData), null, 2))}</pre>
    </body>
  </html>
  `
}

/**
 * Exports
 */
module.exports = generatePage