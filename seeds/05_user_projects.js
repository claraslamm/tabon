/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_projects').del()
  await knex('user_projects').insert([
    {project_name: 'My First Website', user_profile_id: 1},
  ]);
};
