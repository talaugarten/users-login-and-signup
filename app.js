const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./dbAdapter');
const md5 = require('md5');
const ejs = require('ejs');

const path = require('path');

const app = express();

app.use('/static', express.static('public'))
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

app.get('/', function (req, res) {
    res.redirect('/myApp')
});

app.get('/login', function (req, res) {
    ejs.renderFile(path.resolve('template.ejs'), {content: 'login.ejs', data: {}}, {}, (err, str) => {
        res.send(str);
    });
});

app.get('/signUp', function (req, res) {
    res.sendFile(path.resolve('signUp.html'))
});

app.get('/isAvailable', function (req, res) {
    db.connection.query('SELECT 1 FROM users WHERE user_name=\'' + req.query.userName + '\'', function (error, results) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({isAvailable: results && results.length === 0}))
    });
});

app.get('/myApp', function (req, res) {

    if (req.cookies.userId > 0) {

        db.connection.query('SELECT user_name FROM users WHERE id=\'' + req.cookies.userId + '\'' , function (error, results) {
            ejs.renderFile(path.resolve('template.ejs'), {content: 'myApp.ejs', data: {userName: results[0].user_name}}, {}, (err, str) => {
                res.send(str);
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/login', function (req, res) {


    db.connection.query(`SELECT password,id FROM users WHERE user_name='' or '1='1' And password=MD5(${pass})` , function (error, results) {
        if (results.length> 0 && results[0].password === md5(req.body['password'])) {
            res.cookie('userId', '' + results[0].id);
            res.redirect('/myApp')
        } else {
            res.redirect('/login')
        }
    });
});

app.post('/signUp', function (req, res) {
    db.connection.query('INSERT INTO users (user_name, password) VALUES (\'' + req.body['userName'] + '\',\'' + md5(req.body['password']) + '\')', function (error, results) {
        res.cookie('userId', '' + results.insertId);
        res.redirect('/myApp')
    });
});

app.listen(3000, function () {

});