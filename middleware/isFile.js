
module.exports=(req,res,next)=>{
    res.locals.page=req.page;
    res.locals.social=req.social;
    res.locals.logo=req.logo;
    res.locals.system=req.system;
    res.locals.theme=req.theme;
    res.locals.footerabouts=req.footerabouts;
    res.locals.menucategory=req.menucategory;
    res.locals.active=req.active;
    res.locals.lang=req.lang;
    res.locals.loading=req.loading;

    
    next();
}