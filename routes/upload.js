const router = require("express").Router(),
    isLoggedIn = require("../middlewares/index").isLoggedIn,
    multer = require("multer"),
    path = require("path"),
    storage = multer.diskStorage({
        destination: "./public/uploads",
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    Image = require("../models/uploadsSchema").Image,
    Audio = require("../models/uploadsSchema").Audio,
    App = require("../models/uploadsSchema").App;

const upload = multer({
    storage: storage
}).array("upload", 10);

router.get("/files/upload", isLoggedIn, (req, res) => {
    res.render("upload");
});

router.post("/files/upload", isLoggedIn, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
        } else {
            req.flash("success", "File successfully added! Number of files uploaded: " + req.files.length);
            res.render("upload", { files: req.files });
        }
    });
});

router.post("/files/upload/data", isLoggedIn, (req, res) => {
    // Returned object will have array of titles and description
    let filesData = req.body;
    let message = "All data uploaded!";
    for (let i = 0; i < filesData.title.length; i++) {
        var file = {
            filename: filesData.title[i],
            mimetype: filesData.mimetype[i].split("/")[0],
            size: filesData.size[i],
            referenceFile: filesData.referenceFile[i],
            description: filesData.description[i].trim()
        }
        if (file.mimetype === "image") {
            Image.create(file, (err, returnedData) => {
                if (err) {
                    message = message + err;
                } else {
                    message = message + "File [" + returnedData.filename + "] successfully added to database! \n";
                }
            });
        } else if (file.mimetype === "audio") {
            Audio.create(file, (err, returnedData) => {
                if (err) {
                    message = message.concat(err);
                } else {
                    message = message.concat("File [" + returnedData.filename + "] successfully added to database!");
                }
            });
        } else if (file.mimetype === "aappliction") {
            App.create(file, (err, returnedData) => {
                if (err) {
                    message = message + err;
                } else {
                    message = message.concat("File [" + returnedData.filename + "] successfully added to database!");
                }
            });
        } else {
            message = message.concat("File [" + file.filename + "] couldnt be added to database!");
        }
    }
    req.flash("success", message);
    res.redirect("/files/upload");
});

module.exports = router;