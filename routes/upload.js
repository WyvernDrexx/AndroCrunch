const router = require("express").Router(),
    isLoggedIn = require("../middlewares/index").isLoggedIn,
    multer = require("multer"),
    path = require("path"),
    storage = multer.diskStorage({
        destination: "./public/uploads",
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    thumbnailStorage = multer.diskStorage({
        destination: "./public/thumbnails",
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    Preset = require("../models/uploadsSchema").Preset,
    moment = require("moment"),
    deleteFromSystem = require("../imports/deleteFromSystem"),
    fs = require("fs"),
    sharp = require("sharp");

const upload = multer({
    storage: storage
}).array("upload", 10);

const thumbnail = multer({
    storage: thumbnailStorage
}).single("thumbnail");


router.get("/files/upload", isLoggedIn, (req, res) => {
    res.render("upload");
});

router.post("/files/upload", isLoggedIn, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
        } else {
            req.flash("success", "File successfully added! Number of files uploaded: " + req.files.length);
            res.render("upload", { files: req.files });
        }
    });
});

router.post("/files/upload/data", isLoggedIn, (req, res) => {
    // Returned object will have array of titles and description
    let filesData = req.body;
    let message = "All data uploaded successfully!";

    // This code is vulnerable not CRITICAL but problematic to debug if unhandeled>> The hidden input fields on upload.ejs allow the sizes, mimetype
    // referenceFile and size to be modified..

    for (let i = 0; i < filesData.title.length; i++) {
        var file = {
            filename: filesData.title[i],
            mimetype: filesData.mimetype[i].split("/")[0],
            size: filesData.size[i],
            referenceFile: filesData.referenceFile[i],
            description: filesData.description[i].trim(),
            uploader: req.user.username,
            created: moment()
        }
        file.name = file.filename.trim().split(" ").join("-").toLowerCase();
        if (filesData.mimetype[i].split("/")[1] === "zip") {
            file.mimetype = "zip";
        }
        if (file.mimetype === "image") {
            let inStream = fs.createReadStream('./public/uploads/' + file.referenceFile);

            // output stream
            let outStream = fs.createWriteStream('./public/thumbnails/' + file.referenceFile.split(".")[0] + ".jpeg", { flags: "w" });

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
            let transform = sharp()
                .jpeg()
                .resize({ width: 142, height: 196 })
                .on('info', function (fileInfo) {
                    console.log("Resizing done, file not saved");
                });

            inStream.pipe(transform).pipe(outStream);


            // Medium size thumbnail

            // output stream
            outStream = fs.createWriteStream('./public/thumbnails/med-' + file.referenceFile.split(".")[0] + ".jpeg", { flags: "w" });
            inStream = fs.createReadStream('./public/uploads/' + file.referenceFile);

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
                .resize({ width: 288, height: 224 })
                .on('info', function (fileInfo) {
                    console.log("Resizing done, file not saved");
                });

            inStream.pipe(transform).pipe(outStream);

            file.thumbnail = file.referenceFile.split(".")[0] + ".jpeg";



            // Large image
            // output stream
            outStream = fs.createWriteStream('./public/thumbnails/lg-' + file.referenceFile.split(".")[0] + ".jpeg", { flags: "w" });
            inStream = fs.createReadStream('./public/uploads/' + file.referenceFile);

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
                .resize({ width: 546, height: 320 })
                .on('info', function (fileInfo) {
                    console.log("Resizing done, file not saved");
                });

            inStream.pipe(transform).pipe(outStream);


            Image.create(file, (err, returnedData) => {
                if (err) {
                    message = message + err;
                } else {
                    message = message + "File [" + returnedData.filename + "] successfully added to database! \n";
                }
            });

        } else if (file.mimetype === "audio") {
            Audio.create(file, (err, returnedData) => {
                if (err) {
                    message = message.concat(err);
                } else {
                    message = message.concat("File [" + returnedData.filename + "] successfully added to database!");
                }
            });

        } else if (file.mimetype === "application") {
            App.create(file, (err, returnedData) => {
                if (err) {
                    message = message + err;
                } else {
                    message = message.concat("File [" + returnedData.filename + "] successfully added to database!");
                }
            });

        } else if (file.mimetype === "zip") {
            Preset.create(file, (err, returnedData) => {
                if (err) {
                    console.log(err);
                } else {
                    return;
                }
            });
        } else {
            message = message.concat("File [" + file.filename + "] couldnt be added to database!");
        }
    }

    req.flash("success", message);
    res.redirect("/files/list");
});


