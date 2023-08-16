const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const bcrypt = require("bcrypt");
const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await knex('users').where({ id }).first();
    return user ? done(null, user) : done(null, false);
});

passport.use("local-signup", new LocalStrategy(
    { usernameField: 'username', passReqToCallback: true },
    async (req, username, password, done) => {
        const user = await knex('users').where({ username }).first();
        if (user) {
            return done(null, false, {
                message: "Username is already taken"
            })
        }

        let emailExists = await knex('users').where({ email: req.body.email }).first();
        if (emailExists) {
            return done(null, false, {
                message: "This email has already been used to create an account"
            })
        }

        const email = req.body.email;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let newUser = {
            username: username,
            password: hash,
            email: email,
        };

        let id = await knex('users').insert(newUser).returning('id');
        newUser.id = id[0].id;
        return done(null, newUser);
    }
))

passport.use("local-login",
    new LocalStrategy({ usernameField: "username" },
        async (username, password, done) => {
            const user = await knex('users').where({ username }).first();

            if (!user) {
                return done(null, false, {
                    message: "User does not exist in the database"
                })
            }

            const result = await bcrypt.compare(password, user.password);
            return result ? done(null, user) : done(null, false, { message: "Incorrect Password" });
    })
)

//setting up google strategy

passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        let user = await knex('users').where({ email: profile._json.email }).first();
        if (user) {
            done(null, user)
        } else {
            let newUser = {
                email: profile._json.email,
            }

            let id = await knex("users").insert(newUser).returning("id");
            newUser.id = id[0].id;
            console.log(newUser);
            return done(null, newUser);
        }
    })
)



module.exports = passport;