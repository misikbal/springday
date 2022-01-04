module.exports = (req,res,next)=>{
    
    if(!req.page.home_isActive){
        
            return res.redirect("/mainMode");
        }
    
    
    next();
}