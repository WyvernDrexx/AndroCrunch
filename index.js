const server   = require("./imports/express"),
        PORT   = process.env.PORT || 3000,
    mongoose   = require("mongoose");

mongoose.connect("mongodb://admin:311210187@dev-shard-00-00-cbuvl.mongodb.net:27017,dev-shard-00-01-cbuvl.mongodb.net:27017,dev-shard-00-02-cbuvl.mongodb.net:27017/test?ssl=true&replicaSet=dev-shard-0&authSource=admin&retryWrites=true", {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log("Error connecting to database!");
        console.log(err);
    } else {
        console.log("Connected to dB");
    }
});
server.get("/", (req, res) => {
    res.render("index");
});

//  Required routes

server.use(require("./routes/index"));
server.use(require("./routes/blogposts"));
server.use(require("./routes/auth"));
server.use(require("./routes/upload"));
server.use(require("./routes/category"));
//Wildcard route//
server.get("*", (req, res) => {
    res.render("error", {message: "URL Not found!", code: 404});
});

server.listen(PORT, process.env.IP, () => {
    console.log("Listening....");
});