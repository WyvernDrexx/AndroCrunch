const express = require("express"),
    router = express.Router(),
    Subscriber = require("../models/subscribers"),
    jquery = require("jquery"),
    Data = require("../models/data");


router.get("/", (req, res) => {
    Data.find({}, (err, data) => {
        if(err){
            console.log("Error getting data:");
            console.log(err);
            res.send("Please contact the Admin now!");
            return;
        }

        res.render("index", {
            title: "AndroCrunch | Beyond The Infinity |  Official Website of AndroCruch Youtube",
            trending: data[0].list.trending
        });
    });
});


router.get("/kickout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged you out!");
    res.redirect("/");
});

router.get("/blogs", (req, res) => {
    res.render("blogs", {
        title: "Latest And Top Blog Posts",
        keywords: "Latest posts, blog posts, tech, technology, products, mi, apple, android",
        description: "Read latest posts on Android, technology, security, Apple and mobile devices"
    });
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
    res.render("about_us", 
    {
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
    let response = new Object();
    response.status = true;
    let email = req.body.email;
    email = email.toLowerCase();
    console.log("email: " + email);
    if (!email) {
        response.status = false;
        response.message = "Field cannot be empty!"
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
                response.message = "You have already subscribed!"
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