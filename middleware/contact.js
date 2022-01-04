module.exports = (req,res,next)=>{
    
    if(!req.page.contact_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}