module.exports = (req,res,next)=>{
    
    if(!req.system.client_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}