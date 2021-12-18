
const Logo=require('../model/logo');
const Themes=require('../model/themes');
const Social=require('../model/socialmedia');
const Client=require('../model/client');
const System=require('../model/system');






exports.getLayout=(req, res, next) =>{
    
    Logo.findOne()
    .select("logo favico footerLogo")
    .then((logo)=>{   
        Themes.findOne()
        .select("navbarLight navbarDark bodyDark bodyLight cardLight cardrDark footerDark footerLight infoDark infoLight")
        .then(themes=>{ 
                    System.find()
                    .select("phone tawktoscript")
                    .then(system=>{
                        res.json({logo:logo,themes:themes,system:system});          
                    })
                })
    }).catch((err)=>{
        next(err);
    });

}

exports.getSocial=(req, res, next) =>{
        Social.findOne()
            .select("facebook instagram twitter linkedin youtube mail phone")
            .then(social=>{
                res.json({social:social});                
            })
            .catch((err)=>{
        next(err);
    });

}