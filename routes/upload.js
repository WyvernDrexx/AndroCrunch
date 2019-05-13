const router = require("express").Router(),
    moment = require("moment-timezone"),
    isLoggedIn = require("../middlewares/index").isLoggedIn,
    multer      = require("multer"),
    path        = require("path"),
    storage     = multer.diskStorage({
        destination: "./public/uploads",
        filename: (req, file, cb) => {
            cb(null, file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname));
        }
});

const upload = multer({
    storage: storage
}).array("upload", 10);

router.get("/files/upload", isLoggedIn, (req, res) => {
    res.render("upload");
});

router.post("/files/upload", isLoggedIn, (req, res) => {
    upload(req, res, (err) => {
        if(err){
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
        }else{

            // You can use req.file data to upload to DB
            // if(req.file.mimetype.split("/")[0] === "image"){
            //     req.flash("success", "Wallpaper successfully added!");
            // }else if(req.file.mimetype.split("/")[0] === "application"){
            //     req.flash("success", "App successfully added!");
            // }else{
            //     req.flash("success", "File successfully added!");
            // }
            console.log(req.files);
            req.flash("success", "File successfully added! Number of files uploaded: " + req.files.length);
            res.redirect("back");
        }
    });
});


module.exports = router;