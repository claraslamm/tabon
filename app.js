//express
const express = require('express')
const app = express();

//handlebars
const { engine } = require('express-handlebars');
app.engine('handlebars', engine({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
    },
}));
app.set('view engine', 'handlebars');

//knex
const knexfile = require("./knexfile").development;
const knex = require("knex")(knexfile);

//encoding
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//uploading files
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//passport and sessions
const session = require("express-session");
const passport = require('./auth/passport-config');

app.use(
    session({
        secret: 'WingardiumLeviosa',
        resave: false,
        saveUninitialized: false,
    })
)

app.use(passport.initialize());
app.use(passport.session());

//public folder
app.use(express.static("public"));

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

//routes
const homeRoute = require('./routers/home');
app.use('/', homeRoute);

const authRoutes = require('./routers/auth');
app.use('/auth', authRoutes);

const profileRoutes = require('./routers/profiles');
app.use('/profile', profileRoutes);

const jobRoutes = require('./routers/jobs');
app.use('/jobs', jobRoutes);

const postRoutes = require('./routers/posts');
app.use('/posts', postRoutes);

//server is listening
app.listen(8000, () => {
    console.log('Server is listening');
})