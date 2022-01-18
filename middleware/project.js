module.exports = (req,res,next)=>{
    
    if(!req.system.project_isActive){
        
            return res.redirect("/");
        }
    
    
    next();
}