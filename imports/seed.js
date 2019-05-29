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
                data.forEach((elem) => {
                    
                });
            });
        }
    });

const sharp = require('sharp');
const fs = require('fs');
const path = require("path");

//passsing directoryPath and callback function
fs.readdir("../public/thumbnails", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {

    });
});



// input stream
