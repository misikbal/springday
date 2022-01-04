module.exports = (req,res,next)=>{
    
    if(!req.page.client_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}