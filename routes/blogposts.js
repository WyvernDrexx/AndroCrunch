const draftPost = require("../models/postDraft"), //Posts model
    router = require("express").Router(),
    Post = require("../models/post"),
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

const upload = multer({
    storage: thumbnailStorage
}).array("upload", 10);



router.get("/author/panel", isLoggedIn, (req, res) => {
    res.render("adminPanel", {
        title: "CPanel for author"
    });
});

router.get("/blogs/preview/:type/:id", isLoggedIn, (req, res) => {


    if (req.params.type === "unpublished") {

        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Couldn't preview post");
                res.redirect("back");
                return;
            }
            res.render("preview", {
                post,
                status: "unpublished"
            });
        });

    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Couldn't preview post");
                res.redirect("back");
                return;
            }
            res.render("preview", {
                post,
                status: "published"
            });
        });
    } else {
        req.flash("error", "Unknown Category!");
        res.redirect("/");
    }
});

router.get("/blogs/images/:type/:id", isLoggedIn, (req, res) => {

    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Error retrieving Images!");
                res.redirect("/");
                return;
            }
            res.render("blogImages", {
                images: post.assets,
                id: req.params.id,
                status: "unpublished"
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Error retrieving Images!");
                res.redirect("/");
                return;
            }
            res.render("blogImages", {
                images: post.assets,
                id: req.params.id,
                status: "published"
            });
        });
    } else {
        req.flash("error", "Unknown Category!");
        res.redirect("/");
    }
});

router.get("/blogs/images/upload/:type/:id", isLoggedIn, (req, res) => {
    res.render("uploadBlogImages", {
        id: req.params.id,
        status: req.params.type
    });
});


router.delete("/blogs/images/:type/:id/:index", isLoggedIn, (req, res) => {

    if (req.params.type === "unpublished") {

        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "No post found with that id!");
                res.redirect("back");
                return;
            }
            if (req.params.index >= post.assets.length || req.params.length < req.params.length) {
                req.flash("error", "Index error!");
                res.redirect("back");
                return;
            }
            var removed = post.assets.splice(req.params.index, 1);
            post.save();
            deleteFromSystem("thumbnail", removed[0]["filename"]);
            req.flash("success", `Image <strong>${removed[0]["filename"]}</strong> removed!`);
            res.redirect("back");
        });

    } else if (req.params.type === "published") {

        Post.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "No post found with that id!");
                res.redirect("back");
                return;
            }
            if (req.params.index >= post.assets.length || req.params.length < req.params.length) {
                req.flash("error", "Index error!");
                res.redirect("back");
                return;
            }
            var removed = post.assets.splice(req.params.index, 1);
            post.save();
            deleteFromSystem("thumbnail", removed[0]["filename"]);
            req.flash("success", `Image <strong>${removed[0]["filename"]}</strong> removed!`);
            res.redirect("back");
        });

    } else {
        req.flash("error", "Check URL.");
        res.redirect("back");
        return;
    }
});


router.post("/blogs/images/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        upload(req, res, (err) => {
            if (err) {
                req.flash("error", "Couldn't upload images..!");
                res.redirect("back");
                return;
            } else {
                draftPost.findOne({
                    _id: req.params.id
                }, (err, post) => {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Unable to find post check URL!");
                        return res.redirect("/posts/new");
                    }

                    req.files.forEach((file) => {
                        post.assets.push({
                            filename: file.filename
                        });
                    });
                    post.published = false;
                    post.save();
                    req.flash("success", "Images added!");
                    res.redirect("/blogs/images/unpublished/" + req.params.id);
                });

            }
        });
    } else if (req.params.type === "published") {
        upload(req, res, (err) => {
            if (err) {
                req.flash("error", "Couldn't upload images..!");
                res.redirect("back");
                return;
            } else {
                Post.findOne({
                    _id: req.params.id
                }, (err, post) => {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Unable to find post check URL!");
                        return res.redirect("/posts/new");
                    }

                    req.files.forEach((file) => {
                        post.assets.push({
                            filename: file.filename
                        });
                    });
                    post.published = false;
                    post.save();
                    req.flash("success", "Images added!");
                    res.redirect("/blogs/images/published/" + req.params.id);
                });
            }
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }
});


router.post("/blogs/:id/publish", isLoggedIn, (req, res) => {
    draftPost.findById(req.params.id, (err, post) => {
        console.log(post);
        if (err) {
            req.flash("error", "No post found" + err);
            res.redirect("/author/panel");
            return;
        }
        Post.create({
            author: post.author,
            authorId: post.authorId,
            title: post.title,
            rating: post.rating,
            image: post.image,
            assets: post.assets,
            content: post.content,
            created: post.created,
            tags: post.tags,
            customUrl: post.customUrl,
            published: true
        }, (err, post) => {
            console.log(post);
            if (err) {
                console.log(err);
                req.flash("error", "Unable to publish!" + err);
                res.redirect("/author/panel");
                return;
            }

            req.flash("success", "Post Published!");
            res.redirect("/author/panel");
        });
        post.published = true;
        post.save();
    });
});


