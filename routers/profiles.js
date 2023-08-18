const router = require('express').Router();
const { isLoggedIn } = require('../auth/check-login');
const { uploadProfilePic, uploadProjectPics, uploadResume } = require('../helpers/helpers');
const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);
const fs = require('fs');

//routes
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

    if (userProfile) {
        res.redirect(`/profile/user/${req.user.username}`);
    } else if (companyProfile) {
        res.redirect(`/profile/company/${req.user.username}`);
    } else{
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

    const newProject = {
        project_name: req.body.projectheader,
        project_description: req.body.projectdescription,
        user_profile_id: user_id
    }

    uploadProjectPics(req);

    if (req.body.user_type === "user") {
        await knex('user_profiles').insert(newUserProfile)
        await knex('user_projects').insert(newProject);
        res.redirect(`/profile/user/${req.user.username}`);
    } else {
        await knex('company_profiles').insert(newCompanyProfile);
        res.redirect(`/profile/company/${req.user.username}`);
    }
});

router.get('/edituserprofile', isLoggedIn, async (req, res) => {
    const id = req.user.id;
    const userInfo = await knex("user_profiles").where({ user_id: id }).first();
    const projectInfo = await knex("user_projects").where({ user_profile_id: id }).first();
    res.render("userEditProfile", {userInfo: userInfo, projectInfo: projectInfo});
})

router.post('/edituserprofile', async (req, res) => {
    const id = req.user.id;

    uploadProfilePic(req);
    uploadProjectPics(req);
    uploadResume(req);

    const updateUserProfile = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        about_section: req.body.aboutme,
    }

    const updateProjectInfo = {
        project_name: req.body.projectheader,
        project_description: req.body.projectdescription,
        user_profile_id: id
    }

    await knex('user_profiles').where({ user_id: id }).update(updateUserProfile);
    await knex('user_projects').where({ user_profile_id: id }).update(updateProjectInfo);
    res.redirect(`/profile/user/${req.user.username}`);
})


router.get('/editcompanyprofile', isLoggedIn, async (req, res) => {
    const id = req.user.id;
    const companyInfo = await knex("company_profiles").where({user_id: id}).first();
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

router.get('/user/:myprofile', async (req, res) => {
    
    let username = req.params.myprofile;
    let user_id = req.user ? req.user.id : null;

    const currentUser = await knex('users')
        .where({ id: user_id }).first();
    
    //checking if current user is the same as that of the profile being viewed
    const isUser = currentUser.username === username ? true : false; 

    const userInfo = await knex('users')
        //.select()
        .join('user_profiles', 'users.id', '=', 'user_profiles.user_id')
        .join('user_projects', 'users.id', '=', 'user_projects.user_profile_id')
        .where({ username }).first()

    if (!userInfo) {
        return res.redirect('/'); //if user cannot be found, redirect back to home page
    }

    let profilePic = [
        {name: "profilepicture", userId: userInfo.user_id },
    ];
    
    const profilePicPath = profilePic.map(pic => {
        const imagePath = `/images/profilepics/profilepicture${pic.userId}`;
        const exists = fs.existsSync(`public${imagePath}`);
        return exists ? imagePath : null;
    });

    const projectPics = [
      { name: "projectpicture1", userId: userInfo.user_id },
      { name: "projectpicture2", userId: userInfo.user_id },
      { name: "projectpicture3", userId: userInfo.user_id },
    ];

    const imagePaths = projectPics.map(pic => {
        const imagePath = `/images/projectpics/${pic.name}${pic.userId}`;
        const exists = fs.existsSync(`public${imagePath}`);
        return exists ? imagePath : null;
    })
    
    res.render("profile", { isUser: isUser, userInfo: userInfo, imagePaths: imagePaths, profilePicPath: profilePicPath });
});

router.get('/resume/:id', (req, res) => {
    const userId = req.params.id;

    const resumePathDocx = `public/resumes/resume${userId}.docx`;
    const resumePathPdf = `public/resumes/resume${userId}.pdf`;
    let resumePath;

    const docxExists = fs.existsSync(resumePathDocx);
    const pdfExists = fs.existsSync(resumePathPdf);

    if (pdfExists) {
        resumePath = `/resumes/resume${userId}.pdf`;
    } else if (docxExists) {
        resumePath = `/resumes/resume${userId}.docx`;
    } else {
        resumePath = null;
    }

    res.render('viewResume', { resumePath: resumePath });
});

router.get('/company/:companyname', async (req, res) => {
    let username = req.params.companyname;

    const companyInfo = await knex('users')
    .join('company_profiles', 'company_profiles.user_id', '=', 'users.id')
    .where({ username }).first()

    const companyJobs = await knex('job_listings')
    .join('company_profiles', 'company_profiles.user_id', '=', 'job_listings.company_id')
    .join('users', 'company_profiles.user_id', '=', 'users.id')
    .select('job_listings.id as job_id', 'job_listings.job_title', 'job_listings.location', 'job_listings.job_nature','job_listings.job_remote')
    .where({ username })
    console.log(companyJobs);

    res.render("companyProfile", {companyInfo: companyInfo, companyJobs: companyJobs});

})

module.exports = router;