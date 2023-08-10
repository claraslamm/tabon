/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('job_applications', table => {
        table.increments();
        table.integer('job_id').notNullable();
        table.foreign('job_id').references('job_listings.id');
        table.integer('user_profile_id').notNullable();
        table.foreign('user_profile_id').references('user_profiles.id');
        table.timestamp('application_date').defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('job_applications');
};
