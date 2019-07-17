const mongoose = require("mongoose"),
    file = require("../models/uploadsSchema").file,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset,
    fs = require("fs"),
    Data = require("../models/data"),
    Post = require("../models/post"),
    Image = require("../models/uploadsSchema").Image;


if (typeof process.env.NODE_ENV == "undefined") {
    mongoose.connect("mongodb://admin:311210187@dev-shard-00-00-cbuvl.mongodb.net:27017,dev-shard-00-01-cbuvl.mongodb.net:27017,dev-shard-00-02-cbuvl.mongodb.net:27017/test?ssl=true&replicaSet=dev-shard-0&authSource=admin&retryWrites=true", {
        useNewUrlParser: true
    }, (err) => {
        if (err) {
            console.log("Couldn't connect to database from Production environment!");
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

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

let apps = [];
let presets = [];
let ringtones = [];
let wallpapers = [];
var max = [];
let blogs = [];
var maxIndex = [1, 0, 3];
var maxDownloads = [0, 0, 0];

Image.find({}, (err, files) => {
    if (err) {
        console.log("Error retrieving images! Exiting execution!");
        console.log("============================================================================");
        console.log("============================================================================");
        console.log(err);
        console.log("============================================================================");
        console.log("============================================================================");
        return;
    }

    files.forEach((file, index) => {
        /* If current element is greater than first*/
        if (file.downloads > maxDownloads[0]) {
            maxDownloads[2] = maxDownloads[1];
            maxDownloads[1] = maxDownloads[0];
            maxDownloads[0] = file.downloads;
            maxIndex[2] = maxIndex[1];
            maxIndex[1] = maxIndex[0];
            maxIndex[0] = index;
        } /* If arr[i] is in between first and second then update second  */
        else if (file.downloads > maxDownloads[1]) {
            maxDownloads[2] = maxDownloads[1];
            maxDownloads[1] = file.downloads;
            maxIndex[2] = maxIndex[1];
            maxIndex[1] = index;
        } else if (file.downloads > maxDownloads[2]) {
            maxDownloads[2] = file.downloads;
            maxIndex[2] = index;
        }
    });
    wallpapers[0] = files[maxIndex[0]];
    wallpapers[1] = files[maxIndex[1]];
    wallpapers[2] = files[maxIndex[2]];

    maxIndex = [0, 0, 0];
    maxDownloads = [0, 0, 0];


    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Wallpapers Sent~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(wallpapers);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Downloads~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(maxDownloads);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Index~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(maxIndex);
    console.log("\n\n============================================================================");
    console.log("============================================================================\n\n");



    App.find({}, (err, files) => {
        if (err) {
            console.log("Error retrieving Apps! Exiting execution!");
            console.log("============================================================================");
            console.log("============================================================================");
            console.log(err);
            console.log("============================================================================");
            console.log("============================================================================");
            return;
        }

        files.forEach((file, index) => {
            if (file.downloads > maxDownloads[0]) {
                maxDownloads[2] = maxDownloads[1];
                maxDownloads[1] = maxDownloads[0];
                maxDownloads[0] = file.downloads;
                maxIndex[2] = maxIndex[1];
                maxIndex[1] = maxIndex[0];
                maxIndex[0] = index;
            } /* If arr[i] is in between first and second then update second  */
            else if (file.downloads > maxDownloads[1]) {
                maxDownloads[2] = maxDownloads[1];
                maxDownloads[1] = file.downloads;
                maxIndex[2] = maxIndex[1];
                maxIndex[1] = index;
            } else if (file.downloads > maxDownloads[2]) {
                maxDownloads[2] = file.downloads;
                maxIndex[2] = index;
            }
        });

        apps[0] = files[maxIndex[0]];
        apps[1] = files[maxIndex[1]];
        apps[2] = files[maxIndex[2]];



        console.log("\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Apps Sent~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(apps);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Downloads~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(maxDownloads);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Index~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(maxIndex);
        console.log("\n\n============================================================================");
        console.log("============================================================================\n\n");


        maxIndex = [0, 0, 0];
        maxDownloads = [0, 0, 0];


        Preset.find({}, (err, files) => {
                if (err) {
                    console.log("Error retrieving Presets! Exiting execution!");
                    console.log("============================================================================");
                    console.log("============================================================================");
                    console.log(err);
                    console.log("\n\n============================================================================");
                    console.log("============================================================================\n\n");
                    return;
                }

                files.forEach((file, index) => {
                    if (file.downloads > maxDownloads[0]) {
                        maxDownloads[2] = maxDownloads[1];
                        maxDownloads[1] = maxDownloads[0];
                        maxDownloads[0] = file.downloads;
                        maxIndex[2] = maxIndex[1];
                        maxIndex[1] = maxIndex[0];
                        maxIndex[0] = index;
                    } /* If arr[i] is in between first and second then update second  */
                    else if (file.downloads > maxDownloads[1]) {
                        maxDownloads[2] = maxDownloads[1];
                        maxDownloads[1] = file.downloads;
                        maxIndex[2] = maxIndex[1];
                        maxIndex[1] = index;
                    } else if (file.downloads > maxDownloads[2]) {
                        maxDownloads[2] = file.downloads;
                        maxIndex[2] = index;
                    }
                });

                presets[0] = files[maxIndex[0]];
                presets[1] = files[maxIndex[1]];
                presets[2] = files[maxIndex[2]];




                console.log("\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Presets Sent~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log(presets);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Downloads~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log(maxDownloads);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Index~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log(maxIndex);
                console.log("\n\n============================================================================");
                console.log("============================================================================\n\n");




                maxIndex = [0, 0, 0];
                maxDownloads = [0, 0, 0];


                Audio.find({})
                    .then(files => {
                        files.forEach((file, index) => {
                            if (file.downloads > maxDownloads[0]) {
                                maxDownloads[2] = maxDownloads[1];
                                maxDownloads[1] = maxDownloads[0];
                                maxDownloads[0] = file.downloads;
                                maxIndex[2] = maxIndex[1];
                                maxIndex[1] = maxIndex[0];
                                maxIndex[0] = index;
                            } /* If arr[i] is in between first and second then update second  */
                            else if (file.downloads > maxDownloads[1]) {
                                maxDownloads[2] = maxDownloads[1];
                                maxDownloads[1] = file.downloads;
                                maxIndex[2] = maxIndex[1];
                                maxIndex[1] = index;
                            } else if (file.downloads > maxDownloads[2]) {
                                maxDownloads[2] = file.downloads;
                                maxIndex[2] = index;
                            }
                        });

                        ringtones[0] = files[maxIndex[0]];
                        ringtones[1] = files[maxIndex[1]];
                        ringtones[2] = files[maxIndex[2]];



                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Ringtones/Audio Sent~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log(ringtones);
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Downloads~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log(maxDownloads);
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Index~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log(maxIndex);
                        console.log("\n\n============================================================================");
                        console.log("============================================================================\n\n");


                        maxIndex = [0, 0, 0];
                        maxDownloads = [0, 0, 0];

                        Post.find({})
                            .then(posts => {
                                posts.forEach((post, index) => {
                                    /* If current element is greater than first*/
                                    if (post.views > maxDownloads[0]) {
                                        maxDownloads[2] = maxDownloads[1];
                                        maxDownloads[1] = maxDownloads[0];
                                        maxDownloads[0] = post.views;
                                        maxIndex[2] = maxIndex[1];
                                        maxIndex[1] = maxIndex[0];
                                        maxIndex[0] = index;
                                    } /* If arr[i] is in between first and second then update second  */
                                    else if (post.views > maxDownloads[1]) {
                                        maxDownloads[2] = maxDownloads[1];
                                        maxDownloads[1] = post.views;
                                        maxIndex[2] = maxIndex[1];
                                        maxIndex[1] = index;
                                    } else if (post.views > maxDownloads[2]) {
                                        maxDownloads[2] = post.views;
                                        maxIndex[2] = index;
                                    }
                                });
                                blogs[0] = posts[maxIndex[0]];
                                blogs[1] = posts[maxIndex[1]];
                                blogs[2] = posts[maxIndex[2]];


                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Ringtones/Audio Sent~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log(posts);
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Downloads~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log(maxDownloads);
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Max Index~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                                console.log(maxIndex);
                                console.log("\n\n============================================================================");
                                console.log("============================================================================\n\n");



                                maxIndex = [0, 0, 0];
                                maxDownloads = [0, 0, 0];
                                Data.find({})
                                    .then((data) => {
                                        data[0].list.trending.ringtones = ringtones;
                                        data[0].list.trending.wallpapers = wallpapers;
                                        data[0].list.trending.presets = presets;
                                        data[0].list.trending.apps = apps;
                                        data[0].list.trending.blogs = blogs;
                                        data[0].save((err, docs) => {
                                            if (err) {
                                                console.log("ERROR! posting  data!");
                                                console.log(err);
                                                return;
                                            }
                                            console.log("Data posted!");
                                            console.log("\n\n============================================================================");
                                            console.log("============================================================================");
                                            console.log(docs);
                                            console.log("============================================================================");
                                            console.log("============================================================================");
                                            console.log(`Date: ${dateTime}`);
                                            process.exit(0);
                                        });

                                    })
                                    .catch(err => {
                                        console.log("ERROR! Getting data!");
                                        console.log(err);
                                        return;
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                            });


                    })

            })
            .catch(err => {
                if (err) {
                    console.log("Error retrieving Audio! Exiting execution!");
                    console.log("============================================================================");
                    console.log("============================================================================");
                    console.log(err);
                    console.log("============================================================================");
                    console.log("============================================================================");
                    return;
                }
            })
    })
});


// Data.create({
//     list: {
//         download: 22,
//         subscribers: 3,
//         wallpapers: 22,
//         ringtones: 32,
//         presets: 12,
//         apps: 4
//     }
// }, (err, datas) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Done!");
//     }
// });