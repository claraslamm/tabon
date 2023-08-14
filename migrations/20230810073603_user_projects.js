/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('user_projects', table => {
        table.increments();
        table.string('project_name').notNullable();
        table.string('project_description');
        table.timestamp('project_post_date').defaultTo(knex.fn.now());
        table.integer('user_profile_id').notNullable();
        table.foreign('user_profile_id').references('user_profiles.user_id');
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_projects');
};
