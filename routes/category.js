const router = require("express").Router(),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    moment = require("moment");

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
        App.find({}, (err, apps) => {
            if(err){
                req.flash("error", "Unable to find apps");
                return res.redirect("/");
            }
            files.apps = apps;
            res.render("contents", {
                files
            });
        })
    });
});

module.exports = router;