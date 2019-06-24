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

const serverFavicon = require("serve-favicon");
server.use((request, response, next) => {
    console.log(request.hostname);
    console.log(request.headers.host);
    console.log(request.url);
    console.log(request.baseUrl);
    next()
});
//  Required routes
server.use(serverFavicon(__dirname + '/public/imgs/favicon.ico'));
server.use(require("./routes/index"));
server.use(require("./routes/blogposts"));
server.use(require("./routes/auth"));
server.use(require("./routes/upload"));
server.use(require("./routes/category"));
server.use(require("./routes/download"));

server.get("*", (req, res) => {
    res.render("error", { message: "URL Not found!", code: 404 });
});

if (typeof process.env.NODE_ENV === "undefined") {
    var options = {
        key: fs.readFileSync('/etc/letsencrypt/live/androcrunch.in/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/androcrunch.in/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/androcrunch.in/chain.pem')
    };
    server.get("*", function (request, response) {
        if (request.headers.host.split("www").length >= 2) {
            response.redirect(request.hostname.split("www")[1].replace(".", "") + request.url);
            return;
        }
        response.redirect("https://" + request.headers.host + request.url);
    });
    https.createServer(options, server).listen(443, () => {
        console.log("Server is on production mode and listening on 443");
    });
} else {
    server.listen(3000, () => {
        console.log("Server listening on PORT 3000");
    });
}

