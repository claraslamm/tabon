/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('company_profiles', table => {
        table.increments();
        table.string('company_name').notNullable().unique();
        table.string('company_website');
        table.string('company_description');
        table.string('headcount');
        table.string('company_remote');
        table.string('about_us_heading');
        table.string('about_us_description');
        table.integer('user_id').notNullable().unique();
        table.foreign('user_id').references('users.id');
        table.string('hasProfilePic');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('company_profiles');
};
