const methodOverride = require('method-override'),
    sanitizer = require('express-sanitizer'),
    express = require('express'),
    bodyParser = require('body-parser'),
    server = express(),
    passport = require("passport"),
    cookieSession = require("cookie-session"),
    flash = require("connect-flash"),
    helmet = require("helmet"),
    compress = require("compression"),
    expressSession = require("express-session");

server.use(helmet());
server.use(express.static('public'));
server.set("view engine", "ejs");
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(methodOverride("_method"));
server.use(sanitizer());
server.use(cookieSession({
    name: 'hookie',
    secret: "XamarinisTheBoss",
    httpOnly: false,
    secure: false,
}));
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());
server.use((req, res, next) => {
    res.locals.loggedUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});

server.use((err, req, res, next) => {
    if (err) {
        console.log("ERROR ENCOUNTERED ON EXPRESS!");
        console.log(err);
        next();
    } else {
        next();
    }
});
// server.use((req, res, next) => {
//     // res.setHeader("Cache-Control", "public, max-age=300");
//     // res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
//     next();
// });
server.use(compress());
module.exports = server;