router.get("/files/list", isLoggedIn, (req, res) => {
    var files = [];
    Image.find({}, (err, images) => {
        if (err) {
            req.flash("error", "Error retrieving lists of [images]");
            return res.redirect("/author/panel");
        }
        files.push(images);

        Audio.find({}, (err, audios) => {
            if (err) {
                req.flash("error", "Error retrieving lists of [audio]");
                return res.redirect("/author/panel");
            }

            files.push(audios);

            App.find({}, (err, apps) => {
                if (err) {
                    req.flash("error", "Error retrieving lists of [apps]");
                    return res.redirect("/author/panel");
                }
                files.push(apps);

                Preset.find({}, (err, presets) => {
                    if (err) {
                        req.flash("error", "Error retrieving lists of [presets]");
                        return res.redirect("/author/panel");
                    }
                    files.push(presets);

                    res.render("files", {
                        data: files,
                        moment: moment
                    });

                });

            });

        });

    });

});


router.get("/files/:mimetype/thumbnail/:id", isLoggedIn, (req, res) => {
    let mimetype = req.params.mimetype;
    let id = req.params.id;
    if (mimetype === "image") {
        Image.findOne({ _id: id }, (err, image) => {
            if (err) {
                req.flash("error", "Couldn't find the file!");
                res.redirect("/author/panel");
                return;
            }
            res.render("thumbnail", {
                file: image,
                moment
            });
        });
    }
    else if (mimetype === "audio") {
        Audio.findOne({ _id: id }, (err, audio) => {
            if (err) {
                req.flash("error", "Couldn't find the file!");
                res.redirect("/author/panel");
                return;
            }
            res.render("thumbnail", {
                file: audio,
                moment
            });
        });
    }
    else if (mimetype === "application") {
        App.findOne({ _id: id }, (err, app) => {
            if (err) {
                req.flash("error", "Couldn't find the file!");
                res.redirect("/author/panel");
                return;
            }
            res.render("thumbnail", {
                file: app,
                moment
            });
        });
    } else if (mimetype === "zip") {
        Preset.findOne({ _id: id }, (err, preset) => {
            if (err) {
                req.flash("error", "Couldn't find the file!");
                res.redirect("/author/panel");
                return;
            }
            res.render("thumbnail", {
                file: preset,
                moment
            });
        });
    } else {
        req.flash("warning", "Category is not present.");
        res.redirect("/author/panel");
    }
});

