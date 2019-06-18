const mongoose = require("mongoose"),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset,
    fs = require("fs"),
    Data = require("../models/data");


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


Data.create({
    list: {
        download: 22,
        subscribers: 3,
        wallpapers: 22,
        ringtones: 32,
        presets: 12,
        apps: 4
    }
}, (err, datas) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
});

