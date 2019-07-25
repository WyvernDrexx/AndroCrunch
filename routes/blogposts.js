const draftPost = require("../models/postDraft"), //Posts model
    router = require("express").Router(),
    Post = require("../models/post"),
    moment = require("moment-timezone"),
    isLoggedIn = require("../middlewares").isLoggedIn,
    multer = require("multer"),
    path = require("path"),
    Data = require("../models/data"),
    deleteFromSystem = require("../imports/deleteFromSystem"),
    onError = require("../middlewares").onError;

const {
    PAGE_NOT_FOUND
} = require("../imports/config").errorCodes;

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
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
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
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
                return;
            }
            res.render("preview", {
                post,
                status: "published"
            });
        });
    } else {
        onError(res, PAGE_NOT_FOUND, "Page Not Found");
        return;
    }
});

router.get("/blogs/images/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
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
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
                return;
            }
            res.render("blogImages", {
                images: post.assets,
                id: req.params.id,
                status: "published"
            });
        });
    } else {
        onError(res, PAGE_NOT_FOUND, "Check URL and try again.");
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
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
                return;
            }
            if (
                req.params.index >= post.assets.length ||
                req.params.length < req.params.length
            ) {
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
                return;
            }
            var removed = post.assets.splice(req.params.index, 1);
            post.save();
            deleteFromSystem("thumbnail", removed[0]["filename"]);
            req.flash(
                "success",
                `Image <strong>${removed[0]["filename"]}</strong> removed!`
            );
            res.redirect("back");
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                onError(res, PAGE_NOT_FOUND, "Page Not Found");
                return;
            }
            if (
                req.params.index >= post.assets.length ||
                req.params.length < req.params.length
            ) {
                req.flash("error", "Index error!");
                res.redirect("back");
                return;
            }
            var removed = post.assets.splice(req.params.index, 1);
            post.save();
            deleteFromSystem("thumbnail", removed[0]["filename"]);
            req.flash(
                "success",
                `Image <strong>${removed[0]["filename"]}</strong> removed!`
            );
            res.redirect("back");
        });
    } else {
        onError(res, PAGE_NOT_FOUND, "Page Not Found");
        return;
    }
});

router.post("/blogs/images/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        upload(req, res, err => {
            if (err) {
                onError(res, PAGE_NOT_FOUND, "Internal Server Error,Unable to upload images.");
                return;
            } else {
                draftPost.findOne({
                    _id: req.params.id
                },
                    (err, post) => {
                        if (err) {
                            req.flash("error", "Unable to find post check URL!");
                            return res.redirect("/posts/new");
                        }

                        req.files.forEach(file => {
                            post.assets.push({
                                filename: file.filename
                            });
                        });
                        post.published = false;
                        post.save();
                        req.flash("success", "Images added!");
                        res.redirect("/blogs/images/unpublished/" + req.params.id);
                    }
                );
            }
        });
    } else if (req.params.type === "published") {
        upload(req, res, err => {
            if (err) {
                onError(res, PAGE_NOT_FOUND, "Internal Server Error, Unable to upload images.");
                return;
            } else {
                Post.findOne({
                    _id: req.params.id
                },
                    (err, post) => {
                        if (err || !post) {
                            return onError(res, PAGE_NOT_FOUND, "Internal Server Error,Unable to upload images.");
                        }

                        req.files.forEach(file => {
                            post.assets.push({
                                filename: file.filename
                            });
                        });
                        post.published = false;
                        post.save();
                        req.flash("success", "Images added!");
                        res.redirect("/blogs/images/published/" + req.params.id);
                    }
                );
            }
        });
    } else {
        return onError(res, PAGE_NOT_FOUND, "Internal Server Error,Unable to find that post.");
    }
});

router.post("/blogs/:id/publish", isLoggedIn, (req, res) => {
    draftPost.findById(req.params.id, (err, post) => {
        if (err) {
            return onError(res, PAGE_NOT_FOUND, "Selected post not found. Message admin.");
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
            published: true,
            metaDescription: typeof post.metaDescription !== "undefined" ? post.metaDescription : undefined
        },
            (err, post) => {
                if (err) {
                    return onError(res, PAGE_NOT_FOUND, "Couldn't publish post. Try again later.");
                }

                req.flash(
                    "success",
                    "Post Published and removed from Unpublished Posts!"
                );
                res.redirect("/author/panel");
            }
        );
        post.remove();
    });
});

