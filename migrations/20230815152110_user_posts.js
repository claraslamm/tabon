/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_posts', table => {
        table.increments();
        table.integer('post_user_id').notNullable();
        table.foreign('post_user_id').references('user_profiles.user_id');
        table.string('post_title').notNullable();
        table.string('post_summary', 2000).notNullable();
        table.string('post_description', 5000).notNullable();
        table.timestamp("post_time").defaultTo(knex.fn.now());

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_posts');
};
