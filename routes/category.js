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
            apps = apps.reverse();
            var last = apps.length / 12;

            if (last > Math.floor(last)) {
                last = Math.floor(last) + 1;
            } else {
                last = Math.floor(last);
            }

            res.render("category", {
                category,
                files: apps.slice(0,12),
                title: "Android Apps | Latest top and premium apps for free download",
                keywords: "latest, best,  apps, android, free, download, gta, san andreas, ",
                description: "Download latest and top android apps and games for free. 100% working apps. We have various categories of apps. From utilities to productivity and beautification apps",
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
            images = images.reverse();
            var last = images.length / 12;

            if (last > Math.floor(last)) {
                last = Math.floor(last) + 1;
            } else {
                last = Math.floor(last);
            }

            res.render("category", {
                files: images.slice(0,12),
                category,
                title: "Wallpapers | HD Wallpapers for desktop and mobile free download",
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
            audios = audios.reverse();
            var last = audios.length / 12;

            if (last > Math.floor(last)) {
                last = Math.floor(last) + 1;
            } else {
                last = Math.floor(last);
            }
            res.render("category", {
                files: audios.slice(0, 12),
                category,
                title: "Ringtones | Best Ringtones for Free Download",
                keywords: "rington, ringtones, free download, 2018, 2019, avengers, mp3, midi",
                description: "Download Latest and high quality ringtones for free.",
                last,
                next: 2,
                current: 1,
                previous: 0

            });
        });
    } else if (category === "presets") {
        Preset.find({}, (err, presets) => {
            if (err) {
                req.flash("error", "Unable to find ringtones at the moment.");
                return res.redirect("/contents");
            }
            presets = presets.reverse();
            var last = presets.length / 12;

            if (last > Math.floor(last)) {
                last = Math.floor(last) + 1;
            } else {
                last = Math.floor(last);
            }

            res.render("category", {
                files: presets.slice(0, 12),
                category,
                title: "Presets | Latest beautiful lightroom presets",
                keywords: "presets, photoshop, lightroom, free, premium, download, zip",
                description: "Download best presets for free",
                last,
                next: 2,
                current: 1,
                previous: 0

            });
        });
    } else {
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
    console.log(category !== "wallpapers");
    console.log(category);
    let pagenumber = Math.floor(Number(req.params.page));

    if (category !== "wallpapers" && category !== "ringtones" && category !== "apps" && category !== "presets") {
        req.flash("error", "No [" + category + "] category found!");
        res.redirect("/contents");
        return;
    }
    if (typeof pagenumber !== "number") {
        req.flash("error", "Page number invalid!");
        res.redirect("back");
        return;
    }

    if (category === "wallpapers") {
        Image.find({}, (err, images) => {
            if (err) {
                req.flash("error", "Error! Try again!");
                res.redirect("/");
                return;
            }
            images = images.reverse();
            var totalPages = images.length / 12;

            if (totalPages > Math.floor(totalPages)) {
                totalPages = Math.floor(totalPages) + 1;
            } else {
                totalPages = Math.floor(totalPages);
            }
            console.log("totalpages: " + totalPages);
            let start = (pagenumber - 1) * 12;
            let end = pagenumber * 12;
            console.log("END: " + end);
            console.log("length : " + images.length);
            if (end - images.length > 12) {
                req.flash("error", "No page number " + pagenumber + " found!");
                res.redirect("/contents");
                return;
            }else{
                if(totalPages === pagenumber){
                    end = images.length;
                }
            }

            console.log("totalpages: " + totalPages);
            console.log("pagenumber: " + pagenumber);
            let extractedImages = images.slice(start, end);
            res.render("category", {
                files: extractedImages,
                title: "Wallpapers, ringtones, presets, apps, games for free download",
                keywords: "wallpapers, ringtones, apps, games, android, free, download",
                description: "Latest apps, games, wallpapers, ringtones and presets for free download.",
                last: totalPages,
                next: pagenumber + 1,
                current: pagenumber,
                previous: pagenumber - 1,
                category
            });
        });
    } else if (category === "apps") {
        App.find({}, (err, apps) => {
            if (err) {
                req.flash("error", "Error! Try again!");
                res.redirect("/");
                return;
            }
            apps = apps.reverse();
            var totalPages = apps.length / 12;

            if (totalPages > Math.floor(totalPages)) {
                totalPages = Math.floor(totalPages) + 1;
            } else {
                totalPages = Math.floor(totalPages);
            }
            console.log("totalpages: " + totalPages);
            let start = (pagenumber - 1) * 12;
            let end = pagenumber * 12;
            console.log("END: " + end);
            console.log("length : " + apps.length);
            if (end - apps.length > 12) {
                req.flash("error", "No page number " + pagenumber + " found!");
                res.redirect("/contents");
                return;
            }else{
                if(totalPages === pagenumber){
                    end = apps.length;
                }
            }

            console.log("totalpages: " + totalPages);
            console.log("pagenumber: " + pagenumber);
            // console.log("totalpages: " + totalPages);
            // console.log("totalpages: " + totalPages);
            let extractedApps = apps.slice(start, end);
            res.render("category", {
                files: extractedApps,
                title: "Wallpapers, ringtones, presets, apps, games for free download",
                keywords: "wallpapers, ringtones, apps, games, android, free, download",
                description: "Latest apps, games, wallpapers, ringtones and presets for free download.",
                last: totalPages,
                next: pagenumber + 1,
                current: pagenumber,
                previous: pagenumber - 1,
                category
            });
        });
    } else if (category === "ringtones") {
        Audio.find({}, (err, audios) => {
            if (err) {
                req.flash("error", "Error! Try again!");
                res.redirect("/");
                return;
            }
            audios = audios.reverse();
            var totalPages = audios.length / 12;

            if (totalPages > Math.floor(totalPages)) {
                totalPages = Math.floor(totalPages) + 1;
            } else {
                totalPages = Math.floor(totalPages);
            }
            console.log("totalpages: " + totalPages);
            let start = (pagenumber - 1) * 12;
            let end = pagenumber * 12;
            console.log("END: " + end);
            console.log("length : " + audios.length);

            if (end - audios.length > 12) {
                req.flash("error", "No page number " + pagenumber + " found!");
                res.redirect("/contents");
                return;
            }else{
                if(totalPages === pagenumber){
                    end = audios.length;
                }
            }

            let extractedAudios = audios.slice(start, end);
            res.render("category", {
                files: extractedAudios,
                title: "Wallpapers, ringtones, presets, apps, games for free download",
                keywords: "wallpapers, ringtones, apps, games, android, free, download",
                description: "Latest apps, games, wallpapers, ringtones and presets for free download.",
                last: totalPages,
                next: pagenumber + 1,
                current: pagenumber,
                previous: pagenumber - 1,
                category
            });
        });
    } else if (category === "presets") {
        Preset.find({}, (err, presets) => {
            if (err) {
                req.flash("error", "Error! Try again!");
                res.redirect("/");
                return;
            }
            presets = presets.reverse();
            var totalPages = presets.length / 12;

            if (totalPages > Math.floor(totalPages)) {
                totalPages = Math.floor(totalPages) + 1;
            } else {
                totalPages = Math.floor(totalPages);
            }
            console.log("totalpages: " + totalPages);
            let start = (pagenumber - 1) * 12;
            let end = pagenumber * 12;
            console.log("END: " + end);
            console.log("length : " + presets.length);

            if (end - presets.length > 12) {
                req.flash("error", "No page number " + pagenumber + " found!");
                res.redirect("/contents");
                return;
            }else{
                if(totalPages === pagenumber){
                    end = presets.length;
                }
            }


            let extractedPresets = presets.slice(start, end);
            res.render("category", {
                files: extractedPresets,
                title: "Wallpapers, ringtones, presets, apps, games for free download",
                keywords: "wallpapers, ringtones, apps, games, android, free, download",
                description: "Latest apps, games, wallpapers, ringtones and presets for free download.",
                last: totalPages,
                next: pagenumber + 1,
                current: pagenumber,
                previous: pagenumber - 1,
                category
            });
        });
    } else {
        res.redirect("/contents");
        return;
    }


});


module.exports = router;