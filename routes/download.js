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


router.get("/:category/:name", (req, res) => {
    let category = req.params.category.toLowerCase();
    let name = req.params.name;

    if (category === "wallpapers") {
        Image.findOne({ name }, (err, image) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: image,
                category,
                moment,
                title: "Wallpapers | " + image.filename,
                keywords: image.filename + " | latest, wallpapers,  apps, android, free, download, gta, san andreas, ",
                description: image.description
            });
        });

    } else if (category === "ringtones") {
        Audio.findOne({  name }, (err, audio) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: audio,
                category,
                moment,
                title: "Ringtones | " + audio.filename,
                keywords: audio.filename + " | latest, wallpapers, ringtones,  apps, android, free, download, gta, san andreas, ",
                description: audio.description
            });
        });

    } else if (category === "presets") {
        Preset.findOne({  name }, (err, preset) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: preset,
                category,
                moment,
                title:"Presets | " + preset.filename,
                keywords: preset.filename + " | latest, wallpapers,  apps, android, free, download, gta, san andreas, ",
                description: preset.description
            });
        });

    } else if (category === "apps") {
        App.findOne({  name }, (err, app) => {
            if (err) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("back");
            }
            res.render("item", {
                file: app,
                category,
                moment,
                title: "Apps and games | " + app.filename,
                keywords: app.filename + " | latest, wallpapers,  apps, android, free, download, gta, san andreas, ",
                description: app.description
            });
        });

    }else {
        req.flash("error", "Please check your URL and try again. from /cat/name");
        res.redirect("back");
    }

});


router.get("/:category/:name/download", (req, res) => {
    let category = req.params.category.toLowerCase();
    let name = req.params.name.toLowerCase();
    if(typeof req.headers.referer === "undefined"){
        return res.redirect("/" + category);
    }
    if (category === "wallpapers") {
        Image.findOne({  name }, (err, image) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = image.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = image.filename.trim() + "." + ext;
            image.downloads = image.downloads + 1;
            image.save();
            res.download("public/uploads/" + image.referenceFile, filename);
        });

    } else if (category === "ringtones") {
        Audio.findOne({  name }, (err, audio) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = audio.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = audio.filename.trim() + "." + ext;
            audio.downloads = audio.downloads + 1;
            audio.save();
            res.download("public/uploads/" + audio.referenceFile, filename);
        });

    } else if (category === "presets") {
        Preset.findOne({  name }, (err, preset) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = preset.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = preset.filename.trim() + "." + ext;
            preset.downloads = preset.downloads + 1;
            preset.save();
            res.download("public/uploads/" + preset.referenceFile, filename);
        });

    } else if (category === "apps") {
        App.findOne({  name }, (err, app) => {
            if (err) {
                req.flash("error", "Error downloading file!");
                return res.redirect("back");
            }
            var ext = app.referenceFile.split(".");
            ext = ext[ext.length - 1];
            let filename = app.filename.trim() + "." + ext;
            app.downloads = app.downloads + 1;
            app.save();
            res.download("public/uploads/" + app.referenceFile, filename);
        });

    }else {
        req.flash("error", "Please check your URL and try again. from downloads");
        res.redirect("back");
    }
    // res.download("public/uploads/1557848448142.jpg");
});




module.exports = router;