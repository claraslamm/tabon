/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { username: 'mtthwleung', password: 'test', email: 'matthew@yahoo.com'},
    { username: 'xccelerate', password: 'cocoon', email: 'xccelerate@gmail.com'},
  ]);
};
