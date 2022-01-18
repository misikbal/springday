module.exports = (req,res,next)=>{
    
    if(!req.system.user_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}