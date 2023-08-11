/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_projects').del()
  await knex('user_projects').insert([
    {project_name: 'My First Website', project_description: 'Here you can take a long look at my awesome website made from HTML and CSS', user_profile_id: 1},
  ]);
};
