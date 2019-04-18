const express = require("express"),
    router = express.Router();

router.get("/blogs", (req, res) => {

    res.send("Blogs");
});

router.get("/test", (req, res) => {
    res.render("particles");
});


module.exports = router;