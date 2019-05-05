const express = require("express"),
    router = express.Router(),
    Subscriber = require("../models/subscribers");

router.get("/blogs", (req, res) => {
    res.redirect("/posts");
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

router.get("/products", (req, res) => {
    res.render("products");
});

router.post("/subscribe", (req, res) => {
    let email = req.body.email;
    email = email.toLowerCase();
    console.log(email);
    if (!email) {
        req.flash("Empty field supplied!");
        res.redirect("back");
    }
    Subscriber.findOne({
            email
        })
        .then((data) => {
            console.log(data);
            if (Boolean(data)) {
                req.flash("error", "Email exists please enter another email");
                res.redirect("/");
                return;
            } else {
                Subscriber.create({
                    email
                }, (err, data) => {
                    if(err){
                        req.flash("error", "There was an error subscribing to the newsletter. Try again!");
                        res.redirect("back");
                    }else{
                        req.flash("success", "Thank you for subscribing to our newsletter!");
                        res.redirect("back");
                    }
                });
            }
        }).catch((err) => {
            console.log(err);
            req.flash("error", "Error with it!");
            res.redirect("/");
        })
});



module.exports = router;