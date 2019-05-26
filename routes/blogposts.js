const Post = require("../models/post"),        //Posts model
    router = require("express").Router(),
    moment = require("moment-timezone"),
    isLoggedIn = require("../middlewares/index").isLoggedIn,
    multer = require("multer"),
    path = require("path"),
    deleteFromSystem = require("../imports/deleteFromSystem");


const thumbnailStorage = multer.diskStorage({
    destination: "./public/thumbnails",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const thumbnail = multer({
    storage: thumbnailStorage
}).single("thumbnail");

router.get("/author/panel", isLoggedIn, (req, res) => {
    res.render("adminPanel", {
        title: "CPanel for author"
    });
});

router.get("/blogs/list", isLoggedIn, (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            req.flash("warning", "Cannot process at the moment! Contact the ADMIN ASAP! <br> ERROR: <br>" + err);
            res.render("/author/panel");
            return;
        }
        res.render("postsList", {
            title: "Edit posts",
            posts,
            moment
        });
        console.log(posts);

    });
});

router.get("/blogs/edit/:id", isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            req.flash("error", "Error finding posts!");
            res.redirect("back");
            return;
        }
        res.render("editPost", {
            post
        });
    });
});

router.put("/blogs/edit/:id", isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, returnedPost) => {
        if (err) {
            req.flash("error", "Error finding post!");
            res.redirect("back");
            return;
        }
        const post = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            image: req.body.image,
            content: req.body.content
        }
        for (const name of Object.keys(post)) {
            if (post["subtitle"].trim().length <= 64) {
                res.send({
                    status: 0,
                    message: "Subtitle must contain at least 65 characters including spaces"
                });
                return;
            }
            if (post[name].trim().length <= 6) {
                res.send({
                    status: 0,
                    message: "Less than <strong>six</strong> characters not allowed in " + name + "!"
                });
                return;
            }
        }
        console.log(post);
        post.author = req.user.username;
        post.authorId = req.user._id;
        Post.findByIdAndUpdate(req.params.id, post, (err) => {
            if (err) {
                res.send({
                    status: 0,
                    message: "Error updating post contact admin!" + err
                });
                return;
            }
            res.send({
                status: 1,
            });
            return;
        });
    })
});

router.get("/blogs/delete/:id", isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            req.flash("error", "Couldn't delete post!");
            res.redirect("back");
            return;
        }
        res.render("deletePost", {
            id: req.params.id
        });
    });
});

router.delete("/blogs/delete/:id", isLoggedIn, (req, res) => {
    Post.findOneAndDelete({ _id: req.params.id }, (err, post) => {
        if (err) {
            req.flash("error", "This type of actions not allowed against this site quit now!");
            res.redirect("back");
            return;
        }
        if(typeof post.image !== "undefined"){
            deleteFromSystem("thumbnail", post.image);

        }
        req.flash("success", "Post successfully deleted!");
        res.redirect("/blogs/list");
    });
});
router.get("/post", (req, res) => {
    res.render("post");
});

router.get("/posts", (req, res) => {
    res.render("more-posts", {
        title:"Recent Blog posts",
        keywords: "androcrunch, blog, posts, tech, security, download, products, mi, apple, android",
        description: "Latest blog posts on various genre including products review, security, tips, tricks and more."
    });
});

router.get("/blogs/new", isLoggedIn, (req, res) => {
    res.render("newPost");
});

router.post("/posts", isLoggedIn, (req, res) => {
    // Post creation...
    const post = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags
    }

    for (const name of Object.keys(post)) {
        if (post[name].trim().length <= 6) {
            res.send({
                status: 0,
                message: "Less than <strong>six</strong> characters not allowed in " + name + "!",

            });
            return;
        }
    }
    
    console.log(post);
    post.created = moment();
    post.author = req.user.username;
    post.authorId = req.user._id;
    Post.create(post, (err, returnedPost) => {
        if (err) {
            res.send({
                status: 0,
                message: "Error submitting post! Report it to admin ASAP!"
            });
            console.log(err);
        } else {
            res.render("newPost", {
                post: returnedPost
            });
        }
    });

});



router.post("/post/:id/upload", isLoggedIn,(req, res) => {
    let id = req.params.id;
    thumbnail(req, res, (err) => {
        if (err) {
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
            return;
        } else {
            Post.findOne({_id: id}, (err, post) => {
                if(err){
                    console.log(err);
                    req.flash("error", "Unable to find post check URL!wwwwwwwwwww");
                    return res.redirect("/posts/new");
                }
                post.image = req.file.filename;
                post.save();
                req.flash("success", "Post successfully created!");
                res.redirect("/author/panel");
            });

        }
    });
});

router.post("/post/:id/update/image", isLoggedIn,(req, res) => {
    let id = req.params.id;
    thumbnail(req, res, (err) => {
        if (err) {
            req.flash("error", "Couldn't upload file!");
            res.redirect("back");
            return;
        } else {
            Post.findOne({_id: id}, (err, post) => {
                if(err){
                    req.flash("error", "Unable to find post check URLddddddddddd!");
                    // deleteFromSystem("thumbnail", req.file.filename);
                    return res.redirect("/posts/new");
                }
                if(typeof post.image !== "undefined"){
                    deleteFromSystem("thumbnail", post.image);
                }
                post.image = req.file.filename;
                post.save();
                req.flash("success", "Post successfully updated!");
                res.redirect("/blogs/list");
            });
        }
    });
});

router.get("/blogs/edit/:id/image", isLoggedIn,  (req, res) => {
    Post.findOne({_id: req.params.id}, (err, post) => {
        if(err){
            req.flash("error", "Couldn't find post!");
            res.redirect("back");
            return;
        }
        res.render("updatePostImage", {
            post
        });
    });
});
module.exports = router;