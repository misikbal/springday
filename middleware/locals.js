
module.exports=(req,res,next)=>{
    res.locals.csrfToken=req.csrfToken();
    res.locals.isAuthenticated=req.session.isAuthenticated;
    res.locals.isAdmin=req.user? req.user.isAdmin:false;
    res.locals.isLimited=req.user? req.user.isLimited:false;
    res.locals.system=req.system;
    res.locals.baselogo=req.baselogo;
    res.locals.basefav=req.basefav;
    res.locals.baseloading=req.baseloading;
    res.locals.menucategory=req.menucategory;
    res.locals.globalvalue=req.globalvalue;


    next();
}