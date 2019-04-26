const middlewares = {
    isLoggedIn : function(req, res, next){
        if(!req.isAuthenticated()){
            res.render("error", {
                code: 403,
                message: "Access forbidden for this page!"
            })
        }else{
            next();
        }
    }
}

module.exports = middlewares;