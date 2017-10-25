const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash  = require('express-flash');


const app = express();
//mongodb://<dbuser>:<dbpassword>@ds231245.mlab.com:31245/dylannewsletter
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs'  }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use (morgan('dev'));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret:"sqsjhdsdhd",
    store: new MongoStore({ url: 'mongodb://<user>:<pw>@ds231245.mlab.com:31245/dylannewsletter'})
}));
app.use(flash());

app.route('/')
    .get((req, res, next) => {
        res.render('main/home', { message: req.flash('success') });
    })
    .post((req, res, next) => {
        request({
            url:'https://us17.api.mailchimp.com/3.0/lists/a3c4cfb9bd/members',
            method: 'POST',
            headers: {
                'Authorization':'randomUser <api>',
                'Content-Type': 'application/json'
            },
            json: {
                'email_address': req.body.email,
                'status': 'subscribed'
            }
        }, function(err, body) {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', "You have submitted your email");
                res.redirect('/');
            }
        })
    });


app.listen(3030, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Running on port 3030");
    }
});



