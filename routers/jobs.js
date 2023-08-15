const router = require('express').Router();
const isLoggedIn = require("../auth/check-login").isLoggedIn;
const { uploadPicture, retrievePicture } = require('../helpers/upload');
const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

//routes
router.get('/', async (req, res) => {

    let id = req.user ? req.user.id : null;
    let isCompany = await knex('company_profiles').where({ user_id: id }).first();

    let jobInfo = await knex('company_profiles')
        .join('job_listings', 'company_profiles.user_id', '=', 'job_listings.company_id');

    jobInfo = jobInfo.map((job) => {
        const formattedDate = job.job_updated_date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        job.job_updated_date = formattedDate;
        return job;
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
        job_summary: req.body.jobsummary,
        job_description: req.body.jobdescription,
        job_status: "Open"
    }

    let id = await knex('job_listings').insert(newJob).returning('id');
    newJob.id = id[0].id;

    uploadPicture(req, 'jobpic', 'jobpicture', 'jobpics');

    res.redirect(`/jobs/jobdetails/${newJob.id}`);
});

router.get('/jobdetails/:job', async (req, res) => {
    
    const jobId = req.params.job;
    const id = req.user ? req.user.id : null;

    const jobInfo = await knex('company_profiles')
        .join('job_listings', 'company_profiles.user_id', '=', 'job_listings.company_id')
        .where({ 'job_listings.id': jobId })
        .first();
    
    //checking if you are a company (shouldn't be able to apply for jobs)
    const isCompany = await knex('company_profiles').where({ user_id: id }).first();
    
    //checking if company that is viewing the job is same company that posted the job (only they can close the role)
    const sameCompany = jobInfo.company_id === id ? true : false;

    const jobOpen = jobInfo.job_status === "Open" ? true : false;

    const jobPicture = [
        { name: "jobpicture", userId: jobInfo.user_id }
    ];

    const jobPicPath = retrievePicture(jobPicture, 'jobpics');

    res.render('jobDetails', { jobInfo: jobInfo, jobOpen, isCompany: isCompany, jobPicPath: jobPicPath, sameCompany: sameCompany });
});

router.post('/closejob/:job', async (req, res) => {
    
    const jobId = req.params.job;
    await knex('job_listings').where({ id: jobId }).update({ job_status: "Closed" });

    res.redirect('/jobs')
})

router.post('/applyjob/:jobId', async (req, res) => {
    
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    const jobId = req.params.jobId;
    const userId = req.user.id;

    const alreadyApplied = await knex('job_applications').where({ job_id: jobId, user_profile_id: userId }).first();    
    if (alreadyApplied) return res.redirect('/jobs/appliedjobs');

    const newJobApplication = {
        job_id: jobId,
        user_profile_id: userId,
        application_status: "Pending"
    }

    await knex('job_applications').insert(newJobApplication);

    res.redirect('/jobs/appliedjobs');
});

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

        const noApplicants = await knex('job_listings')
            .leftJoin('job_applications', 'job_listings.id', '=', 'job_applications.job_id')
            .where({ 'job_listings.company_id': id, 'user_profile_id': null })
            .select('job_listings.id', 'job_listings.job_title');

        res.render("listedjobs", { jobs: jobs, noApplicants: noApplicants });

    } else {
        res.redirect('/jobs');
    }
});

router.get('/listedjobs/:jobid', isLoggedIn, async (req, res) => {
    const id = req.user.id;
    const jobId = req.params.jobid;

    let isCompany = await knex('company_profiles').where({ user_id: id }).first();

    if (isCompany) {
        let applicants = await knex('job_applications')
            .join('job_listings', 'job_listings.id', '=', 'job_applications.job_id')
            .join('user_profiles', 'job_applications.user_profile_id', '=', 'user_profiles.user_id')
            .join('users', 'users.id', '=', 'user_profiles.user_id')
            .where({ 'job_listings.company_id': id, 'job_listings.id': jobId });
        
        applicants = applicants.map((applicant) => {
            const formattedDate = applicant.application_date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            applicant.application_date = formattedDate;
            return applicant;
        });

        console.log(applicants);
            
        res.render('jobApplicants', { applicants: applicants });

    } else {
        res.redirect('/jobs');
    }
});

router.get('/appliedjobs', isLoggedIn, async (req, res) => {
    
    let id = req.user.id;

    let isCompany = await knex('company_profiles').where({ user_id: id }).first();
    if (isCompany) return res.redirect('/jobs');

    let jobs = await knex('job_applications')
        .join('job_listings', 'job_listings.id', '=', 'job_applications.job_id')
        .join('company_profiles', 'company_profiles.user_id', '=', 'job_listings.company_id')
        .where({ 'job_applications.user_profile_id': id });
    
    res.render('appliedJobs', { jobs: jobs });
});

router.post('/rejectapplicant/:job/:user', async (req, res) => {
    const jobId = req.params.job;
    const userId = req.params.user;

    console.log('this should appear on console');

    await knex('job_applications')
        .where({ job_id: jobId, user_profile_id: userId })
        .update({ application_status: "Rejected" });
    
    res.redirect(`/jobs/listedjobs/${jobId}`);
});


module.exports = router;