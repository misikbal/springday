module.exports = (req,res,next)=>{
    
    if(!req.page.products_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}