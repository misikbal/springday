const Product = require('../model/product');
const Category = require('../model/category');
const Systems = require('../model/system');
const Logo = require('../model/logo');
const Themes = require('../model/themes');
const Client = require('../model/client');
const Services = require('../model/shortservices');
const SocialMedia = require('../model/socialmedia');
const Contact=require("../model/contactus");
const User=require("../model/user");
const AboutServices = require('../model/aboutservices');
const Project = require('../model/project');
const Process = require('../model/process');
const Advanced = require("../model/advanced");
const Page = require("../model/page");
const About = require('../model/about');
const News = require('../model/news');
const Order = require('../model/order');
const bcrypt=require("bcrypt");
const sgMail = require('@sendgrid/mail');
const Mail = require("../model/mail");
const ActiveModule = require("../model/activemodule");


const path = require('path');



const fs=require("fs");
const sharp = require('sharp');

Systems.find()
.select("sgMail")
.then(apiKey=>{
    sgMail.setApiKey(apiKey[0].sgMail);

})

exports.getProducts = (req, res, next) => {
    Product.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .populate("categories","name -_id")
        .select("name price imageUrl userId categories date isActive popular isHome")
        .then(products => {
            res.render('admin/products', {
                title: 'Admin Products',
                products: products,
                path: '/admin/products',
                action: req.query.action
            });
        })
        .catch((err) => {
            next(err);
        });
}
exports.getTasks = (req, res, next) => {
    Product.find()
        .select("_id")
        .then(products => {
            Contact.find()
            .select("_id")
            .then(contact=>{
                User.find()
                .where({isAdmin:false})

                .then(user=>{
                    Process.find()
                    .sort({date:-1})
                    .limit(5)
                    .populate("userId","name -_id")
                    .then(process=>{
                        Advanced.find()
                        .sort({date:-1})
                        .limit(5)
                        .populate("userId","name -_id")
                        .then(advanced=>{
                        res.render('admin/home', {
                            title: 'Admin Dasboard',
                            products: products,
                            path: '/admin/',
                            contact:contact,
                            process:process,
                            advanced:advanced,
                            user:user,
                            action: req.query.action
                        });
                    })
                })

                })
            })            
        })
        .catch((err) => {
            next(err);
        });
}
exports.getThemes = (req, res, next) => {
    Themes.findOne()
            .then(themes=>{
                res.render('admin/themes', {
                    title: 'Admin Themes',
                    path: '/admin/themes',
                    themes:themes,
                    action: req.query.action
                });
            }).catch((err) => {
                next(err);
            });
            
}
exports.postEditThemes = (req, res, next) => {
    const navbarLight = req.body.navbarLight;
    const navbarDark = req.body.navbarDark;

    const infoLight = req.body.infoLight;
    const infoDark = req.body.infoDark;

    const bodyLight = req.body.bodyLight;
    const bodyDark = req.body.bodyDark;
    
    const cardLight = req.body.cardLight;
    const cardrDark = req.body.cardrDark;

    const footerLight = req.body.footerLight;
    const footerDark = req.body.footerDark;
    Themes.findOne()
        .then(themes=>{
            if(!themes){
                return res.redirect("/");
            }
            themes.navbarLight=navbarLight,
            themes.navbarDark=navbarDark,

            themes.infoLight=infoLight,
            themes.infoDark=infoDark,

            themes.bodyLight=bodyLight,
            themes.bodyDark=bodyDark,
            
            themes.cardLight=cardLight,
            themes.cardrDark=cardrDark,

            themes.footerLight=footerLight,
            themes.footerDark=footerDark,
            themes.save()  
        }).then(result=>{
            res.redirect('/admin/themes?action=edit');
        })
        .catch(err => next(err));

    
}



exports.getAddProduct = (req, res, next) => {
    Category.find()
                    .then(categories=>{
                        
                        res.render('admin/add-product', {
                            title: 'New Product',
                            path: '/admin/add-product',
                            categories:categories,
                            inputs:{
                                name:"",
                                price:"",
                                description:"",
                            }      
                        });
                    })
    
}

exports.postAddProduct =async (req, res, next) => {
    const {filename:image}=req.files.image[0];
    const name = req.body.name;
    const price = req.body.price;

    const description = req.body.description;
    const tags = req.body.tags;

    const isActive = Boolean(req.body.isActive);
    const popular = Boolean(req.body.popular);
    const isHome = Boolean(req.body.isHome);

    

    const ids = req.body.categoryids;
    if(!image){
        return res.render('admin/add-product', {
            title: 'New Product',
            path: '/admin/add-product',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                name:name,
                price:price,
                description:description,

            }      
        });
    }
    await sharp(req.files.image[0].path)
    .resize(300)
    .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .toFile(
        path.resolve(req.files.image[0].destination,'resized',image)
    )
    fs.unlinkSync(req.files.image[0].path)
    const product = new Product(
        {   
            name: name,
            price: price,
            imageUrl: image,
            description: description,
            userId:req.user,
            categories:ids,
            isActive:isActive,
            popular:popular,
            tags:tags,
            isHome:isHome
        }
    );
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:product.name+" ürününü ekledi"
        }
    )
    progress.save().then(() => {
    product.save()
        .then(() => {
            res.redirect('/admin/products?action=create');
        })
        .catch(err => {
            if(err.name=="ValidationError"){
                let message="";
                for(field in err.errors){
                    message+=err.errors[field].message+"<br/>";
                }
                res.render('admin/add-product', {
                    title: 'New Product',
                    path: '/admin/add-product',
                    errorMessage:message,
                    inputs:{
                        name:name,
                        price:price,
                        description:description,
                    }
                });
            }else{
                next(err);
            }
        
    });
});



}
exports.getEditProduct = (req, res, next) => {
    if (req.params.productid === "favicon.ico") {
        return res.status(404)
    }
    Product.findOne({_id:req.params.productid})
        
        .then(product => {
            if(!product){
                return res.redirect("/");
            }
            return product;
        })
        .then(product=>{
            Category.find()
                    .then(categories=>{
                        categories=categories.map(category=>{
                            if(product.categories){
                                product.categories.find(item=>{
                                    if(item.toString()===category._id.toString()){
                                        category.selected=true;
                                    }
                                })
                            }
                            return category
                        })
                        res.render('admin/edit-product', {
                            title: 'Edit Product',
                            path: '/admin/products',
                            product: product,
                            categories:categories
                        });
                    })
        })
        .catch(err => { next(err); });
}

