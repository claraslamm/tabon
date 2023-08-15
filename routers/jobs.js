const router = require('express').Router();
const isLoggedIn = require("../auth/check-login").isLoggedIn;
// const formatJobDate = require("../helpers/helpers").formatJobDate;
const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

//routes

router.get('/', async (req, res) => {

    let id = req.user ? req.user.id : null;
    let isCompany = await knex('company_profiles').where({ user_id: id }).first();

    let jobInfo = await knex('company_profiles')
        .join('job_listings', 'company_profiles.user_id', '=', 'job_listings.company_id');
    
    // jobInfo = formatJobDate(jobInfo);
    jobInfo = jobInfo.map((job) => {
        const formattedDate = job.job_updated_date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        return { ...job, job_updated_date: formattedDate };
    });

    res.render('jobBoard', { isCompany: isCompany, jobInfo: jobInfo });
})

router.get('/createjob', isLoggedIn, async (req, res) => {

    let isCompany = await knex('company_profiles').where({ user_id: req.user.id }).first();

    if (isCompany) {
        res.render("createjob");
    } else {
        res.redirect('/jobs');
    }
});

router.post('/createjob', async (req, res) => {

    const user_id = req.user.id;

    const newJob = {
        company_id: user_id,
        job_title: req.body.jobtitle,
        job_nature: req.body.jobnature,
        job_remote: req.body.jobremote,
        location: req.body.location,
        job_description: req.body.jobdescription
    }

    let id = await knex('job_listings').insert(newJob).returning('id');
    newJob.id = id[0].id;

    const jobPic = req.files ? req.files.jobpic : null;
    const jobPicName = "jobpicture" + req.user.id + newJob.id;
    const jobPicDestination = "public/images/jobpics";

    if (jobPic) {
      jobPic.mv(`${jobPicDestination}/${jobPicName}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    res.redirect(`/jobs/jobdetails/${newJob.id}`);
});

router.get('/jobdetails/:job', async (req, res) => {
    
    const jobId = req.params.job;
    let id = req.user ? req.user.id : null;

    const jobInfo = await knex('company_profiles')
        .join('job_listings', 'company_profiles.user_id', '=', 'job_listings.company_id')
        .where({ 'job_listings.id': jobId })
        .first();
    
    const isUser = await knex('user_profiles').where({ user_id: id }).first();
    
    res.render('jobDetails', { jobInfo: jobInfo, isUser: isUser });
});

router.post('/applyjob/:jobId', async (req, res) => {
    
    const jobId = req.params.jobId;
    const userId = req.user.id;

    const newJobApplication = {
        job_id: jobId,
        user_profile_id: userId
    }

    await knex('job_applications').insert(newJobApplication);

    res.redirect('/jobs'); // should go back to jobs I have applied for page
})

router.get('/listedjobs', isLoggedIn, async (req, res) => {
    const id = req.user.id;

    let isCompany = await knex('company_profiles').where({ user_id: id }).first();

    if (isCompany) {

        const jobs = await knex('job_listings')
            .join('job_applications', 'job_listings.id', '=', 'job_applications.job_id')
            .where({ 'job_listings.company_id': id })
            .groupBy('job_listings.id')
            .select('job_listings.id', 'job_listings.job_title')
            .count('* as applicant_count');

        res.render("listedjobs", { jobs: jobs });

    } else {
        res.redirect('/jobs');
    }
})

module.exports = router;