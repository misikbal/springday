const Product = require("../model/product");
const Category=require("../model/category");
const Order=require("../model/order");
const mongodb=require("mongodb");
const Slide=require('../model/slide');
const Logo=require('../model/logo');
const Client=require('../model/client');
const Services=require('../model/shortservices');
const Social=require('../model/socialmedia');
const System=require('../model/system');
const Contact=require('../model/contactus');
const AboutServices = require('../model/aboutservices');
const Project = require('../model/project');

exports.getIndex = (req, res, next) => {
    
    Product.find()
        .sort({date:-1})
        .populate("categories.0",{"_id":{"$slice":1}})



        .select("name price imageUrl categories description isActive popular tags")
        .then(products=>{
            return products;
        }).then(products=>{
            Category.find().sort({date:-1})
            .then(categories=>{
                return categories;
            }).then(categories=>{
                Slide.find().sort({date:-1})     
                .then(slides=>{      
                    Client.find()
                        .select("clientlogo")
                        .then(client=>{
                            Services.find()
                            .then(services=>{
                                AboutServices.find()
                                    .then(aboutservices=>{
                                        Project.find()
                                        .then(projectinfo=>{
                                            res.render("shop/index", {
                                                title: "Springday", 
                                                products: products,
                                                slides:slides,
                                                path: '/',
                                                categories:categories,
                                                client:client,
                                                services:services,
                                                aboutservices:aboutservices,
                                                projectinfo:projectinfo
                                            })
                                        })
                                        
                                    })
                                    
                                
                            })
                            
                        });    
                    
                }) .catch((err)=>{
                    next(err);
                });
            }).catch((err)=>{
                next(err);
            });
                
        })
        .catch((err)=>{
            next(err);
        });
}

exports.getNavbar=(req, res, next) =>{
    Logo.find()
    .select("logo favico footerLogo")
    .then((logo)=>{
        res.json({
        logo: logo[0]["logo"]});

    }).catch((err)=>{
        next(err);
    });
}

exports.getProducts = (req, res, next) => {    
    
    Product.find()
    .populate("categories.0",{"_id":{"$slice":1}})
    .select("name price imageUrl categories description isActive popular tags")

    .then(products=>{
        return products; 
    })
    .then(products=>{
        Category.find()
            .then(categories=>{
                res.render("shop/products", {
                    title: "Products", 
                    products: products,
                    path: '/',
                    categories:categories,
                    isAuthenticated:req.session.isAuthenticated
                }) 
            })
    })
    .catch((err)=>{
        next(err);
    });
    
}
exports.getProduct = (req, res, next) => {
            Product.findById(req.params.productid)
            .populate("categories.0",{"_id":{"$slice":1}})

            .then(products=>{
                Client.find()
                .select("clientlogo")
                .then(client=>{
                    Product.find()
                    .then(other=>{
                        res.render("shop/product-detail",{
                            title:products.name,
                            product:products,
                            other:other,
                            client:client,
                            path:"/products",
                            isAuthenticated:req.session.isAuthenticated
                        });
                    })
                    
                })
                            
            }).catch((err)=>{
                next(err);
            });
        
    
    /*Product.findByPk(req.params.productid).then((product=>{
        res.render("shop/product-detail",{
            title:product.name,
            product:product,
            path:"/products"
        });
    })).catch((err)=>{
        console.log(err);
    });  */  
    
}
exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid=req.params.categoryid;
    const model=[];
    Category.find()
        .then(categories=>{
            model.categories=categories;
            return Product.find({
                categories:categoryid
            });
        })
        .then(products=>{
                        res.render("shop/products", {
                            title: "Products",
                            products: products,
                            categories:model.categories,
                            selectedCategory:categoryid,
                            isAuthenticated:req.session.isAuthenticated,
                            path: '/products',
                        });
        })
        .catch(err=>{
            next(err);
        })
    
}


exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then(user=>{
                        res.render("shop/cart", {
                            title: "Cart",
                            path: '/cart',
                            products:user.cart.items,
                            isAuthenticated:req.session.isAuthenticated,
                            action: req.query.action
                        });

        }).catch((err)=>{
            next(err);
        })    
}
exports.addToCart = (req, res, next) => {
    const productId=req.body.productId;
    Product.findById(productId)
            .then(product=>{
                return req.user.addToCart(product);
            })
            .then(()=>{
                res.redirect("/?action=insert");
            })
            .catch((err)=>{
                next(err);
            }) 
}
exports.postCartItemDelete = (req, res, next) => {
    const productid=req.body.productid;
    req.user        
        .deleteCartItem(productid)
        .then(()=>{
            res.redirect("/cart");
        });
}


