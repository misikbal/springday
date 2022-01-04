module.exports = (req,res,next)=>{
    
    if(!req.page.user_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}