router.get("/blogs/list/unpublished", isLoggedIn, isLoggedIn, (req, res) => {
    draftPost.find({}, (err, posts) => {
        if (err) {
            return onError(res, PAGE_NOT_FOUND, "Couldn't get posts contact admin.");
        }
        res.render("postsList", {
            title: "Unpublished Posts",
            posts,
            moment,
            status: "unpublished"
        });
    });
});
router.get("/blogs/list/published", isLoggedIn, isLoggedIn, (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            return onError(res, PAGE_NOT_FOUND, "Couldn't get posts contact admin.");
        }
        res.render("postsList", {
            title: "Published Posts",
            posts,
            moment,
            status: "published"
        });
    });
});

router.get("/blogs/edit/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Couldn't get post for editing. Contact admin.");
            }
            console.log(post);
            res.render("editPost", {
                post,
                status: "unpublished"
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Couldn't get post for editing contact admin.");
            }
            console.log(post);
            res.render("editPost", {
                post,
                status: "published"
            });
        });
    } else {
        return onError(res, PAGE_NOT_FOUND, "Couldn't get posts contact admin.");
    }
});

router.put("/blogs/edit/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, returnedPost) => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Couldn't get posts contact admin.");
            }
            console.log(req.body.metaDescription)
            const post = {
                title: req.body.title,
                content: req.body.content,
                customUrl: req.body.customUrl
                    .trim()
                    .split(" ")
                    .join("-")
                    .toLowerCase(),
                tags: req.body.tags.toUpperCase(),
                metaDescription: req.body.metaDescription
            };
            for (const name of Object.keys(post)) {
                if (post[name].trim().length <= 6 && String(name) !== "tags") {
                    res.send({
                        status: 0,
                        message: "Less than <strong>six</strong> characters not allowed in " +
                            name +
                            "!"
                    });
                    return;
                }
            }

            if (post.title.length > 104) {
                res.send({
                    status: 0,
                    message: "More than <strong>104</strong> characters not allowed in Title Current length:   " +
                        post.title.length
                });
                return;
            }
            post.author = req.user.username;
            post.authorId = req.user._id;
            draftPost.findByIdAndUpdate(req.params.id, post, err => {
                if (err) {
                    res.send({
                        status: 0,
                        message: "Error updating post contact admin!" + err
                    });
                    return;
                }
                res.send({
                    status: 1
                });
                returnedPost.published = false;
                returnedPost.save();
                return;
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, returnedPost) => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Couldn't get posts contact admin.");
            }
            const post = {
                title: req.body.title,
                content: req.body.content,
                customUrl: req.body.customUrl
                    .trim()
                    .split(" ")
                    .join("-")
                    .toLowerCase(),
                tags: req.body.tags.toUpperCase(),
                metaDescription: req.body.metaDescription
            };
            for (const name of Object.keys(post)) {
                if (post[name].trim().length <= 6 && String(name) !== "tags") {
                    res.send({
                        status: 0,
                        message: "Less than <strong>six</strong> characters not allowed in " +
                            name +
                            "!"
                    });
                    return;
                }
            }
            if (post.title.length > 104) {
                res.send({
                    status: 0,
                    message: "More than <strong>104</strong> characters not allowed in Title Current length:   " +
                        post.title.length
                });
                return;
            }
            post.author = req.user.username;
            post.authorId = req.user._id;
            Post.findByIdAndUpdate(req.params.id, post, err => {
                if (err) {
                    res.send({
                        status: 0,
                        message: "Error updating post contact admin!" + err
                    });
                    return;
                }
                res.send({
                    status: 1
                });
                return;
            });
        });
    } else {
        return onError(res, "IBM Error", "Check URL and try again.");
    }
});

router.get("/blogs/delete/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findById(req.params.id, (err, post) => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "The selected post is not present in Database.");
            }
            res.render("deletePost", {
                id: req.params.id,
                status: "unpublished"
            });
        });
    } else if (req.params.type === "published") {
        Post.findById(req.params.id, (err, post) => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "The selected post is not present in Database.");
            }
            res.render("deletePost", {
                id: req.params.id,
                status: "published"
            });
        });
    } else {
        return onError(res, "IBM Error", "Check URL and try again.");
    }
});

