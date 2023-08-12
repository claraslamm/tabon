/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('job_listings').del()
  await knex('job_listings').insert([
    {
      company_id: 1,
      job_title: 'Web Developer',
      job_nature: "Full-time",
      job_remote: "false",
      location: "Hong Kong",
      job_description: "Looking for a full-stack developer. Need somebody familiar with frontend and backend JavaScript, in addition to NodeJS and React. Must be proactive and a quick learner. Salary is negotiable upon hiring."
    },
  ]);
};
