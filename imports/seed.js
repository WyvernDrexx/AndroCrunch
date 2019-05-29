// const mongoose = require("mongoose"),
//     Image = require("../models/uploadsSchema").Image,
//     Audio = require("../models/uploadsSchema").Audio,
//     App = require("../models/uploadsSchema").App,
//     Preset = require("../models/uploadsSchema").Preset;


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
//                 // 
//                 data.forEach((elem) => {
//                     elem.name = elem.filename.trim().toLowerCase().replace(/\s/g, "-");
//                     elem.save()
//                     console.log("Saved: " + elem.filename + " with: " + elem.name);
//                 });
//             });
//             console.log("Getting all!");
//             Preset.find({}, (err, data) => {
//                 console.log(data);
//             });
//         }
//     });

var compress_images = require('compress-images'), INPUT_path_to_your_images, OUTPUT_path;

INPUT_path_to_your_images = '../public/imgs/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
OUTPUT_path = 'build/img/';

compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '60'] } },
    { png: { engine: 'pngquant', command: ['--quality=20-50'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } }, function (error, completed, statistic) {
        console.log('-------------');
        console.log(error);
        console.log(completed);
        console.log(statistic);
        console.log('-------------');
    });