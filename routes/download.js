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
    Data = require("../models/data"),
    deleteFromSystem = require("../imports/deleteFromSystem");


router.get("/contents/:category/:name", (req, res) => {
    let category = req.params.category.toLowerCase();
    let name = req.params.name;

    if (category === "wallpapers") {
        Image.findOne({
            name
        }, (err, image) => {
            if (err || !image) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("/");
            }
            Data.find({}, (err, data) => {
                if (err) {
                    req.flash("error", "Try again later!");
                    return res.redirect("/");
                }
                res.render("item", {
                    file: image,
                    category,
                    moment,
                    title: "Wallpapers | " + image.filename + " download high quality wallpaper for  free. ",
                    keywords: image.filename + ", latest, wallpapers,  apps, android, free, download, gta, san andreas, best, high quality, androcrunch",
                    description: image.description,
                    trending: data[0].list.trending
                });

            });

        });

    } else if (category === "ringtones") {
        Audio.findOne({
            name
        }, (err, audio) => {
            if (err || !audio) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("/");
            }
            Data.find({}, (err, data) => {
                if (err) {
                    req.flash("error", "Try again later!");
                    return res.redirect("/");
                }
                res.render("item", {
                    file: audio,
                    category,
                    moment,
                    title: "Ringtones | " + audio.filename + " High sound quality ringtone for free.",
                    keywords: audio.filename + " | latest, wallpapers, ringtones,  apps, android, free, download, gta, san andreas, androcrunch",
                    description: audio.description,
                    trending: data[0].list.trending
                });

            });
        });

    } else if (category === "presets") {
        Preset.findOne({
            name
        }, (err, preset) => {
            if (err || !preset) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("/");
            }
            Data.find({}, (err, data) => {
                if (err) {
                    req.flash("error", "Try again later!");
                    return res.redirect("/");
                }
                res.render("item", {
                    file: preset,
                    category,
                    moment,
                    title: "Presets | " + preset.filename + " Download lightroom presets and use it to personalize your photo collection",
                    keywords: preset.filename + " | latest, wallpapers,  apps, android, free, download, gta, san andreas, ",
                    description: preset.description,
                    trending: data[0].list.trending
                });

            });
        });

    } else if (category === "apps") {
        App.findOne({
            name
        }, (err, app) => {
            if (err || !app) {
                req.flash("error", "Couldn't find the file.");
                return res.redirect("/");
            }Data.find({}, (err, data) => {
                if (err) {
                    req.flash("error", "Try again later!");
                    return res.redirect("/");
                }
                res.render("item", {
                    file: app,
                    category,
                    moment,
                    title: "Apps and games | " + app.filename + " stock android applications download fo free",
                    keywords: app.filename + " | latest, wallpapers,  apps, android, free, download, gta, san andreas, ",
                    description: app.description,
                    trending: data[0].list.trending
                });

            });
        });

    } else {
        req.flash("error", "Please check your URL and try again.");
        res.redirect("back");
    }

});


router.get("/:category/:name/download", (req, res) => {
    let category = req.params.category.toLowerCase();
    let name = req.params.name.toLowerCase();
    if (typeof req.headers.referer === "undefined") {
        return res.redirect("/" + category);
    }
    Data.find({}, (err, data) => {
        data[0].list.downloads += 1;
        data[0].save();
    });
    if (category === "wallpapers") {
        Image.findOne({
            name
        }, (err, image) => {
            if (err || !image) {
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
        Audio.findOne({
            name
        }, (err, audio) => {
            if (err || !audio) {
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
        Preset.findOne({
            name
        }, (err, preset) => {
            if (err || !preset) {
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
        App.findOne({
            name
        }, (err, app) => {
            if (err || !app) {
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

    } else {
        req.flash("error", "Please check your URL and try again.");
        res.redirect("back");
    }
    // res.download("public/uploads/1557848448142.jpg");
});




module.exports = router;