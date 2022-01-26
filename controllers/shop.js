const Product = require("../model/product");
const Category=require("../model/category");
const Order=require("../model/order");
const System=require('../model/system');
const Contact=require('../model/contactus')
const Bank = require('../model/bank');
const Post = require('../model/post');





exports.getIndex = async (req, res, next) => {
    Post.find({$or: [{type:"project"} , {type:"aboutservices"}, {type:"shortservices"},{type:"slide"}]})
        .sort({date:-1})
        .where({isActive:true})
        .select("slide.image slide.title slide.description slide.buttonName slide.buttonLink slide.animate shortservices.icon shortservices.name shortservices.description aboutservices.name aboutservices.imageUrl project.name project.imageUrl url type isHome")
        .lean()
        .then(posts=>{
        Product.find({isHome:true})
            .where({isActive:true})
            .sort({date:-1})
            .populate("categories.0",{"_id":{"$slice":1}})
            .select(['-description',"-date","-userId","-__v","-tags"])
            .lean()
            .then(products=>{
                return products;
            }).then((products) => {
                Category.find()
                .where({isActive:true})
                .sort("name")
                .lean()
                .then(categories=>{
                    return categories;
                }).then((categories)=>{ 
                            
                            res.render("shop/index", {
                                title: "Springday", 
                                products: products,
                                path: '/',
                                posts:posts,
                                categories:categories,
                                action: req.query.action
                        })
                            
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


exports.getProducts = (req, res, next) => {    
    
    Product.find()
    .where({isActive:true})
    .populate("categories.0",{"_id":{"$slice":1}})
    .select("name price imageUrl categories description isActive popular tags")
    .lean()
    .then(products=>{
        return products; 
    })
    .then(products=>{
        Category.find()
        .where({isActive:true})
            .then(categories=>{
                res.render("shop/products", {
                    title: "Products", 
                    products: products,
                    path: '/products',
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
            .lean()
            .then(products=>{
                    Product.find()
                    .where({isActive:true})
                    .where({isHome:true})

                    .then(other=>{
                        res.render("shop/product-detail",{
                            title:products.name,
                            product:products,
                            other:other,
                            path:"/products",
                            isAuthenticated:req.session.isAuthenticated
                        });
                    })
                            
            }).catch((err)=>{
                next(err);
            })
        
    
}
exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid=req.params.categoryid;
    const model=[];
    Category.find()
        .where({isActive:true})
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
                            path: `/categories/${categoryid}`,
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
                res.redirect("?action=insert");
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

exports.getOrder = (req, res, next) => {
    const id =req.params.orderid;
    Order
    .findOne({"user.userId":req.user._id,_id:id})
    .sort({date:-1})
    .lean()

    .then(orders=>{
            Bank.find()
            .where({isActive:true})
            .then(bank=>{
                res.render("shop/orders", {
                    title: "Order",
                    path: '/orders',
                    orders:orders,
                    bank:bank,
                    action: req.query.action
                });
            })
            
        
    })
    .catch(err=>{next(err)})

    
}
exports.getOrders = (req, res, next) => {
    Order
    .find({"user.userId":req.user._id})
    .sort({date:-1})
    .lean()
    .then(orders=>{
        Bank.find()
        .where({isActive:true})
        .then(allbank=>{
            res.render("shop/allorders", {
                title: "Orders",
                path: '/orders',
                orders:orders,
                allbank:allbank
            });
        });

        
    })
    .catch(err=>{next(err)})

    
}
exports.getAdress = (req, res, next) => {    
    req.user
            .populate("cart.items.productId")
            .execPopulate()
            .then(user=>{
                            res.render("shop/adress", {
                                title: "Adress",
                                path: '/create-order',
                                products:user.cart.items,
                                isAuthenticated:req.session.isAuthenticated,
                                action: req.query.action
                            });

            }).catch((err)=>{
                next(err);
            })    
    }
    
exports.postOrder = (req, res, next) => {
    const city=req.body.city;
    const district=req.body.district;
    const adress=req.body.adress;
    const name=req.body.name;
    const mail=req.body.mail;

    const phone=req.body.phone;
    const postcode=req.body.postcode;
    
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
                city:city,
                district:district,
                adress:adress,
                name:name,
                phone:phone,
                postcode:postcode,
                mail:mail,
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
                    
                }),
                
            });
            return order.save();            
        }).then(()=>{
            return req.user.clearCart();
        })
        .then(()=>{
            res.redirect(`/orders`)
        })
        .catch(err=>{next(err)});

        
}
exports.postPayment = (req, res, next) => {
    const id=req.body.orderid;
    const payment=req.body.payment;
    Order.findOne({_id:id})
    .updateOne({payment:payment})
        .then(()=>{
            res.redirect(`/orders/${id}?action=send`)
        })
        .catch(err=>{next(err)});
        
}



exports.getContact = (req, res, next) => {  
    System.findOne()
    .select("googlemaps address phone contactmail")
    .lean()
    .then(contact=>{
        res.render("shop/contactus", {
            title: "Contact Us", 
            path: '/contactus',
            contact:contact,
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
                    path: '/contactus',
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
    
    Post.find({type:"aboutservices",isActive:true})
    .sort({ date: -1})
    .select(["-aboutservices.description"])
    .lean()
    .then(aboutservices=>{
                res.render("shop/aboutservices", {
                    title: "About Services", 
                    aboutservices: aboutservices,
                    path: '/aboutservices',
                    isAuthenticated:req.session.isAuthenticated
                }) 
            })
    .catch((err)=>{
        next(err);
    });
    
}
exports.getAboutService = (req, res, next) => {
    const aboutserviceid=req.params.aboutserviceid
    Post.findOne({url:req.params.aboutserviceid,isActive:true})
    .lean()
    .then(aboutservice=>{
        Post.find({type:"aboutservices",isActive:true})
            .select("aboutservices.name url")
            .sort({ date: -1 })
            .lean()
            
            .then(allaboutservices=>{
                res.render("shop/aboutservice-detail",{
                    title:aboutservice.aboutservices.name,
                    aboutservice:aboutservice,
                    selectedCategory:aboutserviceid,
                    allaboutservices:allaboutservices,
                    path:"/aboutservices",
                });
            })
                
    }).catch((err)=>{
        next(err);
    });
}
exports.getProject = (req, res, next) => {
    const projectid=req.params.projectid
    Post.findOne({url:req.params.projectid,isActive:true})
    .lean()
    .then(project=>{
        Post.find({type:"project", isActive:true})
            .sort({ date: -1 })
            .select("project.name url")
            .lean()

            .then(allproject=>{
                res.render("shop/project-detail",{
                    title:project.project.name,
                    project:project,
                    allproject:allproject,
                    selectedCategory:projectid,
                    path:"/project",
                });
            })
    }).catch((err)=>{
        next(err);
    });
}

exports.getProjects = (req, res, next) => {    
    
    Post.find({type:"project", isActive:true})
    .sort({ date: -1 })
    .lean()
    .then(project=>{
        return project; 
    })
    .then(project=>{
                res.render("shop/project", {
                    title: "Project", 
                    project: project,
                    path: '/project',
                    isAuthenticated:req.session.isAuthenticated
                }) 
    })
    .catch((err)=>{
        next(err);
    });
    
}


exports.getAbout = (req, res, next) => {
    const aboutid=req.params.aboutid
    Post.findOne({url:aboutid,isActive:true})
    .lean()
    .then(about=>{
                res.render("shop/about-detail",{
                    title:about.about.name,
                    about:about,
                    selectedCategory:aboutid,
                    path:"/about",
                });
    }).catch((err)=>{
        next(err);
    });
}

exports.getAbouts = (req, res, next) => {    
    
    Post.findOne({type:"about",isHome:true,isHome:true})
    .lean()
    .then(viewabout=>{
        return viewabout; 
    })
    .then(viewabout=>{
        res.render("shop/about", {
            title: "About", 
            viewabout: viewabout,
            path: '/about',
            isAuthenticated:req.session.isAuthenticated
        })
    })
    .catch((err)=>{
        next(err);
    });
    
}



exports.getClient = (req, res, next) => {    
    
    Post.find({type:"client",isActive:true})
    .sort({ date: -1 })
    .lean()
    .then(client=>{
        return client; 
    })
    .then(client=>{
        res.render("shop/client", {
            title: "About", 
            client:client,
            path: '/client'
        })
    })
    .catch((err)=>{
        next(err);
    });
    
}





exports.getNews = (req, res, next) => {
    const newsid=req.params.newsid
    Post.findOne({url:newsid,isActive:true})
    .lean()
    .then(news=>{
            Post.find({type:"news"})
            .where({isActive:true})
            .lean()
            .then(allnews=>{
                res.render("shop/news-detail",{
                    title:news.news.title,
                    news:news,
                    allnews:allnews,
                    selectedCategory:newsid,
                    path:"/news",
                });
            })
    }).catch((err)=>{
        next(err);
    });
}

exports.getAllNews = (req, res, next) => {    
    
    Post.find({type:"news",isActive:true})
    .sort({newsdate:-1})
    .lean()
    .then(news=>{
        return news; 
    })
    .then(news=>{
                    res.render("shop/news", {
                        title: "News", 
                        news: news,
                        path: '/news',
                        isAuthenticated:req.session.isAuthenticated
                    })
            })
    .catch((err)=>{
        next(err);
    });
    
}
