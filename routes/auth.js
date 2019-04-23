const User     = require("../models/user"),        //User model
    passport   = require("passport"),
    router     = require("express").Router(),
    localStrategy = require("passport-local");

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    // Register work
    User.register(new User({
        username: req.body.username}), req.body.password, (err, user) => {
            if(err){
                console.log(err);
                req.flash("error", err.message);
                res.redirect("/register");
            }else{
                passport.authenticate("local")(req, res, () => {
                    req.flash("success", "Registered successfully!");
                    res.redirect("/");
                });
            }
        });
    });
//Login Routes..........................................

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure"
}));

router.get("/success", (req, res) => {
    req.flash("success", "Successfully logged in " + req.user.username);
    res.redirect("/");
});

router.get("/failure", (req, res) => {
    req.flash("error", "Cannot log in ");
    res.redirect("/login");
});

module.exports = router;