const User=require("../model/user");
const Login=require("../model/login");
const bcrypt=require("bcrypt");
const session = require("express-session");
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const Mail = require("../model/mail");
const Contact = require("../model/contactus");
const System = require("../model/system");
const Advanced = require("../model/advanced");
const Systems = require("../model/system");


const ip = require("ip");

//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

System.find()
.select("sgMail")
.then(apiKey=>{
    sgMail.setApiKey(apiKey[0].sgMail);

})
exports.getLogin=(req,res,next)=>{
    var errorMessage=req.session.errorMessage;
    delete req.session.errorMessage;
    res.render("account/login",{
        path:"/login",
        title:"Login",
        errorMessage:errorMessage,
        action:req.query.action
    });
}

exports.postLogin =(req,res,next)=> {
    const email=req.body.email;
    const password=req.body.password;
    const loginModel=new Login({
        email:email,
        password:password
    });
    loginModel
        .validate()
        .then(()=>{
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    req.session.errorMessage="Bu mail adresi ile bir kayıt bulunamamıştır.";
                    req.session.save(function(err) {
                        return res.redirect("/login");
                    })                    
                }

                    bcrypt.compare(password,user.password)
                    .then(isSuccess=>{
                        if(isSuccess){
                            if(user.isAdmin){
                                
                            }
                            
                            if(res.locals.isAdmin){
                                    const advanced=new Advanced(
                                        {
                                            userId:user._id,
                                            status:"admin",
                                            ip:ip.address()
                                        }
                                    )
                                    advanced.save()
                                

                                    req.session.user=user;
                                    req.session.isAuthenticated=true;
                                    return req.session.save(function(err) {
                                    var url="/admin/" || req.session.redirectTo;                                    
                                    delete req.session.redirectTo                                    
                                    return res.redirect(url); 

                                })
                            }
                            else if(user.isLimited){
                                const advanced=new Advanced(
                                    {
                                        userId:user._id,
                                        status:"Kısıtlı Admin",
                                        ip:ip.address()
                                    }
                                )
                                advanced.save()

                                req.session.user=user;
                                req.session.isAuthenticated=true;
                                return req.session.save(function(err) {
                                var url="/admin/" || req.session.redirectTo;                                    
                                delete req.session.redirectTo                                    
                                return res.redirect(url); 
                            })
                            }
                            else{
                                
                                req.session.user=user;
                                req.session.isAuthenticated=true;
                                return req.session.save(function(err) {
                                    var url="/" || req.session.redirectTo  ;
                                    delete req.session.redirectTo;
                                    return res.redirect(url); 
                                })

                            }
                            
                        }
                        req.session.errorMessage="Hatalı Eposta ya da Parola Girdiniz";
                        req.session.save(function(err) {
                        return res.redirect("/login");
                    })
                    })
                    .catch(err=>{
                        req.session.errorMessage="Şifre alanını boş bırakmayınız";
                        req.session.save(function(err) {
                        return res.redirect("/login");
                    })
                        console.log(err);
                    })
                .catch(err=>{
                    console.log(err);
                });
                
            })
            .catch(err=>{
                console.log(err);
            });
        })
        .catch(err=>{
            if(err.name=="ValidationError"){
                let message="";
                for(field in err.errors){
                    message+=err.errors[field].message+"<br>";
                }
                res.render("account/login",{
                    path:"/login",
                    title:"Login",
                    errorMessage:message
                });
            }else{
                next(err);
            }
            console.log(err.message);
        })
    

    }

