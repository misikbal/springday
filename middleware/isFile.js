
module.exports=(req,res,next)=>{
    res.locals.system=req.system;
    res.locals.footerabouts=req.footerabouts;
    res.locals.menucategory=req.menucategory;
    res.locals.lang=req.lang;
    res.locals.blog=req.blog;



    
    next();
}