exports.postEditProduct = async (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const image=req.files.image;
    const description = req.body.description;
    const tags = req.body.tags;
    const ids = req.body.categoryids;    
    const isActive = Boolean(req.body.isActive);
    const popular = Boolean(req.body.popular);
    const isHome = Boolean(req.body.isHome);
    if(image){
        await sharp(req.files.image[0].path)
        .resize(300)
        .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .toFile(
            path.resolve(req.files.image[0].destination,'resized',image[0].filename)
        )
        fs.unlinkSync(req.files.image[0].path)
    }
    Product.findOne({_id:id})
        .then(product=>{
            if(!product){
                return res.redirect("/");
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:product.name+" ürününü güncelledi."
                });
                product.name=name;
                product.price=price;
                product.description=description;
                product.categories=ids;
                product.isActive=isActive;
                product.isHome=isHome;
                product.tags=tags;

                product.popular=popular;

                if (image) {
                    // fs.unlink("wwwroot/img/resized/"+product.imageUrl,err=>{
                    //     if(err){
                    //     console.log(err);
                    //     }
                    // });
                    product.imageUrl = image[0].filename;
                }
            progress.save()            
            return product.save();
            
        }).then(result=>{
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid;

    Product.findOne({_id:id})
    
        .then(product=>{
            if(!product){
                return next(new Error("Silinmek istenen ürün bulumadı."));
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:product.name+" ürününü sildi."
                });
            // fs.unlink("wwwroot/img/resized/"+product.imageUrl,err=>{
            //     if(err){
            //     console.log(err);
            //     }
            // });
            progress.save();
            return Product.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen ürün bulumadı."));
            }
            res.redirect('/admin/products?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}


exports.getAddCategory = (req, res, next) => {
    res.render('admin/add-category', {
        title: 'New Category',
        path: '/admin/add-category'
    });
}

exports.postAddCategory = async (req, res, next) => {
    const {filename:image}=req.files.categoryImg[0];

    const name = req.body.name;

    if(!image){
        return res.render('admin/add-category', {
            title: 'New Category',
            path: '/admin/add-category',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                name:name,

            }      
        });
    }
    await sharp(req.files.categoryImg[0].path)
    .resize(300)
    .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .toFile(
        path.resolve(req.files.categoryImg[0].destination,'resized',image)
    )
    // fs.unlinkSync(req.files.categoryImg[0].path)
    const category = new Category(
        {
            name:name,
            categoryImg:image,
            userId:req.user,

        }
    );
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:category.name+" kategorisini ekledi"
        }
    )
    progress.save().then(() => {

    category.save()
        .then(() => {
            res.redirect('/admin/categories?action=create');
        })
        .catch(err => {
            if(err.name=="ValidationError"){
                let message="";
                    for(field in err.errors){
                        message+=err.errors[field].message+"<br/>";
                    }
                    res.render('admin/add-category', {
                        title: 'New Category',
                        path: '/admin/add-category',
                        errorMessage:message,
                        inputs:{
                            name:name,
                        }
                    });
            } 
            else{
                next(err);
            }        
        });
    });

}

exports.getCategories = (req, res, next) => {

    Category.find()
        .populate("userId","name -_id")
        .select("name categoryImg date")
        .sort({date:-1})        
        .then(categories => {
            res.render('admin/categories', {
                title: 'Categories',
                path: '/admin/categories',
                categories: categories,
                action: req.query.action
            });
        }).catch(err => console.log(err));
}


exports.getEditCategory = (req, res, next) => {
    if (req.params.categoryid === "favicon.ico") {
        return res.status(404)
    }
    Category.findById(req.params.categoryid)
        
        .then(category => {
            
            res.render('admin/edit-category', {
                title: 'Edit Category',
                path: '/admin/categories',
                category: category
            })
            
        })
        .catch(err => next(err));
}

