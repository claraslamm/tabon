const router = require('express').Router();
const passport = require('passport');

const knexfile = require('../knexfile').development;
const knex = require('knex')(knexfile);

const notLoggedIn = require('../auth/check-login').notLoggedIn;

//signup page
router.get('/signup', notLoggedIn, (req, res) => {
    res.render('signup');
})

router.post('/signup',
    passport.authenticate('local-signup', {
        successRedirect: "/auth/create",
        failureRedirect: "/auth/signup",
    })
)

//login page
router.get('/login', notLoggedIn, (req, res) => {
    res.render('login');
})

router.post('/login',
    passport.authenticate('local-login', {
        successRedirect: "/",
        failureRedirect: "/auth/login"
    })
)

//login with google
router.post('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/create');
})


module.exports = router;