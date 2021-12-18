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



const fs=require("fs");

exports.getProducts = (req, res, next) => {
    Product.find()
        .find({userId:req.user._id})
        .sort({date:-1})
        .populate("userId","name -_id")
        .populate("categories","name -_id")
        
        .select("name price imageUrl userId categories date isActive popular")
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
                .then(user=>{
                    res.render('admin/home', {
                        title: 'Admin Dasboard',
                        products: products,
                        path: '/admin/',
                        contact:contact,
                        user:user,
                        action: req.query.action
                    });
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

exports.postAddProduct = (req, res, next) => {

    const name = req.body.name;
    const price = req.body.price;
    const image = req.files;
    const description = req.body.description;
    const tags = req.body.tags;

    const isActive = Boolean(req.body.isActive);
    const popular = Boolean(req.body.popular);
    

    const ids = req.body.categoryids;

    console.log(image);
    if(!image.image){
        return res.render('admin/add-product', {
            title: 'New Product',
            path: '/admin/add-product',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                name:name,
                price:price,
                description:description,

                tags:tags

            }      
        });
    }
    const product = new Product(
        {   
            name: name,
            price: price,
            imageUrl: image.image[0].filename,
            description: description,
            userId:req.user,
            categories:ids,
            isActive:isActive,
            popular:popular,
            tags:tags
        }
    );

    product.save()
        .then(() => {
            res.redirect('/admin/products');
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
                        tags:tags,
                    }
                });
            }else{
                next(err);
            }
        
    });


}

