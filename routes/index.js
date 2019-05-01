const express = require("express"),
    router = express.Router();

router.get("/blogs", (req, res) => {
    res.render("blogs");
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


module.exports = router;