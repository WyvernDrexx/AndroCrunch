const mongoose = require("mongoose"),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset;


mongoose.connect("mongodb+srv://admin:311210187@dev-cbuvl.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true }, (err) => {
        if (err) {
            console.log("Error connecting to database!");
            console.log(err);
        } else {
            console.log("Connected to dB");
            Preset.find({}, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                // 
                data.forEach((elem) => {
                    elem.name = elem.filename.trim().toLowerCase().replace(/\s/g, "-");
                    elem.save()
                    console.log("Saved: " + elem.filename + " with: " + elem.name);
                });
            });
            console.log("Getting all!");
            Preset.find({}, (err, data) => {
                console.log(data);
            });
        }
    });
