const dbClient = require('config/db')

/**
 * Find User by API Key
 * - This function retrieves a user from the database based on their API key.
 * - It queries the 'users' table for a user with the specified API key.
 */
module.exports.findUserByApiKey = async function (apiKey) {
  const results = await dbClient('users').select('id', 'email').where({ api_key: apiKey }).first()
  return results || null
}