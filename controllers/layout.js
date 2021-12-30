
const Logo=require('../model/logo');
const Themes=require('../model/themes');
const Social=require('../model/socialmedia');
const Client=require('../model/client');
const System=require('../model/system');
const Page=require('../model/page');







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
                        Page.find()
                        .then(page=>{
                            res.json({logo:logo,themes:themes,system:system,page:page});
                        })
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