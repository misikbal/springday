module.exports = (req,res,next)=>{
    
    if(!req.system.about_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}