router.post("/files/:mimetype/thumbnail/:id", isLoggedIn, (req, res) => {
    let mimetype = req.params.mimetype;
    let id = req.params.id;

    thumbnail(req, res, (err) => {

        if(req.file.mimetype.split("/")[0] !== "image"){
            req.flash("error","Image format unsupported: " + req.file.mimetype);
            res.redirect("back");
            deleteFromSystem("thumbnail", req.file.filename);
            return;
        }
        console.log(req.file);
        var actualfile = req.file.filename;
        if (mimetype === "application") {
            let inStream = fs.createReadStream('./public/thumbnails/' + req.file.filename);

            // output stream
            let outStream = fs.createWriteStream('./public/thumbnails/' + req.file.filename.split(".")[0] + ".jpeg", { flags: "w" });

            // on error of output file being saved
            outStream.on('error', function () {
                console.log("Error");
            });

            // on success of output file being saved
            outStream.on('close', function () {
                console.log("Successfully saved file");
            });
            req.file.filename = req.file.filename.split(".")[0] + ".jpeg";
            // input stream transformer
            // "info" event will be emitted on resize
            let transform = sharp()
                .jpeg()
                .resize({ width: 128, height: 128 })
                .on('info', function (fileInfo) {
                    console.log("Resizing done, file not saved");
                });

            inStream.pipe(transform).pipe(outStream);
        } else {
            let inStream = fs.createReadStream('./public/thumbnails/' + req.file.filename);

            // output stream
            let outStream = fs.createWriteStream('./public/thumbnails/' + req.file.filename.split(".")[0] + ".jpeg", { flags: "w" });

            // on error of output file being saved
            outStream.on('error', function () {
                console.log("Error");
            });

            // on success of output file being saved
            outStream.on('close', function () {
                console.log("Successfully saved file");
            });
            req.file.filename = req.file.filename.split(".")[0] + ".jpeg";
            // input stream transformer
            // "info" event will be emitted on resize
            console.log(req.file);
            let transform = sharp()
                .jpeg()
                .resize({ width: 142, height: 96 })
                .on('info', function (fileInfo) {
                    console.log("Resizing done, file not saved");
                });

            inStream.pipe(transform).pipe(outStream);
        }


        // // Medium size thumbnail

        // // output stream
        // let outStream = fs.createWriteStream('./public/thumbnails/med-' + req.file.filename.split(".")[0] + ".jpeg", { flags: "w" });
        // let inStream = fs.createReadStream('./public/thumbnails/' + req.file.filename);

        // // on error of output file being saved
        // outStream.on('error', function () {
        //     console.log("Error");
        // });

        // // on success of output file being saved
        // outStream.on('close', function () {
        //     console.log("Successfully saved file");
        // });
        // // input stream transformer
        // // "info" event will be emitted on resize
        // let transform = sharp()
        //     .jpeg()
        //     .resize({ width: 288, height: 224 })
        //     .on('info', function (fileInfo) {
        //         console.log("Med size Resizing done, file not saved");
        //     });

        // inStream.pipe(transform).pipe(outStream);


        // // Large size thumbnail
        // // output stream
        // outStream = fs.createWriteStream('./public/thumbnails/lg-' + req.file.filename.split(".")[0] + ".jpeg", { flags: "w" });
        // inStream = fs.createReadStream('./public/thumbnails/' + req.file.filename);

        // // on error of output file being saved
        // outStream.on('error', function () {
        //     console.log("Error");
        // });

        // // on success of output file being saved
        // outStream.on('close', function () {
        //     console.log("Successfully saved file");
        // });
        // // input stream transformer
        // // "info" event will be emitted on resize
        // transform = sharp()
        //     .jpeg()
        //     .resize({ width: 546, height: 320 })
        //     .on('info', function (fileInfo) {
        //         console.log("Large size Resizing done, file not saved");
        //     });

        // inStream.pipe(transform).pipe(outStream);



        // deleteFromSystem("thumbnail", actualfile);


        if (err) {
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
            return;
        } else {
            if (mimetype === "image") {
                Image.findOne({ _id: id }, (err, image) => {
                    if (typeof image.thumbnail !== "undefined" && image.thumbnail.length > 0 && image.thumbnail !== "default.jpg") {
                        deleteFromSystem("thumbnail", image.thumbnail);
                    }
                    image.thumbnail = req.file.filename;
                    image.save();
                });
            }
            else if (mimetype === "audio") {
                Audio.findOne({ _id: id }, (err, audio) => {
                    if (typeof audio.thumbnail !== "undefined" && audio.thumbnail.length > 0 && audio.thumbnail !== "default.jpg") {
                        deleteFromSystem("thumbnail", audio.thumbnail);
                    }
                    audio.thumbnail = req.file.filename;
                    audio.save();
                });
            }
            else if (mimetype === "application") {
                App.findOne({ _id: id }, (err, app) => {
                    if (typeof app.thumbnail !== "undefined" && app.thumbnail.length > 0 && app.thumbnail !== "default.jpg") {
                        deleteFromSystem("thumbnail", app.thumbnail);
                    }
                    app.thumbnail = req.file.filename;
                    app.save();
                });
            } else if (mimetype === "zip") {
                Preset.findOne({ _id: id }, (err, preset) => {
                    if (typeof preset.thumbnail !== "undefined" && preset.thumbnail.length > 0 && preset.thumbnail !== "default.jpg") {
                        deleteFromSystem("thumbnail", preset.thumbnail);
                    }
                    preset.thumbnail = req.file.filename;
                    preset.save();
                });
            }
        }
        req.flash("success", "Thumbnail Uploaded!");
        res.redirect("/files/list");
    });

});

router.get("/files/:mimetype/:id/edit", isLoggedIn, (req, res) => {
    let mimetype = req.params.mimetype;
    let id = req.params.id;
    if (mimetype === "image") {
        Image.findOne({ _id: id }, (err, image) => {
            res.render("updateFile", {
                file: image
            });
        });
    }
    else if (mimetype === "audio") {
        Audio.findOne({ _id: id }, (err, audio) => {
            res.render("updateFile", {
                file: audio
            });
        });
    }
    else if (mimetype === "application") {
        App.findOne({ _id: id }, (err, app) => {
            res.render("updateFile", {
                file: app
            });
        });
    } else if (mimetype === "zip") {
        Preset.findOne({ _id: id }, (err, preset) => {
            res.render("updateFile", {
                file: preset
            });
        });
    }
});