exports.getOrders = (req, res, next) => {
    Order
    .find({"user.userId":req.user._id})
    .then(orders=>{
            res.render("shop/orders", {
                title: "Ordrers",
                path: '/orders',
                orders:orders
            });
        
    })
    .catch(err=>{next(err)})

    
}
exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then(user=>{
            const order=new Order({
                user:{
                    userId:req.user._id,
                    name:req.user.name,
                    email:req.user.email
                },
                items:user.cart.items.map(p=>{
                    return{
                        product:{
                            _id:p.productId,
                            name:p.productId.name,
                            price:p.productId.price,
                            imageUrl:p.productId.imageUrl
                        },
                        quantity:p.quantity
                    }
                })
            });
            return order.save();            
        }).then(()=>{
            return req.user.clearCart();
        })
        .then(()=>{
            res.redirect("/orders")
        })
        .catch(err=>{next(err)});

        
}




exports.getContact = (req, res, next) => {  
    System.find()
    .then(system=>{
        res.render("shop/contactus", {
            title: "Contact Us", 
            path: '/contactus',
            system:system,
            action: req.query.action
        }) 
    })
    
    
}


exports.postAddContact= (req, res, next) => {

    const name = req.body.name;
    const mail = req.body.mail;
    const subject = req.body.subject;
    const message = req.body.message;
    const contact = new Contact(
        {   
            name: name,
            mail: mail,
            subject: subject,
            message:message
        }
    );

    contact.save()
        .then(() => {
            res.redirect('/contactus?action=send');
        })
        .catch(err => {
            if(err.name=="ValidationError"){
                let message="";
                for(field in err.errors){
                    message+=err.errors[field].message+"<br/>";
                }
                res.render('shop/contactus', {
                    title: 'Contact',
                    path: '/shop/contactus',
                    errorMessage:message,
                    inputs:{
                        name: name,
                        mail: mail,
                        subject: subject,
                        message:message
                    }
                });
            }else{
                next(err);
            }
        
    });


}
exports.getAboutServices = (req, res, next) => {    
    
    AboutServices.find()

    .then(aboutservices=>{
        return aboutservices; 
    })
    .then(aboutservices=>{
        Client.find()
            .select("clientlogo")
            .then(client=>{
                res.render("shop/aboutservices", {
                    title: "About Services", 
                    aboutservices: aboutservices,
                    client:client,
                    path: '/',
                    isAuthenticated:req.session.isAuthenticated
                }) 
            })
    })
    .catch((err)=>{
        next(err);
    });
    
}
exports.getAboutService = (req, res, next) => {
    const aboutserviceid=req.params.aboutserviceid
    AboutServices.findById(req.params.aboutserviceid)

    .then(aboutservice=>{
        Client.find()
        .select("clientlogo")
        .then(client=>{
            AboutServices.find()
            .then(allservices=>{
                res.render("shop/aboutservice-detail",{
                    title:aboutservice.name,
                    aboutservice:aboutservice,
                    allservices:allservices,
                    client:client,
                    selectedCategory:aboutserviceid,
                    path:"/aboutservices",
                });
            })
        })
    }).catch((err)=>{
        next(err);
    });
}
exports.getProject = (req, res, next) => {
    const projectid=req.params.projectid
    Project.findById(req.params.projectid)

    .then(project=>{
        Client.find()
        .select("clientlogo")
        .then(client=>{
            Project.find()
            .then(allproject=>{
                res.render("shop/project-detail",{
                    title:project.name,
                    project:project,
                    allproject:allproject,
                    client:client,
                    selectedCategory:projectid,
                    path:"/project",
                });
            })
        })
    }).catch((err)=>{
        next(err);
    });
}

exports.getProjects = (req, res, next) => {    
    
    Project.find()

    .then(project=>{
        return project; 
    })
    .then(project=>{
        Client.find()
            .select("clientlogo")
            .then(client=>{
                res.render("shop/project", {
                    title: "Project", 
                    project: project,
                    client:client,
                    path: '/',
                    isAuthenticated:req.session.isAuthenticated
                }) 
            })
    })
    .catch((err)=>{
        next(err);
    });
    
}
