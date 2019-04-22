const express = require("express"),
    router = express.Router();

router.get("/blogs", (req, res) => {

    res.send("Blogs");
});

router.get("/products", (req, res) => {
    res.render("products");
});


module.exports = router;