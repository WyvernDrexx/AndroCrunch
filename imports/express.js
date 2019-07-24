const methodOverride = require('method-override'),
    sanitizer = require('express-sanitizer'),
    express = require('express'),
    bodyParser = require('body-parser'),
    server = express(),
    passport = require("passport"),
    cookieSession = require("cookie-session"),
    flash = require("connect-flash"),
    helmet = require("helmet"),
    compress = require("compression");
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

server.use((req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=60");
    console.log("hit");
    if (req.headers.hostname === "androcrunch.in") {
        console.log("hit");
        res.writeHead(301, {
            Location: "https://www." + req.headers["hostname"] + req.url
        });
        res.end();
    }else{
        next();
    }
    next();
});


server.use(compress());
module.exports = server;
