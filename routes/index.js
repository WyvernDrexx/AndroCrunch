const express = require("express"),
    router = express.Router(),
    Subscriber = require("../models/subscribers"),
    jquery = require("jquery"),
    Data = require("../models/data"),
    Post = require("../models/post"),
    moment = require("moment-timezone");


router.get("/", (req, res) => {
    Data.find({}, (err, data) => {
        if (err) {
            console.log("Error getting data:");
            console.log(err);
            res.send("Please contact the Admin now!");
            return;
        }
        Post.find({}, (err, posts) => {
            if (err) {
                req.flash("error", "Please check your url and try again!");
                return res.redirect("/blogs");
            }

            let latest = posts.splice(posts.length - 3, posts.length);

            res.render("index", {
                title: "AndroCrunch | Beyond The Infinity |  Official Website of AndroCruch Youtube",
                trending: data[0].list.trending,
                latest,
                moment
            });
        });
    });
});

router.get("/kickout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged you out!");
    res.redirect("/");
});

router.get("/advertisement", (req, res) => {
    res.render("advert", {
        title: "AndroCrunch | Advertisement",
        keywords: "androcrunch, advertisement",
        description: "Advertisement information for AndroCrunch"
    });
});

router.get("/privacy_policy", (req, res) => {
    res.render("privacy_policy", {
        title: "AndroCrunch | Privacy Policy",
        keywords: "androcrunch, privacy policy",
        description: "Privacy Policy of AndroCrunch"
    });
});
router.get("/about_us", (req, res) => {
    res.render("about_us", {
        title: "AndroCrunch | About Us ",
        keywords: "androcrunch, advertisement",
        description: "About Page for AndroCrunch Digital Store"
    });
});

router.get("/disclaimer", (req, res) => {
    res.render("disclaimer");
});

router.get("/contact", (req, res) => {
    res.render("contact", {
        title: "Contact Page | AndroCrunch",
        description: "Contact the developer and site manager from directly here"
    });
});

router.post("/subscribe", (req, res) => {
    let response = {};
    response.status = true;
    let email = String(req.body.email).toLowerCase();
    console.log("email: " + email);
    if (!email) {
        response.status = false;
        response.message = "Field cannot be empty!";
        res.send(response);
        return;
    }

    let flag = true;

    if (!email.includes("@") || email.split("@").length > 2 || email.split(".").length > 2 || email.split(".").length === 1) {
        flag = false;
        response.status = false;
        response.message = "Invalid Input!";
        res.send(response);
        return;
    }

    Subscriber.findOne({
            email
        })
        .then((data) => {
            console.log(data);
            if (Boolean(data)) {
                response.status = false;
                response.message = "You have already subscribed!";
                res.send(response);
                return;
            } else {
                Subscriber.create({
                    email
                }, (err, data) => {
                    if (err) {
                        response.status = false;
                        response.message = "There was an error subscribing to the newsletter. Try again!";
                        res.send(response);
                    } else {
                        Data.find({}, (err, data) => {
                            data[0].list.subscribers += 1;
                            data[0].save();
                        });
                        response.message = "Thank you for subscribing!"
                        res.send(response);
                    }
                });
            }
        }).catch((err) => {
            response.status = false;
            response.message = "Unable to subscribe at the moment! Please try again!";
            res.send(response);
        });
});


module.exports = router;