const router = require('express').Router();
const isLoggedIn = require('../auth/check-login').isLoggedIn;

const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

router.get('/createusername', isLoggedIn, (req, res) => {
    if (!req.user.username) {
        res.render("createUsername");
    } else {
        res.redirect('/profile/createprofile')
    }
    
});

router.post('/createusername', async (req, res) => {
    
    const userId = req.user.id;
    const username = req.body.username;

    await knex('users')
        .where({ id: userId })
        .update({ username: username });

    res.redirect('/profile/createprofile')
})

router.get('/createprofile', isLoggedIn, async (req, res) => {
    let userProfile = await knex('user_profiles').where({ user_id: req.user.id }).first();
    let companyProfile = await knex('company_profiles').where({ user_id: req.user.id }).first();

    if (userProfile || companyProfile) {
        res.redirect(`/profile/${req.user.username}`);
    } else {
        res.render("createProfile");
    }
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

// router.get('/:username', (req, res) => {
//     let username = req.params.username;
//     res.send(`This is the profile page of ${username}`);
// })

router.get('/edituserprofile', (req, res) => {
    res.render("userEditProfile");
})

router.get('/editcompanyprofile', async (req, res) => {
    const id = req.user.id;
    const companyInfo = await knex("company_profiles").where({user_id: id}).first();
    console.log(companyInfo);
    res.render("companyEditProfile", {companyInfo: companyInfo});
})

router.post('/editcompanyprofile', async (req, res) => {
    const id = req.user.id;
    const updateCompanyProfile = {
        company_name: req.body.companyname,
        company_website: req.body.companywebsite,
        company_description: req.body.companydescription,
        headcount: req.body.headcount,
        company_remote: req.body.companyremote,
        about_us_heading: req.body.aboutusheader,
        about_us_description: req.body.aboutusdescription,
    }

    await knex('company_profiles').where({user_id: id}).update(updateCompanyProfile);
    res.redirect('/');
})


module.exports = router;