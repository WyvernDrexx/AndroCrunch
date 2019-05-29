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

Preset.find({}, (err, files) => {
    files.forEach((file) => {
        let referenceFile = file.thumbnail;
        let filename = referenceFile.split(".")[0];
        let inStream = fs.createReadStream('../public/thumbnails/' + referenceFile);

        // output stream
        let outStream = fs.createWriteStream('../public/thumbnails/' + filename + ".jpeg", { flags: "w" });

        // on error of output file being saved
        outStream.on('error', function () {
            console.log("Error");
        });

        file.thumbnail = filename + ".jpeg";
        file.save();
        console.log("File-------------------");
        console.log(file);
        console.log("-------------------------");
        // on success of output file being saved
        outStream.on('close', function () {
            console.log("Successfully saved file");
        });
        // input stream transformer
        // "info" event will be emitted on resize
        let transform = sharp()
            .jpeg()
            .resize({ width: 128, height: 128 })
            .on('info', function (fileInfo) {
                console.log("Resizing done, file not saved");
            });

        inStream.pipe(transform).pipe(outStream);


        // Medium size thumbnail

        // output stream
        outStream = fs.createWriteStream('../public/thumbnails/med-' + filename + ".jpeg", { flags: "w" });
        inStream = fs.createReadStream('../public/thumbnails/' + referenceFile);

        // on error of output file being saved
        outStream.on('error', function () {
            console.log("Error");
        });

        // on success of output file being saved
        outStream.on('close', function () {
            console.log("Successfully saved file");
        });
        // input stream transformer
        // "info" event will be emitted on resize
        transform = sharp()
            .jpeg()
            .resize({ width: 300, height: 250 })
            .on('info', function (fileInfo) {
                console.log("Resizing done, file not saved");
            });

        inStream.pipe(transform).pipe(outStream);

    });
});



// input stream
