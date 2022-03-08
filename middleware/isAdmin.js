module.exports=(req,res,next)=>{
    if(!req.session.isAuthenticated){
        req.session.redirectTo=req.url;
        return res.redirect("/admin-login");
    }
    if(!req.user.isAdmin){
        return res.redirect("/admin");
    }
    next();
}