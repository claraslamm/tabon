/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_profiles').del()
  await knex('user_profiles').insert([
    {first_name: 'Matthew', last_name: 'Leung', user_id: 1 },
  ]);
};
