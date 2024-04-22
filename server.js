/* Require modules
--------------------------------------------------------------- */
require('dotenv').config()
const path = require('path');
const express = require('express');


/* Require the db connection, models, and seed data
--------------------------------------------------------------- */
const db = require('./models');
const carsCtrl = require('./controllers/cars')


/* Create the Express app
--------------------------------------------------------------- */
const app = express();


/* Configure the app (app.set)
--------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* Middleware (app.use)
--------------------------------------------------------------- */
app.use(express.static('public'))


/* Mount routes
--------------------------------------------------------------- */
app.get('/', function (req, res) {
    db.car.getCars(db.sql)
        .then(cars => {res.render('home', {cars: cars})})
});

app.get('/about', function (req, res) {
    res.render('about')
})

app.use('/cars', carsCtrl)


/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
