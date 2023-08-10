/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('job_listings', table => {
        table.increments();
        table.integer('company_id').notNullable();
        table.foreign('company_id').references('company_profiles.id');
        table.string('job_title').notNullable();
        table.string('job_nature').notNullable();
        table.boolean('job_remote').notNullable();
        table.string('location').notNullable();
        table.string('job_description').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('job_listings');
};
