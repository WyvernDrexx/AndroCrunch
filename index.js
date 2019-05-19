const server = require("./imports/express"),
    PORT = 443,
    mongoose = require("mongoose");
var https = require('https');
var fs = require('fs');
const express = require("express");
if (typeof process.env.NODE_ENV === "undefined") {
    mongoose.connect("mongodb://admin:311210187@dev-shard-00-00-cbuvl.mongodb.net:27017,dev-shard-00-01-cbuvl.mongodb.net:27017,dev-shard-00-02-cbuvl.mongodb.net:27017/test?ssl=true&replicaSet=dev-shard-0&authSource=admin&retryWrites=true", {
        useNewUrlParser: true
    }, (err) => {
        if (err) {
            console.log("Couldn't connect to database from Develpoment environment!");
            console.log(err);
        } else {
            console.log("Database connected to Production environment!");
        }
    });
} else {
    mongoose.connect("mongodb+srv://admin:311210187@dev-cbuvl.mongodb.net/beta?retryWrites=true", {
        useNewUrlParser: true
    }, (err) => {
        if (err) {
            console.log("Couldn't connect to database from Develpoment environment!");
            console.log(err);
        } else {
            console.log("Database connected to Develpoment environment!");
        }
    });
}
server.get("/", (req, res) => {
    res.render("index");
});

//  Required routes
server.use(function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://androcrunch.in' + req.url);
    }
});

server.use(require("./routes/index"));
server.use(require("./routes/blogposts"));
server.use(require("./routes/auth"));
server.use(require("./routes/upload"));
server.use(require("./routes/category"));
server.use(require("./routes/download"));

//Wildcard route//
//#server.get("*", (req, res) => {
//#    res.render("error", {message: "URL Not found!", code: 404});
//#});

if (typeof process.env.NODE_ENV === "undefined") {
    var options = {
        key: fs.readFileSync('/etc/letsencrypt/live/androcrunch.in/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/androcrunch.in/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/androcrunch.in/chain.pem')
    };

    https.createServer(options, server).listen(443, () => {
        console.log("Server is on production mode and listening on 443");
    });
} else {
    server.listen(3000, () => {
        console.log("Server listening on PORT 3000");
    });
}