router.get("/blogs/list/unpublished", isLoggedIn, isLoggedIn, (req, res) => {
    draftPost.find({}, (err, posts) => {
        if (err) {
            req.flash("warning", "Cannot process at the moment! Contact the ADMIN ASAP! <br> ERROR: <br>" + err);
            res.render("/author/panel");
            return;
        }
        res.render("postsList", {
            title: "Unpublished Posts",
            posts,
            moment,
            status: "unpublished"
        });
        console.log(posts);

    });
});
router.get("/blogs/list/published", isLoggedIn, isLoggedIn, (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            req.flash("warning", "Cannot process at the moment! Contact the ADMIN ASAP! <br> ERROR: <br>" + err);
            res.render("/author/panel");
            return;
        }
        res.render("postsList", {
            title: "Published Posts",
            posts,
            moment,
            status: "published"
        });
        console.log(posts);

    });
});

router.get("/blogs/edit/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Error finding posts!");
                res.redirect("back");
                return;
            }
            res.render("editPost", {
                post,
                status: "unpublished"
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Error finding posts!");
                res.redirect("back");
                return;
            }
            res.render("editPost", {
                post,
                status: "published"
            });
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }
});

router.put("/blogs/edit/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, returnedPost) => {
            if (err) {
                req.flash("error", "Error finding post!");
                res.redirect("back");
                return;
            }
            const post = {
                title: req.body.title,
                content: req.body.content,
                customUrl: req.body.customUrl.trim().split(" ").join("-").toLowerCase(),
                tags: req.body.tags.toUpperCase()
            }
            for (const name of Object.keys(post)) {
                if (post[name].trim().length <= 6 && String(name) !== "tags") {
                    res.send({
                        status: 0,
                        message: "Less than <strong>six</strong> characters not allowed in " + name + "!"
                    });
                    return;
                }
            }

            if(post.title.length > 104){
                res.send({
                    status: 0,
                    message: "More than <strong>104</strong> characters not allowed in Title Current length:   " + post.title.length
                });
                return;
            }
            post.author = req.user.username;
            post.authorId = req.user._id;
            draftPost.findByIdAndUpdate(req.params.id, post, (err) => {
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
                returnedPost.published = false;
                returnedPost.save();
                return;
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, returnedPost) => {
            if (err) {
                req.flash("error", "Error finding post!");
                res.redirect("back");
                return;
            }
            const post = {
                title: req.body.title,
                content: req.body.content,
                customUrl: req.body.customUrl.trim().split(" ").join("-").toLowerCase(),
                tags: req.body.tags.toUpperCase()
            }
            for (const name of Object.keys(post)) {
                if (post[name].trim().length <= 6 && String(name) !== "tags") {
                    res.send({
                        status: 0,
                        message: "Less than <strong>six</strong> characters not allowed in " + name + "!"
                    });
                    return;
                }
            }
            if(post.title.length > 104){
                res.send({
                    status: 0,
                    message: "More than <strong>104</strong> characters not allowed in Title Current length:   " + post.title.length
                });
                return;
            }
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
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }

});

router.get("/blogs/delete/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Couldn't delete post!");
                res.redirect("back");
                return;
            }
            res.render("deletePost", {
                id: req.params.id,
                status: "unpublished"
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                req.flash("error", "Couldn't delete post!");
                res.redirect("back");
                return;
            }
            res.render("deletePost", {
                id: req.params.id,
                status: "published"
            });
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }



});

