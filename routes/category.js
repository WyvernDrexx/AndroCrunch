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
            if (err) {
                req.flash("error", "Unable to find apps at the moment.");
                return res.redirect("/contents");
            }

            var last = Math.round(apps.length / 4);
            

            res.render("category", {
                category,
                files: apps,
                title: "Latest top and premium apps for free download",
                keywords: "latest, best,  apps, android, free, download, gta, san andreas, ",
                description: "Download latest and top android apps and games for free. 100% working apps.",
                last,
                next: 2,
                current: 1,
                previous: 0

            });
        })

    } else if (category === "wallpapers") {
        Image.find({}, (err, images) => {
            if (err) {
                req.flash("error", "Couldn't query the database try again later.");
                return res.redirect("back");
            }
            var last = Math.round(images.length / 4);
            res.render("category", {
                files: images,
                category,
                title: "HD Wallpapers for desktop and mobile free download",
                keywords: "hd wallpapers, hd, desktop, android, for, download, free",
                description: "Download HD Wallpapers for desktop and mobile for completely free",
                last,
                next: 2,
                current: 1,
                previous: 0

            });
        });

    } else if (category === "ringtones") {
        Audio.find({}, (err, audios) => {
            if (err) {
                req.flash("error", "Unable to find ringtones at the moment.");
                return res.redirect("/contents");
            }
            var last = Math.round(audios.length / 4);
            res.render("category", {
                files: audios,
                category,
                title: "Best Ringtones for Free Download",
                keywords: "rington, ringtones, free download, 2018, 2019, avengers, mp3, midi",
                description: "Download Latest and high quality ringtones for free.",
                last,
                next: 2,
                current: 1,
                previous: 0

            });
        });
    }
    else if (category === "presets") {
        Preset.find({}, (err, presets) => {
            if (err) {
                req.flash("error", "Unable to find ringtones at the moment.");
                return res.redirect("/contents");
            }
            var last = Math.round(presets.length / 4);
            res.render("category", {
                files: presets,
                category,
                title: "Latest beautiful presets",
                keywords: "presets, photoshop, lightroom, free, premium, download, zip",
                description: "Download best presets for free",
                last,
                next: 2,
                current: 1,
                previous: 0

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
        if (err) {
            req.flash("error", "Unable to find images");
            return res.redirect("/");
        }
        files.images = images;
        Audio.find({}, (err, audios) => {
            if (err) {
                req.flash("error", "Unable to find ringtones");
                return res.redirect("/");
            }
            files.audio = audios;
            App.find({}, (err, apps) => {
                if (err) {
                    req.flash("error", "Unable to find apps");
                    return res.redirect("/");
                }
                files.apps = apps;
                Preset.find({}, (err, presets) => {
                    if (err) {
                        req.flash("error", "Unable to find Presets");
                        return res.redirect("/");
                    }
                    files.presets = presets;
                    res.render("contents", {
                        files,
                        title: "Wallpapers, ringtones, presets, apps, games for free download",
                        keywords: "wallpapers, ringtones, apps, games, android, free, download",
                        description: "Latest apps, games, wallpapers, ringtones and presets for free download."
                    });
                });
            });
        });
    });
});


router.get("/contents/:category/page/:page", (req, res) => {

    let category = req.params.category.toLowerCase();
    console.log(typeof category);
    console.log(category !== "wallpapers")
    console.log(category);
    let pagenumber = Math.floor(Number(req.params.page));

    if( category !== "wallpapers" && category !== "ringtones" && category !== "apps" && category !== "presets" ){
        req.flash("error", "No [" + category + "] category found!");
        res.redirect("/contents");
        console.log("httt");
        return;
    }
    if(typeof pagenumber !== "number"){
        req.flash("error", "Page number invalid!");
        res.redirect("back");
        return;
    }

    if(category === "wallpapers"){
        Image.find({}, (err, images) => {
            if(err){
                req.flash("error", "Error! Try again!");
                res.redirect("/");
                return;
            }

            let totalPages = Math.round(images.length/4);
            let start = (pagenumber - 1) * 4;
            let end = pagenumber * 4;
            if(end > images.length){
                res.redirect("/contents");
                return;
            }
            
            let extractedImages = images.slice(start, end);
            res.render("category", {
                files: extractedImages,
                title: "Wallpapers, ringtones, presets, apps, games for free download",
                keywords: "wallpapers, ringtones, apps, games, android, free, download",
                description: "Latest apps, games, wallpapers, ringtones and presets for free download.",
                last: totalPages - 1,
                next: pagenumber + 1,
                current: pagenumber,
                previous: pagenumber - 1,
                category
            });
        });
    }


});


module.exports = router;