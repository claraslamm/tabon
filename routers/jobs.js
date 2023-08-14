const router = require('express').Router();

const knexfile = require("../knexfile").development;
const knex = require("knex")(knexfile);

//routes

router.get('/', (req, res) => {
    res.send('this is the main jobs page');
})

router.get('/createjob', (req, res) => {
    res.render('createjob');
})

module.exports = router;