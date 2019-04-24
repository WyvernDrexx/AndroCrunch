const mongoose = require("mongoose"),
User     = require("../models/user");

mongoose.connect("mongodb://admin:311210187@dev-shard-00-00-cbuvl.mongodb.net:27017,dev-shard-00-01-cbuvl.mongodb.net:27017,dev-shard-00-02-cbuvl.mongodb.net:27017/test?ssl=true&replicaSet=dev-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true }, (err) => {
        if (err) {
            console.log("Error connecting to database!");
            console.log(err);
        } else {
            console.log("Connected to dB");
        }
});

User.findByIdAndRemove({}, (err, data) => {
    if(err) {
        console.log("Unable to remove users!");
        console.log(err);
    }else{
        console.log("All data removed from Users!");
    }
});