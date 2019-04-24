const middlewares = {
    isLoggedIn : function(req, res, next){
        if(!req.isAuthenticated()){
            req.flash("error", "Please Login to proceed.");
            console.log("caught")
            res.redirect("/login");
        }else{
            next();
        }
    }
}


module.exports = middlewares;