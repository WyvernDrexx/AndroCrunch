const express = require("express"),
    router = express.Router(),
    Subscriber = require("../models/subscribers"),
    jquery = require("jquery");

router.get("/kickout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged you out!");
    res.redirect("/");
});

router.get("/blogs", (req, res) => {
    res.render("blogs");
});

router.get("/more", (req, res) => {
    res.render("more-posts");
});

router.get("/item", (req, res) => {
    res.render("item");
});

router.get("/advertisement", (req, res) => {
    res.render("advert");
})

router.get("/privacy_policy", (req, res) => {
    res.render("privacy_policy");
});
router.get("/about_us", (req, res) => {
    res.render("about_us");
});

router.get("/disclaimer", (req, res) => {
    res.render("disclaimer");
});

router.get("/contact", (req, res) => {
    res.render("contact");
});


router.get("/item", (req, res) => {
    res.render("individual");
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