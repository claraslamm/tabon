const express = require('express')
const app = express();

const { engine } = require('express-handlebars');
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login');
})

app.listen(8000, () => {
    console.log('Server is listening');
})