exports.getEditProduct = (req, res, next) => {
    if (req.params.productid === "favicon.ico") {
        return res.status(404)
    }
    Product.findOne({_id:req.params.productid,userId:req.user._id})
        
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

exports.postEditProduct = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const image = req.files;
    const description = req.body.description;
    const ids = req.body.categoryids;    
    const isActive = Boolean(req.body.isActive);
    const popular = Boolean(req.body.popular);

    Product.findOne({_id:id,userId:req.user._id})
        .then(product=>{
            if(!product){
                return res.redirect("/");
            }
            
            product.name=name;
            product.price=price;
            product.description=description;
            product.categories=ids;
            product.isActive=isActive;
            product.popular=popular;
            if (image.image) {
                fs.unlink("wwwroot/img/"+product.imageUrl,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                product.imageUrl = image.image[0].filename;
            }
            return product.save();
        }).then(result=>{
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid;

    Product.findOne({_id:id,userId:req.user._id})
        .then(product=>{
            if(!product){
                return next(new Error("Silinmek istenen ürün bulumadı."));
            }
            fs.unlink("wwwroot/img/"+product.imageUrl,err=>{
                if(err){
                console.log(err);
                }
            });
            
            return Product.deleteOne({_id:id,userId:req.user._id})
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

exports.postAddCategory = (req, res, next) => {

    const name = req.body.name;
    const file = req.files;
    if(!file.categoryImg){
        return res.render('admin/add-category', {
            title: 'New Category',
            path: '/admin/add-category',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                name:name,

            }      
        });
    }
    const category = new Category(
        {
            name:name,
            categoryImg:file.categoryImg[0].filename,
            userId:req.user,

        }
    );

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
}

exports.getCategories = (req, res, next) => {

    Category.find()
        .find({userId:req.user._id})
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

exports.postEditCategory = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const file = req.files;
    
    Category.findOne({_id:id})    
        .then(category=>{
            if(!category){
                return res.redirect("/");
            }
            category.name=name;
            if (file.cimage) {
                fs.unlink("wwwroot/img/"+category.categoryImg,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                category.categoryImg = file.cimage[0].filename;
            }
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


// exports.getAddSystems = (req, res, next) => {
//     res.render('admin/add-system', {
//         title: 'New Category',
//         path: '/admin/add-system',
//         inputs:{
//             siteUrl:"",
//             language:"",
//             mainMode:"",
//             phone:"",
//             mail:"",
//             address:"",


//         } 
//     });
// }


// exports.postAddSystems= (req, res, next) => {

//     const siteUrl = req.body.siteUrl;
//     const language = req.body.language;
//     const mainMode = req.body.mainMode;
//     const phone = req.body.phone;
//     const mail = req.body.mail;
//     const address = req.body.address;
//     const userId=req.user._id;
//     const system = new Systems(
//         {
//             siteUrl:siteUrl,
//             language:language,
//             mainMode:mainMode,
//             phone:phone,
//             mail:mail,
//             address:address,
//             userId:userId
//         }
//     );

//     system.save()
//         .then(() => {
//             res.redirect('/admin/system?action=create');
//         })
//         .catch(err => console.log(err));
// }
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
    const mainMode = req.body.mainMode;
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
            system.siteUrl=siteUrl,
            system.language=language,
            system.mainMode=mainMode,
            system.phone=phone,
            system.mail=mail,
            system.address=address,
            system.userId=req.user,
            system.googlemaps=googlemaps,
            system.tawktoscript=tawktoscript
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
        .find({userId:req.user._id})
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

    client.save()
        .then(() => {
            res.redirect('/admin/client');
        })
        .catch(err => {
                next(err);
    });


}

exports.getEditClient = (req, res, next) => {
    if (req.params.clientid === "favicon.ico") {
        return res.status(404)
    }
    Client.findOne({_id:req.params.clientid,userId:req.user._id})
        
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
    const isActive = req.body.isActive;


    Client.findOne({_id:id,userId:req.user._id})
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
            return client.save();
        }).then(result=>{
            res.redirect('/admin/client?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteClient = (req, res, next) => {

    const id = req.body.clientid;

    Client.findOne({_id:id,userId:req.user._id})
        .then(client=>{
            if(!client){
                return next(new Error("Silinmek istenen müşteri bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+client.clientlogo,err=>{
                if(err){
                console.log(err);
                }
            });
            
            return Client.deleteOne({_id:id,userId:req.user._id})
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
        .find({userId:req.user._id})
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

    services.save()
        .then(() => {
            res.redirect('/admin/services');
        })
        .catch(err => {
                next(err);
    });


}

exports.getEditServices = (req, res, next) => {
    if (req.params.serviceid === "favicon.ico") {
        return res.status(404)
    }
    Services.findOne({_id:req.params.serviceid,userId:req.user._id})
        
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


    Services.findOne({_id:id,userId:req.user._id})
        .then(serivces=>{
            if(!serivces){
                return res.redirect("/");
            }
            
            serivces.name=name;
            serivces.icon=icon;
            serivces.description=description;
            serivces.isActive=isActive;
            return serivces.save();
        }).then(result=>{
            res.redirect('/admin/services?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteServices = (req, res, next) => {

    const id = req.body.serviceid;

    Services.findOne({_id:id,userId:req.user._id})
        .then(services=>{
            if(!services){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            
            return services.deleteOne({_id:id,userId:req.user._id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
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
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            
            return contact.deleteOne({_id:id,userId:req.user._id})
        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            res.redirect('/admin/contact?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}




exports.getAboutServices = (req, res, next) => {
    AboutServices.find()
        .find({userId:req.user._id})
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

    aboutservices.save()
        .then(() => {
            res.redirect('/admin/aboutservices');
        })
        .catch(err => {
                next(err);
    });


}

exports.getEditAboutServices = (req, res, next) => {
    if (req.params.aboutserviceid === "favicon.ico") {
        return res.status(404)
    }
    AboutServices.findOne({_id:req.params.aboutserviceid,userId:req.user._id})
        
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


    AboutServices.findOne({_id:id,userId:req.user._id})
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
            return aboutservices.save();
        }).then(result=>{
            res.redirect('/admin/aboutservices?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteAboutServices = (req, res, next) => {

    const id = req.body.aboutserviceid;

    AboutServices.findOne({_id:id,userId:req.user._id})
        .then(aboutservices=>{
            if(!aboutservices){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+aboutservices.imageUrl,err=>{
                if(err){
                console.log(err);
                }
            });
            return aboutservices.deleteOne({_id:id,userId:req.user._id})
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
        .find({userId:req.user._id})
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

    project.save()
        .then(() => {
            res.redirect('/admin/project');
        })
        .catch(err => {
                next(err);
    });


}

exports.getEditProject = (req, res, next) => {
    if (req.params.projectid === "favicon.ico") {
        return res.status(404)
    }
    Project.findOne({_id:req.params.projectid,userId:req.user._id})
        
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


    Project.findOne({_id:id,userId:req.user._id})
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
            return project.save();
        }).then(result=>{
            res.redirect('/admin/project?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteProject = (req, res, next) => {

    const id = req.body.projectid;

    Project.findOne({_id:id,userId:req.user._id})
        .then(project=>{
            if(!project){
                return next(new Error("Silinmek istenen hizmet bulunmadı."));
            }
            fs.unlink("wwwroot/img/"+project.imageUrl,err=>{
                if(err){
                console.log(err);
                }
            });
            return project.deleteOne({_id:id,userId:req.user._id})
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