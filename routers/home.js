const router = require("express").Router();
const { retrievePicture } = require("../helpers/upload");
const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

const express = require('express');
const app = express();

app.use('/public', express.static(__dirname + '/public', { type: 'text/css' }));

router.get('/', async (req, res) => {

    const jobListings = await knex('job_listings')
        .join('company_profiles', 'company_profiles.user_id', '=', 'job_listings.company_id')
        .select(
            'job_listings.id as job_id',
            'company_profiles.user_id',
            'company_profiles.company_name as name',
            'job_listings.job_title',
            'job_listings.job_summary',
            'job_listings.job_updated_date as post_time'
        );
    
    const userPosts = await knex('user_posts')
        .join('user_profiles', 'user_profiles.user_id', '=', 'user_posts.post_user_id')
        .select(
            'user_posts.id as post_id',
            'user_profiles.user_id',
            'user_profiles.first_name as name',
            'user_profiles.last_name',
            'user_posts.post_title as job_title',
            'user_posts.post_summary as job_summary',
            'user_posts.post_time as post_time'
        );

    const combinedPosts = [...jobListings, ...userPosts];
    const sortedPosts = combinedPosts.sort((a, b) => {
        return b.post_time - a.post_time;
    });

    res.render('home', { sortedPosts: sortedPosts });
});

module.exports = router;