//express
const express = require('express')
const app = express();

//handlebars
const { engine } = require('express-handlebars');
app.engine('handlebars', engine({ defaultLayout: 'main' }));
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
        secret: 'ExpectoPatronum',
        resave: false,
        saveUninitialized: false,
    })
)

app.use(passport.initialize());
app.use(passport.session());

//public folder
app.use(express.static("public"));

//routes
const isLoggedIn = require("./auth/check-login").isLoggedIn;

app.get('/', isLoggedIn, (req, res) => {
    res.render('home');
})

const authRoutes = require('./routers/auth');
app.use('/auth', authRoutes);

const profileRoutes = require('./routers/profiles');
app.use('/profile', profileRoutes);

const jobRoutes = require('./routers/jobs');
app.use('/jobs', jobRoutes);

//server is listening
app.listen(8000, () => {
    console.log('Server is listening');
})