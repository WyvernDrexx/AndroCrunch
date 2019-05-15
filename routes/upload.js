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
    moment = require("moment"),
    deleteFromSystem = require("../imports/deleteFromSystem");

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
            console.log(req.files);
            req.flash("success", "File successfully added! Number of files uploaded: " + req.files.length);
            res.render("upload", { files: req.files });
        }
    });
});

router.post("/files/upload/data", isLoggedIn, (req, res) => {
    // Returned object will have array of titles and description
    let filesData = req.body;
    let message = "All data uploaded successfully!";
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
        console.log(moment());
        console.log(req.user.username);
        if (file.mimetype === "image") {
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

        }
        files.push(images);

        Audio.find({}, (err, audios) => {
            if (err) {

            }

            files.push(audios);

            App.find({}, (err, apps) => {
                if (err) {

                }

                files.push(apps);
                res.render("files", {
                    data: files,
                    moment: moment
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
    }
});

router.post("/files/:mimetype/thumbnail/:id", isLoggedIn, (req, res) => {
    let mimetype = req.params.mimetype;
    let id = req.params.id;
    thumbnail(req, res, (err) => {
        console.log(req.file);
        if (err) {
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
            return;
        } else {
            if(req.file.mimetype.split("/")[0] !== "image"){
                req.flash("error", "Thumbnail must be an image not a " + req.file.mimetype.split("/")[0]);
                res.redirect("/files/list");
                deleteFromSystem("thumbnail", req.file.filename);
                console.log("deleted!");
                return;
            }
            if (mimetype === "image") {
                Image.findOne({ _id: id }, (err, image) => {
                    if(typeof image.thumbnail !== "undefined" && image.thumbnail.length > 0){
                        deleteFromSystem("thumbnail", image.thumbnail);
                    }
                    image.thumbnail = req.file.filename;
                    image.save();
                });
            }
            else if (mimetype === "audio") {
                Audio.findOne({ _id: id }, (err, audio) => {
                    if(typeof audio.thumbnail !== "undefined" && app.thumbnail.length > 0){
                        deleteFromSystem("thumbnail", audio.thumbnail);
                    }
                    audio.thumbnail = req.file.filename;
                    audio.save();
                });
            }
            else if (mimetype === "application") {
                App.findOne({ _id: id }, (err, app) => {
                    if(typeof app.thumbnail !== "undefined" && app.thumbnail.length > 0){
                        deleteFromSystem("thumbnail", app.thumbnail);
                    }
                    app.thumbnail = req.file.filename;
                    app.save();
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
            })
        });
    }
    else if (mimetype === "audio") {
        Audio.findOne({ _id: id }, (err, audio) => {
            res.render("updateFile", {
                file: audio
            })
        });
    }
    else if (mimetype === "application") {
        App.findOne({ _id: id }, (err, app) => {
            res.render("updateFile", {
                file: app
            })
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
            res.redirect("/files/list");
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
            res.redirect("/files/list");
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
            res.redirect("/files/list");
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
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0) {
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
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0) {
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
            if (typeof file.thumbnail !== "undefined" && file.thumbnail.length > 0) {
                deleteFromSystem("thumbnail", file.thumbnail);
            }
            req.flash("success", "File deleted successfully!");
            res.redirect("back");
        });
    }
});


module.exports = router;