router.delete("/blogs/delete/:type/:id", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findOneAndDelete({
            _id: req.params.id
        },
            (err, post) => {
                if (err) {
                    req.flash(
                        "error",
                        "This type of actions not allowed against this site quit now!"
                    );
                    res.redirect("back");
                    return;
                }
                if (typeof post.image !== "undefined") {
                    deleteFromSystem("thumbnail", post.image);
                }
                req.flash("success", "Post successfully deleted!");
                res.redirect("/blogs/list/unpublished");
            }
        );
    } else if (req.params.type === "published") {
        Post.findOneAndDelete({
            _id: req.params.id
        },
            (err, post) => {
                if (err || !post) {
                    req.flash(
                        "error",
                        "This type of actions not allowed against this site quit now!"
                    );
                    res.redirect("back");
                    return;
                }
                if (typeof post.image !== "undefined") {
                    deleteFromSystem("thumbnail", post.image);
                }
                req.flash("success", "Post successfully deleted!");
                res.redirect("/blogs/list/published");
            }
        );
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
        customUrl: req.body.customUrl
            .trim()
            .split(" ")
            .join("-")
            .toLowerCase(),
        metaDescription: req.body.metaDescription
    };

    for (const name of Object.keys(post)) {
        if (post[name].trim().length <= 6 && String(name) !== "tags") {
            res.send({
                status: 0,
                message: "Less than <strong>six</strong> characters not allowed in " +
                    name +
                    "!"
            });
            return;
        }
    }

    if (post.title.length > 104) {
        res.send({
            status: 0,
            message: "More than <strong>104</strong> characters not allowed in Title Current length:   " +
                post.title.length
        });
        return;
    }

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
        thumbnail(req, res, err => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Unable to upload file at the moment. Contact admin.");
            } else {
                draftPost.findOne({
                    _id: id
                },
                    (err, post) => {
                        if (err) {
                            return onError(res, PAGE_NOT_FOUND, "Error contacting database. Contact admin.");
                        }
                        post.image = req.file.filename;
                        post.save();
                        req.flash("success", "Post successfully created!");
                        res.redirect("/author/panel");
                    }
                );
            }
        });
    } else if (req.params.type === "published") {
        thumbnail(req, res, err => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Unable to upload file at the moment. Contact admin.");
            } else {
                Post.findOne({
                    _id: id
                },
                    (err, post) => {
                        if (err || post) {
                            return onError(res, PAGE_NOT_FOUND, "The post was not found.");

                        }
                        post.image = req.file.filename;
                        post.save();
                        req.flash("success", "Post successfully created!");
                        res.redirect("/author/panel");
                    }
                );
            }
        });
    } else {
        return onError(res, "IBM Error", "Check URL and try again.");
    }
});

router.post("/post/:type/:id/update/image", isLoggedIn, (req, res) => {
    let id = req.params.id;

    if (req.params.type === "unpublished") {
        thumbnail(req, res, err => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Unable to upload file at the moment. Contact admin.");
            } else {
                draftPost.findOne({
                    _id: id
                },
                    (err, post) => {
                        if (err) {
                            return onError(res, PAGE_NOT_FOUND, "Database Error.");
                        }
                        if (typeof post.image !== "undefined") {
                            deleteFromSystem("thumbnail", post.image);
                        }

                        post.image = req.file.filename;
                        post.save();
                        req.flash("success", "Post successfully updated!");
                        res.redirect("/blogs/list/unpublished");
                    }
                );
            }
        });
    } else if (req.params.type === "published") {
        thumbnail(req, res, err => {
            if (err) {
                return onError(res, PAGE_NOT_FOUND, "Unable to upload file at the moment. Contact admin.");
            } else {
                Post.findOne({
                    _id: id
                },
                    (err, post) => {
                        if (err || !post) {
                            return onError(res, PAGE_NOT_FOUND, "Post not found in Database.");
                        }
                        if (typeof post.image !== "undefined") {
                            deleteFromSystem("thumbnail", post.image);
                        }
                        post.image = req.file.filename;
                        post.save();
                        req.flash("success", "Post successfully updated!");
                        res.redirect("/blogs/list/published");
                    }
                );
            }
        });
    } else {
        return onError(res, "IBM Error", "Check URL and try again.");
    }
});

