module.exports = (req,res,next)=>{
    
    if(!req.page.about_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}