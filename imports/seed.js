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
                    let inStream = fs.createReadStream('../public/thumbnails/' + elem.thumbnail);

                    // output stream
                    let outStream = fs.createWriteStream('../public/thumbnails/' + elem.thumbnail.split(".")[0] + ".webp", { flags: "w" });

                    // on error of output file being saved
                    outStream.on('error', function () {
                        console.log("Error");
                    });

                    // on success of output file being saved
                    outStream.on('close', function () {
                        console.log("Successfully saved file");
                    });
                    elem.thumbnail = elem.thumbnail.split(".")[0] + ".webp";
                    // input stream transformer
                    // "info" event will be emitted on resize
                    let transform = sharp()
                        .webp()
                        .resize({ width: 142, height: 96 })
                        .on('info', function (fileInfo) {
                            console.log("Resizing done, file not saved");
                        });

                    inStream.pipe(transform).pipe(outStream);
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
