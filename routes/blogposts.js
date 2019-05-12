const Post = require("../models/post"),        //Posts model
    router = require("express").Router(),
    moment = require("moment"),
    isLoggedIn = require("../middlewares/index").isLoggedIn;

router.get("/post", (req, res) => {
    res.render("post");
});
router.get("/posts", (req, res) =>{
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
        if(post[name].trim().length <= 64){
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
        if(err){
            res.send({
                status: 0,
                message: "Error submitting post! Report it to admin ASAP!"
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