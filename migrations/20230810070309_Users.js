/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.string('username').unique(); //cannot be notNullable because of Google - can ask them to make a username later on
        table.string('password') // cannot be notNullable because of Google sign-in
        table.string('email').notNullable().unique();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
