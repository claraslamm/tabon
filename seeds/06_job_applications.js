/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('job_applications').del()
  await knex('job_applications').insert([
    {job_id: 1, user_profile_id: 1, },
  ]);
};
