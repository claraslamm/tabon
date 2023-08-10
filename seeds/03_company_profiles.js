/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('company_profiles').del()
  await knex('company_profiles').insert([
    {
      company_name: 'Xccelerate',
      company_website: 'xccelerate.com',
      company_description: 'Offering the best coding bootcamps in Hong Kong',
      headcount: 20,
      company_remote: false,
      about_us_heading: "Our Offices",
      about_us_description: "Our offices and classrooms are located in the heart of HK Island, in a beautiful co-working space in Tin Hau called Cocoon. Come and visit anytime!",
      user_id: 2
    },

  ]);
};