router.get("/blogs/edit/:type/:id/image", isLoggedIn, (req, res) => {
    if (req.params.type === "unpublished") {
        draftPost.findOne({
            _id: req.params.id
        },
            (err, post) => {
                if (err || !post) {
                    return onError(res, PAGE_NOT_FOUND, "Post not found.");
                }
                res.render("updatePostImage", {
                    post,
                    status: "unpublished"
                });
            }
        );
    } else if (req.params.type === "published") {
        Post.findOne({
            _id: req.params.id
        },
            (err, post) => {
                if (err || !post) {
                    return onError(res, PAGE_NOT_FOUND, "Post not found.");
                }
                res.render("updatePostImage", {
                    post,
                    status: "published"
                });
            }
        );
    } else {
        return onError(res, "IBM Error", "Check URL and try again.");
    }
});

// Routes for the public

router.get("/blogs", (req, res) => {
    Post.find({})
        .then(posts => {
            posts = posts.reverse();
            var last = posts.length / 4;

            if (last > Math.floor(last)) {
                last = Math.floor(last) + 1;
            } else {
                last = Math.floor(last);
            }

            let recommended = {};
            Data.find({})
                .then(data => {
                    recommended = data[0].list.trending.blogs;
                    res.render("blogs", {
                        title: "Latest And Top Blog Posts",
                        keywords: "Latest posts, blog posts, tech, technology, products, mi, apple, android",
                        description: "Read latest posts on Android, technology, security, Apple and mobile devices",
                        posts: posts.splice(0, 4),
                        recommended,
                        moment,
                        next: 2,
                        current: 1,
                        previous: 0,
                        last
                    });
                })
                .catch(err => {
                    req.flash("error", "Internal Server error encountered!");
                    res.redirect("/");
                });
        })
        .catch(err => {
            return onError(res, PAGE_NOT_FOUND, "Server Error, Please try again later.");
        });
});

router.get("/blogs/:customUrl", (req, res) => {
    const customUrl = req.params.customUrl.trim().toLowerCase();

    Post.findOne({
        customUrl: customUrl
    })
        .then(post => {
            Post.find({}, (err, posts) => {
                if (err) {
                    return onError(res, PAGE_NOT_FOUND, "Server Error, Please try again later.");
                }
                Data.find({}, (err, data) => {
                    let latest = posts.splice(posts.length - 3, posts.length);
                    res.render("postView", {
                        canonicalUrl: "https://www.androcrunch.in/blogs/" + customUrl,
                        post,
                        latest,
                        moment,
                        title: post.title,
                        description: post.content.replace(/<[^>]*>?/gm, ""),
                        keywords: post.tags.toLowerCase().split(" ").join(", "),
                        trending: data[0].list.trending.blogs[0],
                        description: typeof post.metaDescription !== "undefined" ? post.metaDescription : post.content
                    });
                });
            });
            post.views += 1;
            post.save();
        })
        .catch(err => {
            return onError(res, PAGE_NOT_FOUND, "Server Error, Please try again later.");
        });
});

router.get("/blogs/page/:page", (req, res) => {
    let pagenumber = Math.floor(Number(req.params.page));

    if (isNaN(pagenumber)) {
        return onError(res, "IBM Error", "Please check your URL and try again.");
    }

    Post.find({}, (err, posts) => {
        let totalPages = posts.length / 4;
        if (totalPages > Math.floor(totalPages)) {
            totalPages = Math.floor(totalPages) + 1;
        } else {
            totalPages = Math.floor(totalPages);
        }

        let start = (pagenumber - 1) * 4;
        let end = pagenumber * 4;

        if (end - posts.length > 4) {
            return onError(res, PAGE_NOT_FOUND, "Page number limit exceeded.");
        } else {
            if (totalPages === pagenumber) {
                end = posts.length;
            }
        }

        let viewPosts = posts.slice(start, end);
        Data.find({})
            .then(data => {
                recommended = data[0].list.trending.blogs;
                res.render("blogs", {
                    posts: viewPosts,
                    last: totalPages,
                    next: pagenumber + 1,
                    current: pagenumber,
                    previous: pagenumber - 1,
                    moment
                });
            })
            .catch(err => {
                return onError(res, PAGE_NOT_FOUND, "Server Error, Please try again later.");
            });
    });
});

module.exports = router;