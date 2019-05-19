const server   = require("./imports/express"),
        PORT   = process.env.PORT || 80,
    mongoose   = require("mongoose");


if(process.env.NODE_ENV === "production"){
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
}else{
    mongoose.connect("mongodb+srv://admin:311210187@dev-cbuvl.mongodb.net/test?retryWrites=true", {
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

server.use(require("./routes/index"));
server.use(require("./routes/blogposts"));
server.use(require("./routes/auth"));
server.use(require("./routes/upload"));
server.use(require("./routes/category"));
server.use(require("./routes/download"));

//Wildcard route//
server.get("*", (req, res) => {
    res.render("error", {message: "URL Not found!", code: 404});
});

server.listen(PORT, process.env.IP, () => {
    console.log("Listening....");
});