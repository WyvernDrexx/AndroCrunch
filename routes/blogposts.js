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
    const post = {
        title: req.body.title,
        image: req.body.image,
        content: req.body.content
    }
    for (const name of Object.keys(post)) {
        if (post[name].trim().length <= 6) {
            res.send({
                status: 2
            });
            return;
        }
    }
    console.log(post);
    post.created = moment();
    post.author = req.user.username;
    post.authorId = req.user._id;
    Post.create(post, (err, returnedPost) => {
        if(err){
            res.send({
                status: 0
            });
            console.log(err);
        }else{
            res.send({
                status: 1
            });
        }
    });

});


module.exports = router;