exports.getMail = (req, res, next) => {
    Mail.findOne()
        .select("title from html properties")
        .then(mail => {
            res.render("admin/mail",{
                path:"/admin/mail",
                title:"Mail Ayarları",
                mail: mail,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}


exports.postEditMail = (req, res, next) => {

    const id = req.body.id;
    const title = req.body.title;
    const from = req.body.from;
    const html = req.body.html;
    const properties=req.body.properties;
    const userId=req.body.csrfToken;

    Mail.findOne()
        .then(mail=>{
            if(!mail){
                return res.redirect("/");
            }
            mail.title=title;
            mail.from=from;
            mail.html=html;
            mail.properties=properties;
            mail.userId=userId;            
        
            return mail.save();
        }).then(result=>{
            res.redirect('/admin/mail?action=edit');
        })
        .catch(err => next(err));

    
}
exports.getRegister=(req,res,next)=>{
    var errorMessage=req.session.errorMessage;
    delete req.session.errorMessage;
    res.render("account/register",{
        path:"/register",
        title:"Register",
        errorMessage:errorMessage,
    })
}
exports.postRegister=(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(user){
            req.session.errorMessage="Bu mail adresi ile daha önce kayıt olunmuş.";
            req.session.save(function(err) {
                return res.redirect("/register");
            })
        }
        if(!user){

        bcrypt.hash(password,12)
        .then(hashedPassword=>{
        
            const newUser=new User({                
                name:name,
                email:email,
                password:hashedPassword,
                cart:{items:[]}
            });
            return newUser.save();
        })
            .then(()=>{
                Mail.findOne()
                    .select("title html properties")
                    .then((mail)=>{
                        System.findOne()
                        .select("sgMail mail")
                        .then(apikey=>{
                            const msg = {                
                                to: email,
                                from: apikey.mail,
                                subject: mail.title,
                                html: mail.html,
                                }
    
                                sgMail
                            .send(msg)
                            console.log(email);
                            console.log(apikey.mail);
                            res.redirect("/login?action=registered");
    
                        }).catch(err => next(err));  
                
                    }).catch(err => next(err));          
    
            })
            .catch(err=>{
                if(err.name=="ValidationError"){
                    let message="";
                    for(field in err.errors){
                        message+=err.errors[field].message+"<br/>";
                    }
                    res.render("account/register",{
                        path:"/register",
                        title:"Register",
                        errorMessage:message
                    })
                }else{
                    next(err);
                }
            })
        }

    }).catch(err=>{
        if(err.name=="ValidationError"){
            let message="";
            for(field in err.errors){
                message+=err.errors[field].message+"<br/>";
            }
            res.render("account/register",{
                path:"/register",
                title:"Register",
                errorMessage:message,
                action: req.query.action
            })
        }else{
            next(err);
        }
    })
    
}


exports.getReset=(req,res,next)=>{
    var errorMessage=req.session.errorMessage;
    delete req.session.errorMessage;
    res.render("account/reset-password",{
        path:"/reset-password",
        title:"Reset Password",
        errorMessage:errorMessage,
        action: req.query.action
    }); 
}
exports.postReset=(req,res,next)=>{
    const email=req.body.email;
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect("/reset-password");
        }
        const token=buffer.toString("hex");
        User.findOne({email:email})
            .then(user=>{
                if(!user){
                    req.session.errorMessage="Mail adresi bulunamadı";
                    req.session.save(function(err) {
                        return res.redirect("/register");
                    })
                }
                user.resetToken=token;
                user.resetTokenExpiration=Date.now()+3600000;
                return user.save();
            }).then(result=>{
                Systems.findOne()
                .select("siteUrl mail")
                .then(system=>{
                const msg = {                
                    to: email, 
                    from: system.mail, 
                    subject: 'Parola Reset',
                    html: `

                        <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                        <p>
                            <a href="${system.siteUrl}/reset-password/${token}"> Reset Password </a>
                        </p>
                    `,
                    }
                    sgMail
                        .send(msg)
                        .then(()=>{
                            res.redirect("/reset-password?action=true");
                        }).catch(err=>{
                            res.redirect("/reset-password?action=false");
                            console.log(err.response.body)
                        })
                })
                .catch(err=>{
                    next(err);
                })
        });
});

    
    
}
exports.getLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        res.redirect("/");        
    })
}

exports.getNewPassword=(req,res,next)=>{
    var errorMessage=req.session.errorMessage;
    delete req.session.errorMessage;
    const token=req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration:{
        $gt:Date.now()
    }
    }).then(user=>{
        res.render("account/new-password",{
        path:"/new-password",
        title:"New Password",
        errorMessage:errorMessage,
        userId:user._id.toString(),
        passwordToken:token
        });
    }).catch(err=>{
        next(err);
    })
}

exports.postNewPassword=(req,res,next)=>{
    const newPassword=req.body.password;
    const token=req.body.passwordToken;
    const userId=req.body.userId;
    let _user;
    User.findOne(
    {   
        resetToken: token, 
        resetTokenExpiration:{$gt:Date.now()},
        _id:userId
    }).then(user=>{
        _user=user;
        return bcrypt.hash(newPassword,12);
    }).then(hashedPassword=>{
        _user.password=hashedPassword;
        _user.resetToken=undefined;
        _user.resetTokenExpiration=undefined;
        return _user.save();
    }).then(()=>{
        res.redirect("/login?action=success");
    }).catch(err=>{
        console.log(err);
    })

}

exports.getAddProduct = (req, res, next) => {                        
        res.render('shop/contactus', {
            title: 'Contact',
            path: '/shop/contactus',
            inputs:{
                name:"",
                mail:"",
                subject:"",
                message:""
            }      
        });
    
}
