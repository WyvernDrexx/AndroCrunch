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
    },
    onError: function(res, code, message){
        res.render("error", {
            message,
            code
        });  
    }
}

module.exports = middlewares;