router.put("/files/:mimetype/:id/edit", isLoggedIn, (req, res) => {
    let mimetype = req.params.mimetype;
    let id = req.params.id;
    if (mimetype === "image") {
        Image.findOneAndUpdate({ _id: id }, {
            filename: req.body.filename,
            description: req.body.description
        }, (err, image) => {
            if (err) {
                req.flash("error", "We couldn't update to the database! Try again or contact admin.")
                res.redirect("back");
                return;
            }
            req.flash("success", "File <strong>" + image.filename + "</strong> updated successfully!");
            res.redirect("back");
        });
    }
    else if (mimetype === "audio") {
        Audio.findOneAndUpdate({ _id: id }, {
            filename: req.body.filename,
            description: req.body.description
        }, (err, audio) => {
            if (err) {
                req.flash("error", "We couldn't update to the database! Try again or contact admin.")
                res.redirect("back");
                return;
            }
            req.flash("success", "File <strong>" + audio.filename + "</strong> updated successfully!");
            res.redirect("back");
        });
    }
    else if (mimetype === "application") {
        App.findOneAndUpdate({ _id: id }, {
            filename: req.body.filename,
            description: req.body.description
        }, (err, app) => {
            if (err) {
                req.flash("error", "We couldn't update to the database! Try again or contact admin.")
                res.redirect("back");
                return;
            }
            req.flash("success", "File <strong>" + app.filename + "</strong> updated successfully!");
            res.redirect("back");
        });
    } else if (mimetype === "zip") {
        Preset.findOneAndUpdate({ _id: id }, {
            filename: req.body.filename,
            description: req.body.description
        }, (err, preset) => {
            if (err) {
                req.flash("error", "We couldn't update to the database! Try again or contact admin.")
                res.redirect("back");
                return;
            }
            req.flash("success", "File <strong>" + preset.filename + "</strong> updated successfully!");
            res.redirect("back");
        });
    }
});


router.delete("/files/:mimetype/:id", isLoggedIn, (req, res) => {
    let mimetype = req.params.mimetype;
    let id = req.params.id;
    if (mimetype === "image") {
        Image.findOneAndDelete({
            _id: id
        }, (err, file) => {
            if (err) {
                req.flash("error", "Unable to find the file");
                res.redirect("back");
                return;
            }
            deleteFromSystem("upload", file.referenceFile);
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0 && file.thumbnail !== "default.jpg") {
                deleteFromSystem("thumbnail", file.thumbnail);
            }
            req.flash("success", "File deleted successfully!");
            res.redirect("back");
        });
    }
    else if (mimetype === "audio") {
        Audio.findOneAndDelete({
            _id: id
        }, (err, file) => {
            if (err) {
                req.flash("error", "Unable to find the file");
                res.redirect("back");
                return;
            }
            deleteFromSystem("upload", file.referenceFile);
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0 && file.thumbnail !== "default.jpg") {
                deleteFromSystem("thumbnail", file.thumbnail);
            }
            req.flash("success", "File deleted successfully!");
            res.redirect("back");
        });
    }
    else if (mimetype === "application") {
        App.findOneAndDelete({
            _id: id
        }, (err, file) => {
            if (err) {
                req.flash("error", "Unable to find the file");
                res.redirect("back");
                return;
            }
            deleteFromSystem("upload", file.referenceFile);
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0 && file.thumbnail !== "default.jpg") {
                deleteFromSystem("thumbnail", file.thumbnail);
            }
            req.flash("success", "File deleted successfully!");
            res.redirect("back");
        });
    }
    else if (mimetype === "zip") {
        Preset.findOneAndDelete({
            _id: id
        }, (err, file) => {
            if (err) {
                req.flash("error", "Unable to find the file");
                res.redirect("back");
                return;
            }
            deleteFromSystem("upload", file.referenceFile);
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0 && file.thumbnail !== "default.jpg") {
                deleteFromSystem("thumbnail", file.thumbnail);
            }
            req.flash("success", "File deleted successfully!");
            res.redirect("back");
        });
    } else {
        req.flash("error", "Category invalid!");
        res.redirect("back");
    }
});


router.get("/files/list/:category", isLoggedIn, (req, res) => {
    let category = req.params.category.toLowerCase();
    if (category === "images") {
        Image.find({}, (err, images) => {
            if (err) {
                req.flash("error", "Unable to retrieve images from Database. Contact admin ASAP!");
                return res.redirect("/author/panel");
            }
            res.render("filesSection", {
                files: images,
                category,
                moment
            });
        });
    }
    else if (category === "audio") {
        Audio.find({}, (err, audio) => {
            if (err) {
                req.flash("error", "Unable to retrieve Audios from Database. Contact admin ASAP!");
                return res.redirect("/author/panel");
            }
            res.render("filesSection", {
                files: audio,
                category,
                moment
            });
        });
    }

    else if (category === "apps") {
        App.find({}, (err, apps) => {
            if (err) {
                req.flash("error", "Unable to retrieve Apps from Database. Contact admin ASAP!");
                return res.redirect("/author/panel");
            }
            res.render("filesSection", {
                files: apps,
                category,
                moment
            });
        });
    }
    else if (category === "presets") {
        Preset.find({}, (err, presets) => {
            if (err) {
                req.flash("error", "Unable to retrieve Presets from Database. Contact admin ASAP!");
                return res.redirect("/author/panel");
            }
            res.render("filesSection", {
                files: presets,
                category,
                moment
            });
        });

    } else {
        req.flash("error", "Category not found!");
        res.redirect("back");
    }
});

module.exports = router;