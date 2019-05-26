const User     = require("../models/user"),        //User model
    passport   = require("passport"),
    router     = require("express").Router(),
    localStrategy = require("passport-local");

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// router.get("/register", (req, res) => {
//     res.render("register");
//     // req.flash("success", "Currently we do not support registration for the public.");
//     // res.redirect("/");
// });

// router.post("/register", (req, res) => {
//     // req.flash("success", "Currently we do not support login for public.");
//     // res.redirect("/");
//     // Register work
//     User.register(new User({
//         username: req.body.username}), req.body.password, (err, user) => {
//             if(err){
//                 console.log(err);
//                 req.flash("error", err.message);
//                 res.redirect("/register");
//             }else{
//                 passport.authenticate("local")(req, res, () => {
//                     req.flash("success", "Registered successfully!");
//                     res.redirect("/");
//                 });
//             }
//         });
//     });
//Login Routes..........................................

router.get("/androloginx", (req, res) => {
    res.render("login");
});

// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/success",
//     failureRedirect: "/failure"
// }));

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);       //If exception occured
        }
        if (!user) {
            return res.send({
                status: false
            });       //If login failed
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({
                status: true
            });       //If login succeeded
        });
    })(req, res, next);
}, (res, req, err) => {
    res.send(err);
});



router.get("/success", (req, res) => {
    console.log(req.user);
    req.flash("success", "Successfully logged in " + req.user.username);
    res.redirect("/");
});

router.get("/failure", (req, res) => {
    req.flash("error", "Cannot log in ");
    res.redirect("/login");
});

module.exports = router;