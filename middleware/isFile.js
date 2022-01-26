
module.exports=(req,res,next)=>{
    res.locals.system=req.system;
    res.locals.baselogo=req.baselogo;  
    res.locals.basefav=req.basefav;
    res.locals.menucategory=req.menucategory;
    res.locals.globalvalue=req.globalvalue;




    
    next();
}