/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_profiles', table => {
        table.increments();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.text('about_section');
        table.integer('user_id').notNullable().unique();
        table.foreign('user_id').references('users.id');
        table.string('hasProfilePic');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('user_profiles');
  
};
