module.exports = (req,res,next)=>{
    
    if(req.session.isAuthenticated){
        if(req.system.mainMode && !req.user.isAdmin){
        
            return res.redirect("/mainMode");
        }
    }
    else if(!req.session.isAuthenticated){
        if(req.system.mainMode){
            return res.redirect("/mainMode");
        }
    } 
    
    next();
}