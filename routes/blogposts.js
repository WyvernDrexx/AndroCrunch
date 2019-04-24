const Post = require("../models/post"),        //Posts model
    router = require("express").Router(),
    moment = require("moment"),
    isLoggedIn = require("../middlewares/index").isLoggedIn;

router.get("/posts", (req, res) => {
    req.flash("success", "Posts section will  be added shortly");
    res.redirect("/");
});

router.get("/posts/new", isLoggedIn, (req, res) => {
    res.render("newPost");
});

router.post("/posts", isLoggedIn, (req, res) => {
    // Post creation...
    const post = req.body.post;
    for (const name of Object.keys(post)) {
        if (post[name].trim().length <= 6) {
            req.flash("error", "Fields must be at least six characters long.");
            res.redirect("/posts/new");
            return;
        }
    }
    console.log(post);
    post.created = moment();
    post.author = req.user.username;
    post.authorId = req.user._id;
    Post.create(post, (err, returnedPost) => {
        if(err){
            req.flash("error", "Error creating the post!");
            res.redirect("/posts/new");
            console.log(err);
        }else{
            req.flash("success", "Post successfully added!");
            res.redirect("/posts");
            console.log(returnedPost);
        }
    });

});


module.exports = router;