exports.postEditCategory = async (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const image = req.files.categoryImg;
    if(image){
        await sharp(req.files.categoryImg[0].path)
        .resize(300)
        .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .toFile(
            path.resolve(req.files.categoryImg[0].destination,'resized',image[0].filename)
        )
        fs.unlinkSync(req.files.categoryImg[0].path)
    }
    Category.findOne({_id:id})    
        .then(category=>{
            if(!category){
                return res.redirect("/");
            }
            category.name=name;
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:category.name+" kategorisini güncelledi."
            });
            if (image) {
                fs.unlink("wwwroot/img/resized/"+category.categoryImg,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                category.categoryImg = image[0].filename;
            }
            progress.save()
            return category.save();
        }).then(result=>{
            res.redirect('/admin/categories?action=edit');
        })
        .catch(err => next(err));
}



exports.postDeleteCategory = (req, res, next) => {

    const id = req.body.categoryid;
    
    Category.findOne({_id:id})
        .then((category) => {
            if(!category){
                return next(new Error("Silinmek istenen kategori bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+category.categoryImg,err=>{
                if(err){
                console.log(err);
                }
            });            
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:category.name+" kategorisini sildi."
                });
                
                progress.save()
            return Category.deleteOne({_id:id});
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen kategori bulunmadı."));
            }
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err => {
            next(err);
        });
}
exports.getMainMode = (req, res, next) => {
    Systems.findOne()
        .select("mainMode")
        .then(system => {
            res.render('layouts/mainMode', {
                title: 'Bakım Var',
                path: '/mainMode',
                system: system,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}

exports.getSystems = (req, res, next) => {
    Systems.findOne()
        .select("siteUrl language mainMode phone mail address googlemaps sgMail tawktoscript")
        .then(system => {
            res.render('admin/system', {
                title: 'Admin system',
                path: '/admin/system',
                system: system,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}

exports.postEditSystems = (req, res, next) => {
    const siteUrl = req.body.siteUrl;
    const language = req.body.language;
    const mainMode = Boolean(req.body.mainMode);
    const phone = req.body.phone;
    const mail = req.body.mail;
    const address = req.body.address;
    const googlemaps=req.body.googlemaps;
    const tawktoscript=req.body.tawktoscript;


    Systems.findOne()
        .then(system=>{
            if(!system){
                return res.redirect("/");
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:"Genel Ayaları güncelledi."
                });

            system.siteUrl=siteUrl,
            system.language=language,
            system.mainMode=mainMode,
            system.phone=phone,
            system.mail=mail,
            system.address=address,
            system.userId=req.user,
            system.googlemaps=googlemaps,
            system.tawktoscript=tawktoscript
            progress.save()
            system.save()  
        }).then(result=>{
            res.redirect('/admin/system?action=edit');
        })
        .catch(err => next(err));

    
}


exports.getLogo = (req, res, next) => {
    Logo.findOne()
        .select("logo favico footerLogo")
        .then(logo => {
            res.render('admin/logo', {
                title: 'Admin Logo',
                path: '/admin/logo',
                logo: logo,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}


exports.postEditLogo = (req, res, next) => {
    const file = req.files;
    Logo.findOne()
        .then(logoSetting=>{
            if (file.logo) {
                fs.unlink("wwwroot/img/"+logoSetting.logo,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                logoSetting.logo = file.logo[0].filename;
            }
            else if (file.favico) {
                fs.unlink("wwwroot/img/"+logoSetting.favico,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                logoSetting.favico = file.favico[0].filename;
            }
            else if (file.footerLogo) {
                fs.unlink("wwwroot/img/"+logoSetting.footerLogo,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                logoSetting.footerLogo = file.footerLogo[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:"Logo Ayarlarını güncelledi."
                });
            progress.save();
            return logoSetting.save()  
        }).then(result=>{
            res.redirect('/admin/logo?action=edit');
        })
        .catch(err => next(err));
}

exports.getSocialMedia = (req, res, next) => {
    SocialMedia.findOne()
        .then(social => {
            res.render('admin/social', {
                title: 'Admin Social',
                path: '/admin/social',
                social: social,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}

exports.postEditSocialMedia = (req, res, next) => {
    const facebook = req.body.facebook;
    const instagram = req.body.instagram;
    const twitter = req.body.twitter;
    const linkedin = req.body.linkedin;
    const youtube = req.body.youtube;
    const userId=req.user;
    SocialMedia.findOne()
        .then(social=>{
            if(!social){
                return res.redirect("/");
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:"Sosyal Medya Ayarlarını güncelledi."
                });
            progress.save();
            social.facebook=facebook,
            social.instagram=instagram,
            social.twitter=twitter,
            social.linkedin=linkedin,
            social.youtube=youtube,
            social.userId=userId,
            social.save()  
        }).then(result=>{
            res.redirect('/admin/social?action=edit');
        })
        .catch(err => next(err));

    
}


// exports.getAddLogo = (req, res, next) => {
//     res.render('admin/add-logo', {
//         title: 'New Category',
//         path: '/admin/add-logo',
//     });
// }


// exports.postAddLogo= (req, res, next) => {

//     const file = req.files
//     const homeLogo = new Logo(
//         {
//             logo:file.logo[0].filename,
//             favico:file.favico[0].filename,
//             footerLogo:file.footerLogo[0].filename,
//             userId:req.user,

//         }
        
//     );

//     homeLogo.save()
//         .then(() => {
//             res.redirect('/admin/logo?action=create');
//         })
//         .catch(err => console.log(err));
// }

exports.getClient = (req, res, next) => {
    Client.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        
        .select("name link clientlogo userId description")

        .then(client=>{
            res.render('admin/client', {
                title: 'Admin Client',
                path: '/admin/client',
                client:client,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddClient= (req, res, next) => {
    
    res.render('admin/add-client', {
        title: 'New Client',
        path: '/admin/add-client',
        inputs:{
            name:"",
            link:"",
            description:""
        }      
    });
    
}

exports.postAddClient = (req, res, next) => {

    const name = req.body.name;
    const link = req.body.link;
    const image = req.files;
    const description = req.body.description;
    const isActive = req.body.isActive;

    if(!image.image){
        return res.render('admin/add-client', {
            title: 'New Client',
            path: '/admin/add-client',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                name:name,
                link:link,
                description:description
            }      
        });
    }
    const client = new Client(
        {   
            name: name,
            link: link,
            clientlogo: image.image[0].filename,
            description: description,
            userId:req.user,
            isActive:isActive
        }
    );

    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:client.name+" referansını ekledi"
        }
    )
    progress.save().then(() => {

        client.save()
        .then(() => {
            res.redirect('/admin/client');
        })
        .catch(err => {
                next(err);
    });
    })
    
    


}

exports.getEditClient = (req, res, next) => {
    if (req.params.clientid === "favicon.ico") {
        return res.status(404)
    }
    Client.findOne({_id:req.params.clientid})
        
        .then(client => {
            if(!client){
                return res.redirect("/");
            }
            return client;
        })
        .then(client=>{
            res.render('admin/edit-client', {
                title: 'Edit Client',
                path: '/admin/client',
                client: client
            });
        })
        .catch(err => { next(err); });
}

exports.postEditClient = (req, res, next) => {

    const id = req.body.clientid;
    const name = req.body.name;
    const link = req.body.link;
    const image = req.files;
    const description = req.body.description;
    const isActive = Boolean(req.body.isActive);



    Client.findOne({_id:id})
        .then(client=>{
            if(!client){
                return res.redirect("/");
            }
            
            client.name=name;
            client.link=link;
            client.description=description;
            client.isActive=isActive;
            if (image.image) {
                fs.unlink("wwwroot/img/"+client.clientlogo,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                client.clientlogo = image.image[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:client.name+" referansını güncelledi."
            });

            progress.save()
            return client.save();
        }).then(result=>{
            res.redirect('/admin/client?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteClient = (req, res, next) => {

    const id = req.body.clientid;

    Client.findOne({_id:id})
        .then(client=>{
            if(!client){
                return next(new Error("Silinmek istenen müşteri bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+client.clientlogo,err=>{
                if(err){
                console.log(err);
                }
            });
            
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:client.name+" referansını sildi."
                });
            progress.save()
            return Client.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen müşteri bulunmadı."));
            }
            res.redirect('/admin/client?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}




exports.getServices = (req, res, next) => {
    Services.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(services=>{
            res.render('admin/services', {
                title: 'Admin Services',
                path: '/admin/services',
                services:services,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddServices= (req, res, next) => {
    
    res.render('admin/add-services', {
        title: 'New Services',
        path: '/admin/add-services',
        inputs:{
            name:"",
            description:""
        }      
    });
    
}

exports.postAddServices = (req, res, next) => {

    const name = req.body.name;
    const icon = req.body.icon;
    const description = req.body.description;
    const isActive = req.body.isActive;

    const services = new Services(
        {   
            name: name,
            icon: icon,
            description: description,
            userId:req.user,
            isActive:isActive
        }
    );

    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:services.name+" servisini ekledi"
        }
    )
    progress.save().then(() => {
        services.save()
        .then(() => {
            res.redirect('/admin/services');
        })
        .catch(err => {
                next(err);
    });

    })   

}

exports.getEditServices = (req, res, next) => {
    if (req.params.serviceid === "favicon.ico") {
        return res.status(404)
    }
    Services.findOne({_id:req.params.serviceid})
        
        .then(services => {
            if(!services){
                return res.redirect("/");
            }
            return services;
        })
        .then(services=>{
            res.render('admin/edit-services', {
                title: 'Edit Services',
                path: '/admin/services',
                services: services
            });
        })
        .catch(err => { next(err); });
}

exports.postEditServices = (req, res, next) => {

    const id = req.body.serviceid;
   
    const name = req.body.name;
    const icon = req.body.icon;
    const description = req.body.description;
    const isActive = req.body.isActive;


    Services.findOne({_id:id})
        .then(serivces=>{
            if(!serivces){
                return res.redirect("/");
            }
            
            serivces.name=name;
            serivces.icon=icon;
            serivces.description=description;
            serivces.isActive=isActive;
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:serivces.name+" servisini güncelledi."
            });
            progress.save()
            return serivces.save();
        }).then(result=>{
            res.redirect('/admin/services?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteServices = (req, res, next) => {

    const id = req.body.serviceid;

    Services.findOne({_id:id})
        .then(services=>{
            if(!services){
                return next(new Error("Silinmek istenen servis bulunmadı."));
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:services.name+" servisini sildi."
                });
            progress.save()
            return services.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen servis bulunmadı."));
            }
            res.redirect('/admin/services?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}


exports.getContact = (req, res, next) => {
    Contact.find()
        .then(contact=>{
            res.render('admin/contact', {
                title: 'Admin contact',
                path: '/admin/contact',
                contact:contact,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}

exports.getContactDetail = (req, res, next) => {
    if (req.params.contactid === "favicon.ico") {
        return res.status(404)
    }
    Contact.findById(req.params.contactid)

    .then(contact=>{
                res.render("admin/contact-details",{
                    title:"Mail Details",
                    contact:contact,
                    path:"/admin/contact",
                });
                    
    }).catch((err)=>{
        next(err);
    });
}

exports.postDeleteContact = (req, res, next) => {

    const id = req.body.contactid;

    Contact.findOne({_id:id})
        .then(contact=>{
            if(!contact){
                return next(new Error("Silinmek istenen mesaj bulunmadı."));
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:contact.mail+'un'+ contact.subject+ "konulu gönderdiği mesajı sildi."
                });
            progress.save()
            return contact.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen mesaj bulunmadı."));
            }
            res.redirect('/admin/contact?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}




exports.getAboutServices = (req, res, next) => {
    AboutServices.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(aboutservices=>{
            res.render('admin/aboutservices', {
                title: 'Admin About Services',
                path: '/admin/aboutservices',
                aboutservices:aboutservices,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddAboutServices= (req, res, next) => {
    
    res.render('admin/add-aboutservices', {
        title: 'New About Services',
        path: '/admin/add-aboutservices',
        inputs:{
            name:"",
            description:""
        }      
    });
    
}

exports.postAddAboutServices = (req, res, next) => {

    const name = req.body.name;
    const imageUrl = req.files;
    const description = req.body.description;
    const isActive = Boolean(req.body.isActive);
    if(!imageUrl.servicesImg){
        return res.render('admin/add-aboutservices', {
            title: 'New About Services',
            path: '/admin/add-aboutservices',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                name:name,
                description:description,

            }      
        });
    }
    const aboutservices = new AboutServices(
        {   
            name: name,
            imageUrl:imageUrl.servicesImg[0].filename,
            description: description,
            userId:req.user,
            isActive:isActive
        }
    );
    
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:aboutservices.name+" hizmetini ekledi"
        }
    )
    progress.save().then(() => {

        aboutservices.save()
        .then(() => {
            res.redirect('/admin/aboutservices');
        })
        .catch(err => {
                next(err);
    });
    });
}

exports.getEditAboutServices = (req, res, next) => {
    if (req.params.aboutserviceid === "favicon.ico") {
        return res.status(404)
    }
    AboutServices.findOne({_id:req.params.aboutserviceid})
        
        .then(aboutservices => {
            if(!aboutservices){
                return res.redirect("/");
            }
            return aboutservices;
        })
        .then(aboutservices=>{
            res.render('admin/edit-aboutservices', {
                title: 'Edit About Services',
                path: '/admin/aboutservices',
                aboutservices: aboutservices
            });
        })
        .catch(err => { next(err); });
}

exports.postEditAboutServices = (req, res, next) => {

    const id = req.body.aboutserviceid;
    const name = req.body.name;
    const imageUrl = req.files;
    const description = req.body.description;
    const isActive =  Boolean(req.body.isActive);


    AboutServices.findOne({_id:id})
        .then(aboutservices=>{
            if(!aboutservices){
                return res.redirect("/");
            }
            
            aboutservices.name=name;
            aboutservices.description=description;
            aboutservices.isActive=isActive;
            if (imageUrl.servicesImg) {
                fs.unlink("wwwroot/img/"+aboutservices.imageUrl,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                aboutservices.imageUrl = imageUrl.servicesImg[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:aboutservices.name+" hizmetini güncelledi."
            });

            progress.save()
            return aboutservices.save();
        }).then(result=>{
            res.redirect('/admin/aboutservices?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteAboutServices = (req, res, next) => {

    const id = req.body.aboutserviceid;

    AboutServices.findOne({_id:id})
        .then(aboutservices=>{
            if(!aboutservices){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+aboutservices.imageUrl,err=>{
                if(err){
                console.log(err);
                }
            });
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:aboutservices.name+" hizmetini sildi."
                });
            progress.save()
            return aboutservices.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            res.redirect('/admin/aboutservices?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}





exports.getProject = (req, res, next) => {
    Project.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(project=>{
            res.render('admin/project', {
                title: 'Admin About Project',
                path: '/admin/project',
                project:project,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddProject= (req, res, next) => {
    
    res.render('admin/add-project', {
        title: 'New Project',
        path: '/admin/add-project',    
    });
    
}

exports.postAddProject = (req, res, next) => {

    const name = req.body.name;
    const image = req.files;
    const description = req.body.description;
    const isActive = Boolean(req.body.isActive);
    if(!image.projectImg){
        return res.render('admin/add-project', {
            title: 'New Project',
            path: '/admin/add-project',
            errorMessage:"Lüften bir resim seçiniz",
        });
    }
    const project = new Project(
        {   
            name: name,
            imageUrl:image.projectImg[0].filename,
            description: description,
            userId:req.user,
            isActive:isActive
        }
    );
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:project.name+" projesini ekledi"
        }
    )
    progress.save().then(() => {
        project.save()
        .then(() => {
            res.redirect('/admin/project');
        })
        .catch(err => {
                next(err);
    });
    })

    


}

exports.getEditProject = (req, res, next) => {
    if (req.params.projectid === "favicon.ico") {
        return res.status(404)
    }
    Project.findOne({_id:req.params.projectid})
        
        .then(project => {
            if(!project){
                return res.redirect("/");
            }
            return project;
        })
        .then(project=>{
            res.render('admin/edit-project', {
                title: 'Edit Project',
                path: '/admin/project',
                project: project
            });
        })
        .catch(err => { next(err); });
}

exports.postEditProject = (req, res, next) => {

    const id = req.body.projectid;
    const name = req.body.name;
    const imageUrl = req.files;
    const description = req.body.description;
    const descimg = req.files;

    const isActive =  Boolean(req.body.isActive);


    Project.findOne({_id:id})
        .then(project=>{
            if(!project){
                return res.redirect("/");
            }
            
            project.name=name;
            project.description=description;
            project.isActive=isActive;
            if (imageUrl.projectImg) {
                fs.unlink("wwwroot/img/"+project.imageUrl,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                project.imageUrl = imageUrl.projectImg[0].filename;
            }
            if(descimg.image){
                fs.unlink("wwwroot/img/"+project.description,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                project.description = descimg.image[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:project.name+" projesini güncelledi."
            });

            progress.save()
            return project.save();
        }).then(result=>{
            res.redirect('/admin/project?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteProject = (req, res, next) => {

    const id = req.body.projectid;

    Project.findOne({_id:id})
        .then(project=>{
            if(!project){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+project.imageUrl,err=>{
                if(err){
                console.log(err);
                }
            });
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:project.name+" projesini sildi."
            });
            progress.save()
            return project.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            res.redirect('/admin/project?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}
exports.getPage = (req, res, next) => {
    Page.findOne()
        .then(page => {
            res.render('admin/page', {
                title: 'Admin Page Settings',
                path: '/admin/page',
                page: page,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}

exports.postEditPage = (req, res, next) => {
    const home = req.body.home;
    const products = req.body.products;
    const services = req.body.services;
    const about = req.body.about;
    const project = req.body.project;
    const client = req.body.client;
    const contact = req.body.contact;

    const cart=req.body.cart;
    const user=req.body.user;


    Page.findOne()
        .then(pages=>{
            if(!pages){
                return res.redirect("/");
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:"Sayfa Ayalarını güncelledi."
                });

            pages.home=home,
            pages.products=products,
            pages.services=services,
            pages.about=about,
            pages.project=project,
            pages.client=client,
            pages.contact=contact,
            pages.cart=cart,
            pages.user=user
            progress.save()
            pages.save()  
        }).then(result=>{
            res.redirect('/admin/page?action=edit');
        })
        .catch(err => next(err));

    
}



exports.getAbout = (req, res, next) => {
    About.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(about=>{
            res.render('admin/about', {
                title: 'Admin About Page',
                path: '/admin/about',
                about:about,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddAbout= (req, res, next) => {
    
    res.render('admin/add-about', {
        title: 'New About Page',
        path: '/admin/add-about',
        inputs:{
            name:"",
            description:""
        }      
    });
    
}

exports.postAddAbout = (req, res, next) => {

    const name = req.body.name;
    
    const description = req.body.description;
    const isActive = Boolean(req.body.isActive);
    const isHome = Boolean(req.body.isHome);

    const about = new About(
        {   
            name: name,
            description: description,
            userId:req.user,
            isActive:isActive,
            isHome:isHome
        }
    );
    
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:about.name+" başlıklı bilgiyi hakkımızda sayfasına ekledi"
        }
    )
    progress.save().then(() => {

        about.save()
        .then(() => {
            res.redirect('/admin/about?action=create');
        })
        .catch(err => {
                next(err);
    });
    });
}

exports.getEditAbout = (req, res, next) => {
    if (req.params.aboutid === "favicon.ico") {
        return res.status(404)
    }
    About.findOne({_id:req.params.aboutid})
        
        .then(about => {
            if(!about){
                return res.redirect("/");
            }
            return about;
        })
        .then(about=>{
            res.render('admin/edit-about', {
                title: 'Edit About Page',
                path: '/admin/about',
                about: about
            });
        })
        .catch(err => { next(err); });
}

exports.postEditAbout = (req, res, next) => {

    const id = req.body.aboutid;
    const name = req.body.name;
    const description = req.body.description;
    const isActive =  Boolean(req.body.isActive);
    const isHome =  Boolean(req.body.isHome);



    About.findOne({_id:id})
        .then(about=>{
            if(!about){
                return res.redirect("/");
            }
            
            about.name=name;
            about.description=description;
            about.isActive=isActive;
            about.isHome=isHome;

            
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:"Hakkımızda sayfasındaki  "+about.name+" başlıklı bilgiyi güncelledi."
            });

            progress.save()
            return about.save();
        }).then(result=>{
            res.redirect('/admin/about?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteAbout = (req, res, next) => {

    const id = req.body.aboutid;

    About.findOne({_id:id})
        .then(about=>{
            if(!about){
                return next(new Error("Silinmek istenilen bulunmadı."));
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:about.name+" başlıklı bilgiyi hakkımızda sayfasından sildi."
                });
            progress.save()
            return about.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenilen bulunmadı."));
            }
            res.redirect('/admin/about?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}




exports.getNews = (req, res, next) => {
    News.find()
        .sort({newsdate:1})
        .populate("userId","name -_id")
        .then(news=>{
            res.render('admin/news', {
                title: 'Admin News',
                path: '/admin/news',
                news:news,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddNews= (req, res, next) => {
    
    res.render('admin/add-news', {
        title: 'New News',
        path: '/admin/add-nwes',    
    });
    
}

exports.postAddNews = (req, res, next) => {

    const title = req.body.title;
    const image = req.files;
    const description = req.body.description;
    const newsdate = req.body.newsdate;

    const isActive = Boolean(req.body.isActive);
    if(!image.newsImg){
        return res.render('admin/add-news', {
            title: 'New News',
            path: '/admin/add-news',
            errorMessage:"Lüften bir resim seçiniz",
        });
    }
    const news = new News(
        {   
            title: title,
            imageUrl:image.newsImg[0].filename,
            description: description,
            userId:req.user,
            newsdate:newsdate,
            isActive:isActive
        }
    );
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:news.title+" başlıklı gönderi ekledi"
        }
    )
    progress.save().then(() => {
        news.save()
        .then(() => {
            res.redirect('/admin/news');
        })
        .catch(err => {
                next(err);
    });
    })

    


}

exports.getEditNews = (req, res, next) => {
    if (req.params.newsid === "favicon.ico") {
        return res.status(404)
    }
    News.findOne({_id:req.params.newsid})
        
        .then(news => {
            if(!news){
                return res.redirect("/");
            }
            return news;
        })
        .then(news=>{
            res.render('admin/edit-news', {
                title: 'Edit News',
                path: '/admin/news',
                news: news
            });
        })
        .catch(err => { next(err); });
}

exports.postEditNews = (req, res, next) => {

    const id = req.body.newsid;
    const title = req.body.title;
    const imageUrl = req.files;
    const description = req.body.description;
    const newsdate =  req.body.newsdate;

    const isActive =  Boolean(req.body.isActive);


    News.findOne({_id:id})
        .then(news=>{
            if(!news){
                return res.redirect("/");
            }
            
            news.title=title;
            news.description=description;
            news.newsdate=newsdate;

            news.isActive=isActive;
            if (imageUrl.newsImg) {
                fs.unlink("wwwroot/img/"+news.imageUrl,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                news.imageUrl = imageUrl.newsImg[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:news.title+" başlıklı gönderiyi güncelledi."
            });

            progress.save()
            return news.save();
        }).then(result=>{
            res.redirect('/admin/news?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteNews= (req, res, next) => {

    const id = req.body.newsid;

    News.findOne({_id:id})
        .then(news=>{
            if(!news){
                return next(new Error("Silinmek istenen gönderi bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+news.imageUrl,err=>{
                if(err){
                console.log(err);
                }
            });
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:news.title+" başlıklı gönderiyi sildi."
            });
            progress.save()
            return news.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen gönderi bulunmadı."));
            }
            res.redirect('/admin/news?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}



exports.getProcess = (req, res, next) => {
    Process.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(process=>{
            res.render('admin/process', {
                title: 'Admin Process',
                path: '/admin/process',
                process:process,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}

exports.getAdvanced = (req, res, next) => {
    Advanced.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(advanced=>{
            res.render('admin/advanced', {
                title: 'Admin Advanced',
                path: '/admin/advanced',
                advanced:advanced,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}

exports.getUsers = (req, res, next) => {
    User.find({isLimited:false})
        .where({isAdmin:false})
        .sort({date:-1})
        .then(users=>{
            res.render('admin/users', {
                title: 'Admin Users List',
                path: '/admin/users',
                users:users,
                action: req.query.action
            });
        }).catch((err) => {
            next(err);
        });
        
}
exports.getUser = (req, res, next) => {
    if (req.params.userid === "favicon.ico") {
        return res.status(404)
    }
    Order
    .find({"user.userId":req.params.userid})
    .then(orders=>{
            res.render("admin/order-history", {
                title: "Admin Order History",
                path: '/order-history',
                orders:orders
            });
        
    })
    .catch(err=>{next(err)})
}




exports.getAdmin = (req, res, next) => {
    User.find()
        .where({isAdmin:true})
        .then(admin=>{
            User.find()
            .where({isLimited:true})
            .then(limited=>{
                res.render('admin/alladmin', {
                    title: 'Admin Settings',
                    path: '/admin/alladmin',
                    admin:admin,
                    limited:limited,
                    action: req.query.action
                });
            })

        }).catch((err) => {
            next(err);
        });
        
}



exports.getAddAdmin= (req, res, next) => {
    var errorMessage=req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('admin/add-admin', {
        title: 'New Admin',
        path: '/admin/add-admin',
        errorMessage:errorMessage    
    });
    
}

exports.postAddAdmin = (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const isAdmin = Boolean(req.body.isAdmin);
    const isLimited = Boolean(req.body.isLimited);
    User.findOne({email:email})
        .then(user=>{
            if(user){
                req.session.errorMessage="Bu mail adresi ile daha önce kayıt olunmuş.";
                req.session.save(function(err) {
                    console.log(err);
                    return res.redirect("/admin/add-admin");
                })
            }
            return bcrypt.hash(password,12);            
        })
        .then(hashedPassword=>{
            
            const newUser=new User({                
                name:name,
                email:email,
                password:hashedPassword,
                cart:{items:[]},
                isAdmin:isAdmin,
                isLimited:isLimited
            });
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"insert",
                    name:newUser.name+" isimli admini ekledi"
                }
            )
            progress.save()
            return newUser.save();
        }).then(()=>{
            Mail.findOne()
                .select("title from html properties")
                .then((mail)=>{
                    Systems.find()
                    .select("sgMail")
                    .then(apikey=>{
                        res.redirect("/admin/alladmin?action=create");
                        const msg = {                
                            to: email,
                            from: mail.from,
                            subject: mail.title,
                            html: mail.html,
                            }

                            sgMail
                        .send(msg)
                    }).catch(err => next(err));  
            
                }).catch(err => next(err));          

        })
        .catch(err=>{
            if(err.name=="ValidationError"){
                let message="";
                for(field in err.errors){
                    message+=err.errors[field].message+"<br/>";
                }
                res.render("admin/add-admin",{
                    path:"/admin/add-admin",
                    title:"Add Admin",
                    errorMessage:message
                })
            }else{
                next(err);
            }
        })     
    
    


}

exports.getEditAdmin = (req, res, next) => {
    if (req.params.adminid === "favicon.ico") {
        return res.status(404)
    }
    User.findOne({_id:req.params.adminid})
        
        .then(user => {
            if(!user){
                return res.redirect("/");
            }
            return user;
        })
        .then(user=>{
            res.render('admin/edit-admin', {
                title: 'Edit Admin',
                path: '/admin/alladmin',
                user: user
            });
        })
        .catch(err => { next(err); });
}

exports.postEditAdmin = (req, res, next) => {

    const id = req.body.adminid;
    const email = req.body.email;
    const name = req.body.name;
    
    const password = req.body.password;
    const isAdmin = Boolean(req.body.isAdmin);
    const isLimited = Boolean(req.body.isLimited);
    let _user;
    User.findOne({_id:id})
        .then(user=>{
            if(!user){
                return res.redirect("/");
            }
            _user=user
            return bcrypt.hash(password,12)
        })
        .then(hashedPassword=>{

        
            _user.email=email;
            _user.name=name;
            _user.password=hashedPassword;
            _user.isAdmin=isAdmin;
            _user.isLimited=isLimited;
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:_user.name+" isimli kısıtlı admini güncelledi."
            });

            progress.save()
            return _user.save();
        }).then(result=>{
            res.redirect('/admin/alladmin?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteAdmin= (req, res, next) => {

    const id = req.body.adminid;

    User.findOne({_id:id})
        .then(admin=>{
            if(!admin){
                return next(new Error("Silinmek istenilen admin bulunmadı."));
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:admin.name+" isimli admini sildi."
            });
            progress.save()
            return admin.deleteOne({_id:id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen admin bulunmadı."));
            }
            res.redirect('/admin/alladmin?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}


exports.getActiveModule= (req, res, next) => {
    ActiveModule.findOne()
        .then(active => {
            res.render('admin/activemodule', {
                title: 'Admin Active Module',
                path: '/admin/activemodule',
                active: active,
                action: req.query.action
            });
        })
        
        .catch((err) => {
            next(err);
        });
}

exports.postEditActiveModule= (req, res, next) => {
    const contactnavbar_isActive = Boolean(req.body.contactnavbar_isActive);
    const whatsapp_isActive = Boolean(req.body.whatsapp_isActive);
    const tawkto_isActive = Boolean(req.body.tawkto_isActive);
    const darkmode_isActive = Boolean(req.body.darkmode_isActive);
    const translate_isActive = Boolean(req.body.translate_isActive);
    const ecommarce_isActive = Boolean(req.body.ecommarce_isActive);
    const isNavbar = Boolean(req.body.isNavbar);




    ActiveModule.findOne()
        .then(active=>{
            if(!active){
                return res.redirect("/");
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:"Modül Ayalarını güncelledi."
                });

            active.contactnavbar_isActive=contactnavbar_isActive,
            active.whatsapp_isActive=whatsapp_isActive,
            active.tawkto_isActive=tawkto_isActive,
            active.darkmode_isActive=darkmode_isActive,
            active.translate_isActive=translate_isActive,
            active.ecommarce_isActive=ecommarce_isActive,
            active.isNavbar=isNavbar
            progress.save()
            active.save()  
        }).then(result=>{
            res.redirect('/admin/activemodule?action=edit');
        })
        .catch(err => next(err));

    
}

exports.getOrders = (req, res, next) => {
    Order
    .find()
    .sort({date:-1})

    .then(orders=>{
            res.render("admin/orders", {
                title: "Ordrers",
                path: '/admin/orders',
                orders:orders
            });
        
    })
    .catch(err=>{next(err)})

    
}


exports.getOrder = (req, res, next) => {
    const id =req.params.orderid;
    Order
    .findOne({_id:id})
    .sort({date:-1})

    .then(orders=>{
            res.render("admin/order", {
                title: "Order",
                path: '/admin/orders',
                orders:orders
            });
        
    })
    .catch(err=>{next(err)})

    
}

exports.postOrders = (req, res, next) => {
    const id=req.body.orderid;
    const approval=Boolean(req.body.approval);
    const cargo=Boolean(req.body.cargo);
    const done=Boolean(req.body.done);
    const cargocompany=req.body.cargocompany;
    const cargonumber=req.body.cargonumber;

    Order.findOne({_id:id})
    .updateOne({approval:approval,cargo:cargo,done:done,cargocompany:cargocompany,cargonumber:cargonumber})
        .then(()=>{
            res.redirect("/admin/orders")
        })
        .catch(err=>{next(err)});

        
}