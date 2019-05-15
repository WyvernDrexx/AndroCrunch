const router = require("express").Router(),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App,
    moment = require("moment");

router.get("/contents/:category", (req, res) => {
    let category = req.params.category.toLowerCase();
    if (category === "ringtones" || category === "plugins" || category === "presets") {
        res.render("category", {
            category,
            files: [1,2,222,2,2,2,2,2,2,2,2,2,2]
        });

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
        req.flash("error", "Category doesn't exist!");
        res.redirect("/contents");
    }
});

module.exports = router;