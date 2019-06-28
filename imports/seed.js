const mongoose = require("mongoose"),
    file = require("../models/uploadsSchema").file,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset,
    fs = require("fs"),
    Data = require("../models/data"),
    Image = require("../models/uploadsSchema").Image,
    Post = require("../models/post");


if (process.env.NODE_ENV === "production") {
    mongoose.connect("mongodb://admin:311210187@dev-shard-00-00-cbuvl.mongodb.net:27017,dev-shard-00-01-cbuvl.mongodb.net:27017,dev-shard-00-02-cbuvl.mongodb.net:27017/test?ssl=true&replicaSet=dev-shard-0&authSource=admin&retryWrites=true", {
        useNewUrlParser: true
    }, (err) => {
        if (err) {
            console.log("Couldn't connect to database from production environment!");
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



Data.find({})
    .then(data => {
        Post.find({})
            .then(posts => {
                console.log(posts);
                posts.forEach((post, i) => {
                    data[0].list.latestPosts[i] = {
                        postId: post._id
                    };
                });
                data[0].save(saved => {
                    console.log(saved);
                });
            })
            .catch(err => {
                console.log(err);
            })
    })
    .catch(err => {
        console.log(err);
    })