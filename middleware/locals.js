
module.exports=(req,res,next)=>{
    res.locals.csrfToken=req.csrfToken();
    res.locals.isAuthenticated=req.session.isAuthenticated;
    res.locals.isAdmin=req.user? req.user.isAdmin:false;
    res.locals.isLimited=req.user? req.user.isLimited:false;
    res.locals.system=req.system;
    res.locals.footerabouts=req.footerabouts;
    res.locals.menucategory=req.menucategory;
    res.locals.lang=req.lang;
    res.locals.blog=req.blog;

    next();
}