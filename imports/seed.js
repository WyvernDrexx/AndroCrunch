const mongoose = require("mongoose"),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset,
    fs = require("fs");

    
//joining path of directory 
const directoryPath = "../public/thumbnails/";
//passsing directoryPath and callback function
var hasThumb = false;
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (thumb) {
        // Do whatever you want to do with the file
        console.log(thumb);
        if (String(thumb).split("-").length === 1) {
            App.find({}, (err, files) => {
                files.forEach((file) => {
                    if (String(file.thumbnail) === String(thumb)) {
                        hasThumb = true;
                        return;
                    }
                });
                Image.find({}, (err, files) => {
                    files.forEach((file) => {
                        if (String(file.thumbnail) === String(thumb)) {
                            hasThumb = true;
                            return;
                        }
                    });
                    Audio.find({}, (err, files) => {
                        files.forEach((file) => {
                            if (String(file.thumbnail) === String(thumb)) {
                                hasThumb = true;
                                return;
                            }
                        });
                    });
                });
            });

            if (!hasThumb) {
                fs.unlink("../public/thumbnails/" + String(thumb), (err) => {
                    if (err) {
                        console.log("Cannot delete: " + thumb);
                    } else {
                        console.log("Deleted! " + thumb);
                    }
                });
            }
        }

    });


});








// mongoose.connect("mongodb+srv://admin:311210187@dev-cbuvl.mongodb.net/test?retryWrites=true",
//     { useNewUrlParser: true }, (err) => {
//         if (err) {
//             console.log("Error connecting to database!");
//             console.log(err);
//         } else {
//             console.log("Connected to dB");
//             Preset.find({}, (err, data) => {
//                 if (err) {
//                     console.log(err);
//                     return;
//                 }
//                 data.forEach((elem) => {

//                 });
//             });
//         }
//     });

// const sharp = require('sharp');
// const fs = require('fs');

// Audio.find({}, (err, files) => {
//     files.forEach((file) => {
//         let referenceFile = file.thumbnail;
//         let filename = referenceFile.split(".")[0];
//         let inStream = fs.createReadStream('../public/thumbnails/' + referenceFile);

//         // output stream
//         let outStream = fs.createWriteStream('../public/thumbnails/lg-' + filename + ".jpeg", { flags: "w" });

//         // on error of output file being saved
//         outStream.on('error', function () {
//             console.log("Error");
//         });

//         file.thumbnail = filename + ".jpeg";
//         file.save();
//         console.log("File-------------------");
//         console.log(file);
//         console.log("-------------------------");
//         // on success of output file being saved
//         outStream.on('close', function () {
//             console.log("Successfully saved file");
//         });
//         // input stream transformer
//         // "info" event will be emitted on resize
//         let transform = sharp()
//             .jpeg()
//             .resize({ width: 546, height: 320 })
//             .on('info', function (fileInfo) {
//                 console.log("Resizing done, file not saved");
//             });

//         inStream.pipe(transform).pipe(outStream);
//     });
// });



// // input stream
