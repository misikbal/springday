module.exports = (req,res,next)=>{
    
    if(!req.system.home_isActive){
        
            return res.redirect("/mainMode");
        }
    
    
    next();
}