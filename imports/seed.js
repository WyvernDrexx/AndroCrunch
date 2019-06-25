const mongoose = require("mongoose"),
    file = require("../models/uploadsSchema").file,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset,
    fs = require("fs"),
    Data = require("../models/data"),
    Image = require("../models/uploadsSchema").Image;


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

for(let i = 1 ; i <= 3; i++){

    var image = {
        filename: `Image file test $i`,
        mimetype: "image",
        size: "12500",
        referenceFile: "1560834037063.jpg",
        description: "Test file image",
        uploader: "Bomm",
        name: `test-file-img-$i`,
        created: Date.now(),
        downloads: i,
        thumbnail: "sm-1560837287725.jpeg"
    }

    var audio = {
        filename: `Audio file test $i`,
        mimetype: "audio",
        size: "12500",
        referenceFile: "1558241352182.mp3",
        description: "Test file audio",
        uploader: "Bomm",
        name: `test-file-audio-$i`,
        created: Date.now(),
        downloads: i,
        thumbnail: "sm-1560837287725.jpeg"
    }

    var apps = {
        filename: `Apps file test $i`,
        mimetype: "application",
        size: "12500",
        referenceFile: "1558241352182.mp3",
        description: "Test file app",
        uploader: "Bomm",
        name: `test-app-file-$i`,
        created: Date.now(),
        downloads: i,
        thumbnail: "sm-1560837287725.jpeg"
    }

    var presets = {
        filename: `Presets file test $i`,
        mimetype: "zip",
        size: "12500",
        referenceFile: "1558241534343.zip",
        description: "Test file presets",
        uploader: "Bomm",
        name: `test-presets-file-$i`,
        created: Date.now(),
        downloads: i,
        thumbnail: "sm-1560837287725.jpeg"
    }



    // Audio.create(audio, (err, data) => {
    //     if(err){
    //         return console.log("Error creating audio");
    //     }
    //     console.log("Audio created!");
    // });
    // Image.create(image, (err, data) => {
    //     if(err){
    //         return console.log("Error creating audio");
    //     }
    //     console.log("Image created!");
    // });
    App.create(apps, (err, data) => {
        if(err){
            return console.log("Error creating audio");
        }
        console.log("Apps created!" + i);
    });
    // Preset.create(presets, (err, data) => {
    //     if(err){
    //         return console.log("Error creating audio");
    //     }
    //     console.log("Presets created! " + i);
    // });



}