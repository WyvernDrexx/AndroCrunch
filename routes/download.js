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
    deleteFromSystem = require("../imports/deleteFromSystem");





router.get("/:category/:id", (req, res) => {
    let category = req.params.category.toLowerCase();
    let id = req.params.id;

    if (category === "wallpapers") {
        Image.findOne({ _id: id }, (err, image) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: image,
                category,
                moment
            });
        });

    } else if (category === "ringtones") {
        Audio.findOne({ _id: id }, (err, audio) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: audio,
                category,
                moment
            });
        });

    } else if (category === "presets") {
        Preset.findOne({ _id: id }, (err, preset) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: preset,
                category,
                moment
            });
        });

    } else if (category === "apps") {
        App.findOne({ _id: id }, (err, app) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: app,
                category,
                moment
            });
        });

    }else {
        req.flash("error", "Please check your URL and try again.");
        res.redirect("back");
    }

});


router.get("/:category/:id/download", (req, res) => {
    let category = req.params.category.toLowerCase();
    let id = req.params.id;
    console.log("Headers:");
    console.log(req.headers);
    if (category === "wallpapers") {
        Image.findOne({ _id: id }, (err, image) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = image.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = image.filename.trim() + "." + ext;
            res.download("public/uploads/" + image.referenceFile, filename);
        });

    } else if (category === "ringtones") {
        Audio.findOne({ _id: id }, (err, audio) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = audio.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = audio.filename.trim() + "." + ext;
            res.download("public/uploads/" + audio.referenceFile, filename);
        });

    } else if (category === "presets") {
        Preset.findOne({ _id: id }, (err, preset) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = preset.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = preset.filename.trim() + "." + ext;
            res.download("public/uploads/" + preset.referenceFile, filename);
        });

    } else if (category === "apps") {
        App.findOne({ _id: id }, (err, app) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = app.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = app.filename.trim() + "." + ext;
            res.download("public/uploads/" + app.referenceFile, filename);
        });

    }else {
        req.flash("error", "Please check your URL and try again.");
        res.redirect("back");
    }
    // res.download("public/uploads/1557848448142.jpg");
});




module.exports = router;