module.exports = (req,res,next)=>{
    
    if(!req.system.services_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}