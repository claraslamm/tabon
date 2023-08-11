const router = require('express').Router();
const isLoggedIn = require('../auth/check-login').isLoggedIn;

const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

router.get('/createusername', isLoggedIn, (req, res) => {
    res.render('createUsername');
});

router.post('/createusername', async (req, res) => {
    
    const userId = req.user.id;
    const username = req.body.username;

    await knex('users')
        .where({ id: userId })
        .update({ username: username });

    res.redirect('/profile/createprofile')
})

router.get('/createprofile', isLoggedIn, (req, res) => {
    res.render('createProfile');
})

router.post('/createprofile', async (req, res) => {
    
    const user_id = req.user.id;

    const newUserProfile = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        about_section: req.body.aboutme,
        user_id: user_id
    }

    const newCompanyProfile = {
        company_name: req.body.companyname,
        company_website: req.body.companywebsite,
        company_description: req.body.companydescription,
        headcount: req.body.headcount,
        company_remote: req.body.companyremote,
        about_us_heading: req.body.aboutusheader,
        about_us_description: req.body.aboutusdescription,
        user_id: user_id
    }

    if (req.body.user_type === "user") {
        await knex('user_profiles').insert(newUserProfile)
    } else {
        await knex('company_profiles').insert(newCompanyProfile);
    }

    res.redirect(`/profile/${req.user.username}`);
})

router.get('/:username', (req, res) => {
    let username = req.params.username;
    res.send(`This is the profile page of ${username}`);
})

module.exports = router;