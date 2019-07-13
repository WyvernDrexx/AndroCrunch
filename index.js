const server = require("./imports/express"),
    mongoose = require("mongoose");
var fs = require('fs');
if (typeof process.env.NODE_ENV === "undefined") {
    mongoose.connect("mongodb://admin:311210187@dev-shard-00-00-cbuvl.mongodb.net:27017,dev-shard-00-01-cbuvl.mongodb.net:27017,dev-shard-00-02-cbuvl.mongodb.net:27017/test?ssl=true&replicaSet=dev-shard-0&authSource=admin&retryWrites=true", {
        useNewUrlParser: true
    }, (err) => {
        if (err) {
            console.log("Couldn't connect to database from Development environment!");
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
            console.log("Couldn't connect to database from Development environment!");
            console.log(err);
        } else {
            console.log("Database connected to Production environment!");
        }
    });
}

const serverFavicon = require("serve-favicon");


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
    console.log("[+] Production mode");
}

server.listen(3000, () => {
    console.log("Server listening on PORT 3000");
});

