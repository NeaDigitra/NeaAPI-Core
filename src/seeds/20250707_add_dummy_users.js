const crypto = require('crypto')

/**
 * Seed Function to Add Dummy Users
 * - This function seeds the database with two dummy users.
 * - Each user has a unique email and a randomly generated API key.
 */
module.exports.seed = async function (knex) {
  await knex('users').del()
  /**
   * This function for example generates a random API key.
   * - It uses the crypto module to create a random 16-byte hexadecimal string.
   * - This key is used for generate signatures and authentication.
   */
  const generateApiKey = function () {
    return crypto.randomBytes(16).toString('hex')
  }
  await knex('users').insert([
    { email: 'user1@example.com', api_key: generateApiKey() },
    { email: 'user2@example.com', api_key: generateApiKey() }
  ])
}