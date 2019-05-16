const router = require("express").Router(),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    moment = require("moment"),
    Preset = require("../models/uploadsSchema").Preset;

router.get("/contents/:category", (req, res) => {
    let category = req.params.category.toLowerCase();
    if (category === "apps") {
        App.find({}, (err, apps) => {
            if(err){
                req.flash("error", "Unable to find apps at the moment.");
                return res.redirect("/contents");
            }
            res.render("category", {
                category,
                files: apps
            });
        })

    } else if (category === "wallpapers") {
        Image.find({}, (err, images) => {
            if(err){
                req.flash("error", "Couldn't query the database try again later.");
                return res.redirect("back");
            }
            res.render("category", {
                files: images,
                category
            });
        });

    }else if(category === "ringtones"){
        Audio.find({}, (err, audios) => {
            if(err){
                req.flash("error", "Unable to find ringtones at the moment.");
                return res.redirect("/contents");
            }
            res.render("category", {
                files: audios,
                category
            });
        });
    }
    else if(category === "presets"){
        Preset.find({}, (err, presets) => {
            if(err){
                req.flash("error", "Unable to find ringtones at the moment.");
                return res.redirect("/contents");
            }
            res.render("category", {
                files: presets,
                category
            });
        });
    }
    else {
        req.flash("warning", "Category is under development");
        res.redirect("/contents");
    }
});

router.get("/contents", (req, res) => {
    let files = new Object();
    Image.find({}, (err, images) => {
        if(err){
            req.flash("error", "Unable to find images");
            return res.redirect("/");
        }
        files.images = images;
        Audio.find({}, (err, audios) => {
            if(err){
                req.flash("error", "Unable to find ringtones");
                return res.redirect("/");
            }
            files.audio = audios;
            App.find({}, (err, apps) => {
                if(err){
                    req.flash("error", "Unable to find apps");
                    return res.redirect("/");
                }
                files.apps = apps;
                Preset.find({}, (err, presets) => {
                    if(err){
                        req.flash("error", "Unable to find Presets");
                        return res.redirect("/");
                    }
                    files.presets = presets;
                    res.render("contents", {
                        files
                    });
                });
            });
        });
    });
});

module.exports = router;