module.exports = (req,res,next)=>{
    
    if(!req.system.contact_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}