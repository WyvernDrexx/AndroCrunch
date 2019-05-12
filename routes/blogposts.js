const Post = require("../models/post"),        //Posts model
    router = require("express").Router(),
    moment = require("moment-timezone"),
    isLoggedIn = require("../middlewares/index").isLoggedIn;


router.get("/author/panel", isLoggedIn, (req, res) => {
    res.render("adminPanel", {
        title: "CPanel for author"
    });
});

router.get("/blogs/list", isLoggedIn, (req, res) => {
    Post.find({}, (err, posts) => {
        if(err){
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
        if(err){
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
        if(err){
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
            if(err){
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
        if(err){
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
    Post.findOneAndDelete({_id: req.params.id}, (err, post) => {
        if(err){
            req.flash("error", "This type of actions not allowed against this site quit now!");
            res.redirect("back");
            return;
        }
        req.flash("success", "Post successfully deleted!");
        res.redirect("/blogs/list");
    });
});
router.get("/post", (req, res) => {
    res.render("post");
});

router.get("/posts", (req, res) => {
    res.render("more-posts");
});

router.get("/blogs/new", isLoggedIn, (req, res) => {
    res.render("newPost");
});

router.post("/posts", isLoggedIn, (req, res) => {
    // Post creation...
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
            res.send({
                status: 1
            });
        }
    });

});


module.exports = router;