/**
 * Create Users Table Migration
 * - This migration creates the users table with fields for email and API key.
 * - The email field is unique and not nullable.
 */
export async function up(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('email').notNullable().unique()
    table.string('api_key').notNullable().unique()
    table.timestamps(true, true)
  })
}

/**
 * Drop Users Table Migration
 * - This migration drops the users table if it exists.
 * - It is used to revert the changes made in the up migration.
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('users')
}