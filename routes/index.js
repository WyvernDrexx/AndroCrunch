const express = require("express"),
    router = express.Router();

router.get("/blogs", (req, res) => {

    res.send("Blogs");
});

router.get("/item", (req, res) => {
    res.render("item");
});


router.get("/about_us", (req, res) => {
    res.render("about_us");
});

router.get("/products", (req, res) => {
    res.render("products");
});


module.exports = router;