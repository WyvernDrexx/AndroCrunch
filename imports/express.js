const methodOverride = require('method-override');
sanitizer = require('express-sanitizer'),
    express = require('express'),
    bodyParser = require('body-parser'),
    server = express(),
    passport = require("passport"),
    expressSession = require("express-session"),
    flash = require("connect-flash"),
    helmet = require("helmet");
server.use(helmet());
server.use(express.static('public'));
server.set("view engine", "ejs");
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(methodOverride("_method"));
server.use(sanitizer());
server.use(expressSession({
    secret: "XamarinReborn",
    key: "Cooke",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000)
    }
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
// if(process.env.NODE_ENV === "development"){
//         server.use(require("../middlewares/logger").log());
// }
let logger = require("../middlewares/logger");
server.use(logger);
module.exports = server;