const express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    jquery = require("jquery"),
    jsonpatch = require('fast-json-patch'),
    fs = require("fs"),
    request = require("request"),
    passport = require("passport"),
    passportJWT = require("passport-jwt"),
    validator = require('validator');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'abhishekLodha';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/static', express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendfile("index.html");
});

//TO HANDLE LOGIN REQUESTS
app.post('/login', (req, res) => {
    if (!validator.isEmpty(req.body.username) && !validator.isEmpty(req.body.password) && validator.isAlphanumeric(req.body.username) && validator.isAscii(req.body.password)) {
        const name = req.body.username;
        const password = req.body.password;
        const payload = {
            username: name,
            password: password
        };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({
            messgae: "Success",
            token: token
        });
    } else {
        res.status(500).json({
            message: 'Username or password is not in required format'
        });
    }
});

//TO HANDLE JSON PATCH REQUEST
app.post('/patch', (req, res) => {
    const token = req.headers.token;
    if (jwt.verify(token, jwtOptions.secretOrKey)) {
        if (validator.isJSON(req.body['default']) && validator.isJSON(req.body['patch'])) {
            const myObj = JSON.parse(req.body['default']);
            const patches = JSON.parse(req.body['patch']);
            jsonpatch.apply(myObj, patches);
            res.json(myObj);
        } else {
            res.status(500).json({
                message: 'Please enter valid json format'
            });
        }
    } else {
        res.status(500).json({
            message: 'User unrecognisable'
        });
    }
});

//TO HANDLE THUMBNAIL CREATION REQUESTS
app.post('/thumbnail', (req, res) => {
    const token = req.headers.token;
    if (jwt.verify(token, jwtOptions.secretOrKey)) {
        const imageURL = req.body['url'];
        if (validator.isURL(imageURL)) {
            const paramOperation = "square";
            const paramValue = 100;
            const imageFilename = "image_thumbnail.jpg";

            const rethumbUri = "http://api.rethumb.com/v1/" + paramOperation + "/" + paramValue + "/" + imageURL;
            const getThumbnail = function(uri, callback) {
                request.head(uri, function(err, res, body) {
                    request(uri).pipe(fs.createWriteStream(imageFilename)).on('close', callback);
                });
            };

            getThumbnail(rethumbUri, function() {
                res.sendfile(imageFilename);
            });
        } else {
            res.status(500).json({
                message: 'Enter valid image url'
            });
        }
    } else {
        res.status(500).json({
            message: 'User unrecognisable'
        });
    }

});

app.listen(8080, function() {
    console.log("Working on port 8080");
});
module.exports = app;
