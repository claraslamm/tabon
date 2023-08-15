const formatJobDate = jobInfo => {
    jobInfo.map((job) => {
        const formattedDate = job.job_updated_date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        return { ...job, job_updated_date: formattedDate };
    });
}

const uploadProfilePic = req => {
    const profilePic = req.files ? req.files.profilepic : null;
    const profilePicName = 'profilepicture' + req.user.id;
    const profilePicDestination = "public/images/profilepics";
    
    if (profilePic) {
        profilePic.mv(`${profilePicDestination}/${profilePicName}`, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

const uploadProjectPics = req => {

    const projectPics = [
        { file: req.files?.projectpic1, name: 'projectpicture1' },
        { file: req.files?.projectpic2, name: 'projectpicture2' },
        { file: req.files?.projectpic3, name: 'projectpicture3' },
    ];

    const projectPicDestination = 'public/images/projectpics';

    for (let i = 0; i < projectPics.length; i++) {
        const { file, name } = projectPics[i];
        const newFileName = name + req.user.id;

        if (file) {
            file.mv(`${projectPicDestination}/${newFileName}`, (err) => {
                if (err) {
                    console.log(err);
                };
            });    
        }
    };
}

const uploadResume = req => {
    const resume = req.files ? req.files.uploadresume : null;
    const resumeName = 'resume' + req.user.id;
    const resumeDestination = "public/resumes";

    if (resume) {
        const resumeExtension = resume.name.split('.').pop().toLowerCase();
        const resumePath = `${resumeDestination}/${resumeName}.${resumeExtension}`;
        resume.mv(resumePath, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }
}

module.exports = {
    formatJobDate,
    uploadProfilePic,
    uploadProjectPics,
    uploadResume
}