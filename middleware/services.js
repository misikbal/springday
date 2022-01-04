module.exports = (req,res,next)=>{
    
    if(!req.page.services_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}