router.delete("/blogs/delete/:type/:id", isLoggedIn, (req, res) => {

    if (req.params.type === "unpublished") {
        draftPost.findOneAndDelete({
            _id: req.params.id
        }, (err, post) => {
            if (err) {
                req.flash("error", "This type of actions not allowed against this site quit now!");
                res.redirect("back");
                return;
            }
            if (typeof post.image !== "undefined") {
                deleteFromSystem("thumbnail", post.image);

            }
            req.flash("success", "Post successfully deleted!");
            res.redirect("/blogs/list/unpublished");
        });
    } else if (req.params.type === "published") {
        Post.findOneAndDelete({
            _id: req.params.id
        }, (err, post) => {
            if (err) {
                req.flash("error", "This type of actions not allowed against this site quit now!");
                res.redirect("back");
                return;
            }
            if (typeof post.image !== "undefined") {
                deleteFromSystem("thumbnail", post.image);

            }
            req.flash("success", "Post successfully deleted!");
            res.redirect("/blogs/list/published");
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }



});
router.get("/post", (req, res) => {
    res.render("post");
});

router.get("/posts", (req, res) => {
    res.render("more-posts", {
        title: "Recent Blog posts",
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
        tags: req.body.tags,
        customUrl: req.body.customUrl.trim().split(" ").join("-").toLowerCase()
    }

    for (const name of Object.keys(post)) {
        if (post[name].trim().length <= 6 && String(name) !== "tags") {
            res.send({
                status: 0,
                message: "Less than <strong>six</strong> characters not allowed in " + name + "!",
            });
            return;
        }
    }

    if(post.title.length > 104){
        res.send({
            status: 0,
            message: "More than <strong>104</strong> characters not allowed in Title Current length:   " + post.title.length
        });
        return;
    }

    console.log(post);
    post.created = moment();
    post.author = req.user.username;
    post.authorId = req.user._id;
    post.draft = true;
    post.published = false;
    draftPost.create(post, (err, returnedPost) => {
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



router.post("/post/:type/:id/upload", isLoggedIn, (req, res) => {
    let id = req.params.id;
    if (req.params.type === "unpublished") {
        thumbnail(req, res, (err) => {
            if (err) {
                req.flash("error", "Couldn't upload file!");
                res.redirect("back");
                return;
            } else {
                draftPost.findOne({
                    _id: id
                }, (err, post) => {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Unable to find post check URL!");
                        return res.redirect("/posts/new");
                    }
                    post.image = req.file.filename;
                    post.save();
                    req.flash("success", "Post successfully created!");
                    res.redirect("/author/panel");
                });

            }
        });
    } else if (req.params.type === "published") {
        thumbnail(req, res, (err) => {
            if (err) {
                req.flash("error", "Couldn't upload file!");
                res.redirect("back");
                return;
            } else {
                Post.findOne({
                    _id: id
                }, (err, post) => {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Unable to find post check URL!");
                        return res.redirect("/posts/new");
                    }
                    post.image = req.file.filename;
                    post.save();
                    req.flash("success", "Post successfully created!");
                    res.redirect("/author/panel");
                });

            }
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }


});

router.post("/post/:type/:id/update/image", isLoggedIn, (req, res) => {
    let id = req.params.id;

    if (req.params.type === "unpublished") {
        thumbnail(req, res, (err) => {
            if (err) {
                req.flash("error", "Couldn't upload file!");
                res.redirect("back");
                return;
            } else {
                draftPost.findOne({
                    _id: id
                }, (err, post) => {
                    if (err) {
                        req.flash("error", "Unable to find post check URLddddddddddd!");
                        // deleteFromSystem("thumbnail", req.file.filename);
                        return res.redirect("/posts/new");
                    }
                    if (typeof post.image !== "undefined") {
                        deleteFromSystem("thumbnail", post.image);
                    }


                    post.image = req.file.filename;
                    post.save();
                    req.flash("success", "Post successfully updated!");
                    res.redirect("/blogs/list/unpublished");
                });
            }
        });
    } else if (req.params.type === "published") {
        thumbnail(req, res, (err) => {
            if (err) {
                req.flash("error", "Couldn't upload file!");
                res.redirect("back");
                return;
            } else {
                Post.findOne({
                    _id: id
                }, (err, post) => {
                    if (err) {
                        req.flash("error", "Unable to find post check URLddddddddddd!");
                        return res.redirect("/posts/new");
                    }
                    if (typeof post.image !== "undefined") {
                        deleteFromSystem("thumbnail", post.image);
                    }
                    post.image = req.file.filename;
                    post.save();
                    req.flash("success", "Post successfully updated!");
                    res.redirect("/blogs/list/published");
                });
            }
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }


});

router.get("/blogs/edit/:type/:id/image", isLoggedIn, (req, res) => {

    if (req.params.type === "unpublished") {
        draftPost.findOne({
            _id: req.params.id
        }, (err, post) => {
            if (err) {
                req.flash("error", "Couldn't find post!");
                res.redirect("back");
                return;
            }
            res.render("updatePostImage", {
                post,
                status: "unpublished"
            });
        });
    } else if (req.params.type === "published") {
        Post.findOne({
            _id: req.params.id
        }, (err, post) => {
            if (err) {
                req.flash("error", "Couldn't find post!");
                res.redirect("back");
                return;
            }
            res.render("updatePostImage", {
                post,
                status: "published"
            });
        });
    } else {
        req.flash("error", "Cannot find any post.. Contact admin!");
        res.redirect("/");
    }

});




// Routes for the public



router.get("/blogs", (req, res) => {

    Post.find({})
        .then(posts => {
            res.render("blogs", {
                title: "Latest And Top Blog Posts",
                keywords: "Latest posts, blog posts, tech, technology, products, mi, apple, android",
                description: "Read latest posts on Android, technology, security, Apple and mobile devices",
                posts
            });
        })
        .catch(err => {
            req.flash("error", "Couldn't fetch any data. Try again later!");
            res.redirect("/");
        });

});



router.get("/blogs/view/:customUrl", (req,res) => {

    const customUrl = req.params.customUrl.trim().toLowerCase();
    Post.findOne({
        customUrl: customUrl
    })
    .then((post) => {
        res.render("postView", {
            post
        });
        post.views += 1;
        post.save();
    })
    .catch(err => {
        req.flash("error", "Please check your url and try again!");
        res.redirect("/blogs");
    });

});





module.exports = router;