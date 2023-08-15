const fs = require('fs');

const uploadPicture = (req, name, picturename, destination, extraid) => {
    const picture = req.files ? req.files[name] : null;
    const pictureName = picturename + req.user.id + extraid;
    const pictureDestination = `public/images/${destination}`;
    
    if (picture) {
        picture.mv(`${pictureDestination}/${pictureName}`, (err) => {
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
        });
    }
}

const retrievePicture = (pictureArray, folder, id) => {
    return pictureArray.map(pic => {
        const imagePath = `/images/${folder}/${pic.name}${pic.userId}/${id}`;
        const exists = fs.existsSync(`public${imagePath}`);
        return exists ? imagePath : null;
    })
}

module.exports = {
    uploadPicture,
    uploadProjectPics,
    uploadResume,
    retrievePicture
}