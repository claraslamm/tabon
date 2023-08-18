const router = require('express').Router();
const passport = require('passport');

const knexfile = require('../knexfile').development;
const knex = require('knex')(knexfile);

const notLoggedIn = require('../auth/check-login').notLoggedIn;

//signup page
router.get('/signup', notLoggedIn, (req, res) => {
    res.render('signup', { layout: 'alt' });
})

router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        
        if (err) {
            return next(err);
        };

        if (!user) {
            if (info.message === "This username has already been taken") {
                return res.render('signup', { layout: 'alt', message: info.message });
            } else if (info.message === "This email has already been used") {
                return res.render('signup', { layout: 'alt', message: info.message });
            } else {
                return res.render('signup', { layout: 'alt', message: info.message });
            }
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/profile/createprofile');
        });
    })(req, res, next);
})

//login page
router.get('/login', notLoggedIn, (req, res) => {
    res.render('login', { layout: 'alt' });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
    
        if (err) {
            return next(err);
        };

        if (!user) {
            if (info.message === "User does not exist") {
                return res.render('login', { layout: 'alt', message: info.message });
            } else if (info.message === "Incorrect password") {
                return res.render('login', { layout: 'alt', message: info.message });
            } else {
                return res.render('login', { layout: 'alt', message: info.message });
            }
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

//login with google
router.post('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/createusername');
});

//logout

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/auth/login');
})


module.exports = router;