const router = require('express').Router();
const { isLoggedIn } = require('../helpers/check-login');
const { uploadPicture, retrievePicture } = require('../helpers/upload');
const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

router.get('/createpost', isLoggedIn, (req, res) => {
    res.render('createPost');
})

router.post('/createpost', async (req, res) => {
    
    const user_id = req.user.id;

    const newPost = {
        post_user_id: user_id,
        post_title: req.body.posttitle,
        post_summary: req.body.postsummary,
        post_description: req.body.postdescription
    }

    let id = await knex("user_posts").insert(newPost).returning("id");
    newPost.id = id[0].id;

    uploadPicture(req, 'postpic', 'postpicture', 'postpics', newPost.id);

    res.redirect(`/posts/postdetails/${newPost.id}`)
})

router.get('/postdetails/:postid', async (req, res) => {

    const postId = req.params.postid;
    
    const postInfo = await knex('user_posts')
        .join('user_profiles', 'user_profiles.user_id', '=', 'user_posts.post_user_id')
        .where({ 'user_posts.id': postId })
        .first();
    
    const postPicture = [
        { name: "postpicture", userId: postInfo.user_id }
    ];

    const postPicPath = retrievePicture(postPicture, 'postpics', postId);

    res.render('postDetails', { postInfo: postInfo, postPicPath: postPicPath });
})



module.exports = router;