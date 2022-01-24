const Product = require("../model/product");
const Category = require("../model/category");
const Systems = require("../model/system");
const Contact = require("../model/contactus");
const User = require("../model/user");
const Process = require("../model/process");
const Advanced = require("../model/advanced");
const Order = require("../model/order");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const Mail = require("../model/mail");
const Bank = require("../model/bank");
const Post = require("../model/post");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

Systems.find()
.select("sgMail")
.then((apiKey) => {
    sgMail.setApiKey(apiKey[0].sgMail);
});
var slugify = function(text) {
    var trMap = {
        'çÇ':'c',
        'ğĞ':'g',
        'şŞ':'s',
        'üÜ':'u',
        'ıİ':'i',
        'öÖ':'o'
    };
    for(var key in trMap) {
        text = text.replace(new RegExp('['+key+']','g'), trMap[key]);
    }
    return  text.replace(/[^-a-zA-Z0-9\s]+/ig, '')
                .replace(/\s/gi, "-")
                .replace(/[-]+/gi, "-")
                .toLowerCase();

}
exports.getProducts = (req, res, next) => {
Product.find()
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .populate("categories", "name -_id")
    .select(
    "name price imageUrl userId categories date isActive popular isHome"
    )
    .then((products) => {
    res.render("admin/products", {
        title: "Admin Products",
        products: products,
        path: "/admin/products",
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};
exports.getTasks = (req, res, next) => {
Product.find()
    .select("_id")
    .then((products) => {
    Contact.find()
        .select("_id")
        .then((contact) => {
        User.find()
            .where({ isAdmin: false })
            .then((user) => {
            Process.find()
                .sort({ date: -1 })
                .limit(5)
                .populate("userId", "name -_id")
                .then((process) => {
                Advanced.find()
                    .sort({ date: -1 })
                    .limit(5)
                    .populate("userId", "name -_id")
                    .then((advanced) => {
                    Advanced.find()
                        .select("name")
                        .then((alladvanced) => {
                        Process.find()
                            .select("name")
                            .then((allprocess) => {
                                Category.find()
                                .select("name")
                                .then(category=>{
                                    Order.find()
                                    .select("date")
                                    .then(order=>{
                                        Order.find()
                                        .where({approval:true})
                                        .select("date")
                                        .then(approval=>{
                                            Order.find()
                                            .where({cargo:true})
                                            .select("date")
                                            .then(cargo=>{
                                                Order.find()
                                                .where({done:true})
                                                .select("date")
                                                .then(done=>{
                                                    Order.find()
                                                    .where({approval:false})
                                                    .select("date")
                                                    .then(ordercount=>{
                                                            Systems.findOne()
                                                            .select("ecommarce_isActive")
                                                            .then(ecommerce=>{
                                                                res.render("admin/home", {
                                                                    title: "Admin Dasboard",
                                                                    products: products,
                                                                    path: "/admin/",
                                                                    contact: contact,
                                                                    process: process,
                                                                    advanced: advanced,
                                                                    user: user,
                                                                    alladvanced: alladvanced,
                                                                    allprocess: allprocess,
                                                                    category:category,
                                                                    order:order,
                                                                    approval:approval,
                                                                    cargo:cargo,
                                                                    done:done,
                                                                    ordercount:ordercount,
                                                                    ecommerce:ecommerce,
                                                                    action: req.query.action,
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });         
                                });
                            });
                        });
                    });
                });
            });
        });
    })
    .catch((err) => {
    next(err);
    });
};
exports.getThemes = (req, res, next) => {
Systems.findOne()
    .select("bodyDark bodyLight cardLight cardrDark footerDark footerLight infoDark infoLight navbarDark navbarLight")
    .then((themes) => {
    res.render("admin/themes", {
        title: "Admin Themes",
        path: "/admin/themes",
        themes: themes,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};
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
Systems.findOne()
    .select("bodyDark bodyLight cardLight cardrDark footerDark footerLight infoDark infoLight navbarDark navbarLight")

    .then((themes) => {
    if (!themes) {
        return res.redirect("/");
    }
    (themes.navbarLight = navbarLight),
        (themes.navbarDark = navbarDark),
        (themes.infoLight = infoLight),
        (themes.infoDark = infoDark),
        (themes.bodyLight = bodyLight),
        (themes.bodyDark = bodyDark),
        (themes.cardLight = cardLight),
        (themes.cardrDark = cardrDark),
        (themes.footerLight = footerLight),
        (themes.footerDark = footerDark),
        themes.save();
    })
    .then((result) => {
    res.redirect("/admin/themes?action=edit");
    })
    .catch((err) => next(err));
};

exports.getAddProduct = (req, res, next) => {
Category.find()
    .where({ isActive: true })
    .then((categories) => {
    res.render("admin/add-product", {
        title: "New Product",
        path: "/admin/add-product",
        categories: categories,
        inputs: {
        name: "",
        price: "",
        description: "",
        },
    });
    });
};

exports.postAddProduct = async (req, res, next) => {
const { filename: image } = req.files.image[0];
const name = req.body.name;
const price = req.body.price;

const description = req.body.description;
const tags = req.body.tags;

const isActive = Boolean(req.body.isActive);
const popular = Boolean(req.body.popular);
const isHome = Boolean(req.body.isHome);

const ids = req.body.categoryids;
if (!image) {
    return res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
    errorMessage: "Lüften bir resim seçiniz",
    inputs: {
        name: name,
        price: price,
        description: description,
    },
    });
}
await sharp(req.files.image[0].path)
    .resize(300)
    .webp({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .jpeg({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(path.resolve(req.files.image[0].destination, "resized", image));
fs.unlinkSync(req.files.image[0].path);
const product = new Product({
    name: name,
    price: price,
    imageUrl: image,
    description: description,
    userId: req.user,
    categories: ids,
    isActive: isActive,
    popular: popular,
    tags: tags,
    isHome: isHome,
});
const progress = new Process({
    userId: req.user,
    type: "insert",
    name: product.name + " ürününü ekledi",
});
progress.save().then(() => {
    product
    .save()
    .then(() => {
        res.redirect("/admin/products?action=create");
    })
    .catch((err) => {
        if (err.name == "ValidationError") {
        let message = "";
        for (field in err.errors) {
            message += err.errors[field].message + "<br/>";
        }
        res.render("admin/add-product", {
            title: "New Product",
            path: "/admin/add-product",
            errorMessage: message,
            inputs: {
            name: name,
            price: price,
            description: description,
            },
        });
        } else {
        next(err);
        }
    });
});
};
exports.getEditProduct = (req, res, next) => {
if (req.params.productid === "favicon.ico") {
    return res.status(404);
}
Product.findOne({ _id: req.params.productid })

    .then((product) => {
    if (!product) {
        return res.redirect("/");
    }
    return product;
    })
    .then((product) => {
    Category.find()
        .where({ isActive: true })
        .then((categories) => {
        categories = categories.map((category) => {
            if (product.categories) {
            product.categories.find((item) => {
                if (item.toString() === category._id.toString()) {
                category.selected = true;
                }
            });
            }
            return category;
        });
        res.render("admin/edit-product", {
            title: "Edit Product",
            path: "/admin/products",
            product: product,
            categories: categories,
        });
        });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditProduct = async (req, res, next) => {
const id = req.body.id;
const name = req.body.name;
const price = req.body.price;
const image = req.files.image;
const description = req.body.description;
const tags = req.body.tags;
const ids = req.body.categoryids;
const isActive = Boolean(req.body.isActive);
const popular = Boolean(req.body.popular);
const isHome = Boolean(req.body.isHome);
if (image) {
    await sharp(req.files.image[0].path)
    .resize(300)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.image[0].destination,
        "resized",
        image[0].filename
        )
    );
    fs.unlinkSync(req.files.image[0].path);
}
Product.findOne({ _id: id })
    .then((product) => {
    if (!product) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: product.name + " ürününü güncelledi.",
    });
    product.name = name;
    product.price = price;
    product.description = description;
    product.categories = ids;
    product.isActive = isActive;
    product.isHome = isHome;
    product.tags = tags;

    product.popular = popular;

    if (image) {
        fs.unlink("wwwroot/img/resized/" + product.imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        });
        product.imageUrl = image[0].filename;
    }
    progress.save();
    return product.save();
    })
    .then((result) => {
    res.redirect("/admin/products?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteProduct = (req, res, next) => {
const id = req.body.productid;

Product.findOne({ _id: id })

    .then((product) => {
    if (!product) {
        return next(new Error("Silinmek istenen ürün bulumadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: product.name + " ürününü sildi.",
    });
    fs.unlink("wwwroot/img/resized/" + product.imageUrl, (err) => {
        if (err) {
        console.log(err);
        }
    });
    progress.save();
    return Product.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen ürün bulumadı."));
    }
    res.redirect("/admin/products?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddCategory = (req, res, next) => {
res.render("admin/add-category", {
    title: "New Category",
    path: "/admin/add-category",
});
};

exports.postAddCategory = async (req, res, next) => {
const { filename: image } = req.files.categoryImg[0];
const name = req.body.name;
const isActive = Boolean(req.body.isActive);
if (!image) {
    return res.render("admin/add-category", {
    title: "New Category",
    path: "/admin/add-category",
    errorMessage: "Lüften bir resim seçiniz",
    inputs: {
        name: name,
    },
    });
}
await sharp(req.files.categoryImg[0].path)
    .resize(300)
    .webp({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .jpeg({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
    path.resolve(req.files.categoryImg[0].destination, "resized", image)
    );
fs.unlinkSync(req.files.categoryImg[0].path);
const category = new Category({
    name: name,
    categoryImg: image,
    userId: req.user,
    isActive: isActive,
});
const progress = new Process({
    userId: req.user,
    type: "insert",
    name: category.name + " kategorisini ekledi",
});
progress.save().then(() => {
    category
    .save()
    .then(() => {
        res.redirect("/admin/categories?action=create");
    })
    .catch((err) => {
        if (err.name == "ValidationError") {
        let message = "";
        for (field in err.errors) {
            message += err.errors[field].message + "<br/>";
        }
        res.render("admin/add-category", {
            title: "New Category",
            path: "/admin/add-category",
            errorMessage: message,
            inputs: {
            name: name,
            },
        });
        } else {
        next(err);
        }
    });
});
};

exports.getCategories = (req, res, next) => {
Category.find()
    .populate("userId", "name -_id")
    .select("name categoryImg date isActive")
    .sort({ date: -1 })
    .then((categories) => {
    res.render("admin/categories", {
        title: "Categories",
        path: "/admin/categories",
        categories: categories,
        action: req.query.action,
    });
    })
    .catch((err) => console.log(err));
};

exports.getEditCategory = (req, res, next) => {
if (req.params.categoryid === "favicon.ico") {
    return res.status(404);
}
Category.findById(req.params.categoryid)

    .then((category) => {
    res.render("admin/edit-category", {
        title: "Edit Category",
        path: "/admin/categories",
        category: category,
    });
    })
    .catch((err) => next(err));
};

exports.postEditCategory = async (req, res, next) => {
const id = req.body.id;
const name = req.body.name;
const image = req.files.categoryImg;
const isActive = Boolean(req.body.isActive);
if (image) {
    await sharp(req.files.categoryImg[0].path)
    .resize(300)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.categoryImg[0].destination,
        "resized",
        image[0].filename
        )
    );
    fs.unlinkSync(req.files.categoryImg[0].path);
}
Category.findOne({ _id: id })
    .then((category) => {
    if (!category) {
        return res.redirect("/");
    }
    category.name = name;
    category.isActive = isActive;
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: category.name + " kategorisini güncelledi.",
    });
    if (image) {
        fs.unlink("wwwroot/img/resized/" + category.categoryImg, (err) => {
        if (err) {
            console.log(err);
        }
        });
        category.categoryImg = image[0].filename;
    }
    progress.save();
    return category.save();
    })
    .then((result) => {
    res.redirect("/admin/categories?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteCategory = (req, res, next) => {
const id = req.body.categoryid;

Category.findOne({ _id: id })
    .then((category) => {
    if (!category) {
        return next(new Error("Silinmek istenen kategori bulunmadı."));
    }
    fs.unlink("wwwroot/img/" + category.categoryImg, (err) => {
        if (err) {
        console.log(err);
        }
    });
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: category.name + " kategorisini sildi.",
    });

    progress.save();
    return Category.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen kategori bulunmadı."));
    }
    res.redirect("/admin/categories?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};
exports.getMainMode = (req, res, next) => {
Systems.findOne()
    .select("mainMode")
    .then((system) => {
    res.render("layouts/mainMode", {
        title: "Bakım Var",
        path: "/mainMode",
        system: system,
        action: req.query.action,
    });
    })

    .catch((err) => {
    next(err);
    });
};

exports.getSystems = (req, res, next) => {
Systems.findOne()
    .select("siteUrl protokol isMemory language mainMode phone address googlemaps sgMail mail tawktoscript googleAnalitcs description tags")
    .then((system) => {
    res.render("admin/system", {
        title: "Admin system",
        path: "/admin/system",
        system: system,
        action: req.query.action,
    });
    })

    .catch((err) => {
    next(err);
    });
};

exports.postEditSystems = (req, res, next) => {
const siteUrl = req.body.siteUrl;
const language = req.body.language;
const mainMode = Boolean(req.body.mainMode);
const isMemory = Boolean(req.body.isMemory);

const sgMail = req.body.sgMail;
const mail = req.body.mail;
const phone = req.body.phone;

const address = req.body.address;
const googlemaps = req.body.googlemaps;
const tawktoscript = req.body.tawktoscript;
const googleAnalitcs = req.body.googleAnalitcs;
const description = req.body.description;
const tags = req.body.tags;
const protokol = req.body.protokol;



Systems.findOne()
    .select("siteUrl protokol isMemory language mainMode phone address googlemaps sgMail mail tawktoscript googleAnalitcs description tags")
    .then((system) => {
    if (!system) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Genel Ayaları güncelledi.",
    });

    (system.siteUrl = siteUrl),
    (system.language = language),
    (system.mainMode = mainMode),
    (system.isMemory = isMemory),

    (system.phone = phone),
    (system.mail = mail),
    (system.address = address),
    (system.userId = req.user),
    (system.googlemaps = googlemaps),
    (system.tawktoscript = tawktoscript);
    system.sgMail=sgMail;
    system.googleAnalitcs = googleAnalitcs;
    system.description = description;
    system.tags = tags;
    system.protokol=protokol;

    progress.save();
    system.save();
    })
    .then((result) => {
    res.redirect("/admin/system?action=edit");
    })
    .catch((err) => next(err));
};

exports.getLogo = (req, res, next) => {
Systems.findOne()
    .select("logo favico footerLogo loadingLogo loadingisActive loadingtext")
    .then((logo) => {
    res.render("admin/logo", {
        title: "Admin Logo",
        path: "/admin/logo",
        logo: logo,
        action: req.query.action,
    });
    })

    .catch((err) => {
    next(err);
    });
};

exports.postEditLogo = async (req, res, next) => {
const file = req.files;
const loadingisActive = Boolean(req.body.loadingisActive);
const loadingtext = req.body.loadingtext;
const loadingLogo = req.body.loadingLogo;

if (file.logo) {
    await sharp(req.files.logo[0].path)
    .resize(150)
    .webp({
        quality: 50,
        alphaQuality: 50,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 50,
        alphaQuality: 50,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 50, alphaQuality: 50, lossless: true, progressive: true })

    .toFile(
        path.resolve(
        req.files.logo[0].destination,
        "resized",
        file.logo[0].filename
        )
    );
    fs.unlinkSync(req.files.logo[0].path);
} else if (file.favico) {
    await sharp(req.files.favico[0].path)
    .resize(16)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })

    .toFile(
        path.resolve(
        req.files.favico[0].destination,
        "resized",
        file.favico[0].filename
        )
    );
    fs.unlinkSync(req.files.favico[0].path);
} else if (file.footerLogo) {
    await sharp(req.files.footerLogo[0].path)
    .resize(150)
    .webp({
        quality: 50,
        alphaQuality: 50,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 50,
        alphaQuality: 50,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 50, alphaQuality: 50, lossless: true, progressive: true })

    .toFile(
        path.resolve(
        req.files.footerLogo[0].destination,
        "resized",
        file.footerLogo[0].filename
        )
    );
    fs.unlinkSync(req.files.footerLogo[0].path);
}
else if (file.loadingLogo) {
    await sharp(req.files.loadingLogo[0].path)
    .resize(50)
    .webp({
        quality: 50,
        alphaQuality: 50,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 50,
        alphaQuality: 50,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 50, alphaQuality: 50, lossless: true, progressive: true })

    .toFile(
        path.resolve(
        req.files.loadingLogo[0].destination,
        "resized",
        file.loadingLogo[0].filename
        )
    );
    // fs.unlinkSync(req.files.loadingLogo[0].path);
}

Systems.findOne()
    .select("logo favico footerLogo loadingLogo loadingisActive loadingtext")
    .then((logoSetting) => {
    if (file.logo) {
        fs.unlink("wwwroot/img/resized/" + logoSetting.logo, (err) => {
        if (err) {
            console.log(err);
        }
        });
        logoSetting.logo = file.logo[0].filename;
        const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Navbar Logosunu Değiştirdi.",
        });
        progress.save();
    } else if (file.favico) {
        fs.unlink("wwwroot/img/resized/" + logoSetting.favico, (err) => {
        if (err) {
            console.log(err);
        }
        });
        logoSetting.favico = file.favico[0].filename;
        const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Sitenin İconunu Değiştirdi.",
        });
        progress.save();
    } else if (file.footerLogo) {
        fs.unlink("wwwroot/img/resized/" + logoSetting.footerLogo, (err) => {
        if (err) {
            console.log(err);
        }
        });
        logoSetting.footerLogo = file.footerLogo[0].filename;
        const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Footer Logosunu Değiştirdi.",
        });
        progress.save();
    } else if (file.loadingLogo) {
        
        logoSetting.loadingLogo = file.loadingLogo[0].filename;
        const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Loading Logosunu Değiştirdi.",
        });
        progress.save();
    }
        else if (!file.loadingLogo && loadingLogo!=null) {
        logoSetting.loadingLogo = loadingLogo;
        }
    logoSetting.loadingisActive = loadingisActive;
    logoSetting.loadingtext = loadingtext;
    return logoSetting.save();
    })
    .then((result) => {
    res.redirect("/admin/logo?action=edit");
    })
    .catch((err) => next(err));
};

exports.getSocialMedia = (req, res, next) => {
Systems.findOne()
    .select("facebook instagram linkedin twitter youtube contactmail contactphone")
    .then((social) => {
    res.render("admin/social", {
        title: "Admin Social",
        path: "/admin/social",
        social: social,
        action: req.query.action,
    });
    })

    .catch((err) => {
    next(err);
    });
};

exports.postEditSocialMedia = (req, res, next) => {
const facebook = req.body.facebook;
const instagram = req.body.instagram;
const twitter = req.body.twitter;
const linkedin = req.body.linkedin;
const youtube = req.body.youtube;
const contactmail = req.body.contactmail;
const contactphone = req.body.contactphone;

const userId = req.user;
Systems.findOne()
    .select("facebook instagram linkedin twitter youtube contactmail contactphone")

    .then((social) => {
    if (!social) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Sosyal Medya Ayarlarını güncelledi.",
    });
    progress.save();
    (social.facebook = facebook),
        (social.instagram = instagram),
        (social.twitter = twitter),
        (social.linkedin = linkedin),
        (social.youtube = youtube),
        (social.userId = userId),
        social.contactmail=contactmail,
        social.contactphone=contactphone
        social.save();
    })
    .then((result) => {
    res.redirect("/admin/social?action=edit");
    })
    .catch((err) => next(err));
};

exports.getClient = (req, res, next) => {
    Post.find({type:"client"})
    .sort({ date: -1 })
    .populate("userId", "name -_id")

    .then((client) => {
    res.render("admin/client", {
        title: "Admin Client",
        path: "/admin/client",
        client: client,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddClient = (req, res, next) => {
res.render("admin/add-client", {
    title: "New Client",
    path: "/admin/add-client",
    inputs: {
    name: "",
    link: "",
    description: "",
    },
});
};

exports.postAddClient = async (req, res, next) => {
const { filename: image } = req.files.clientlogo[0];
const name = req.body.name;
const link = req.body.link;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
if (!image) {
    return res.render("admin/add-client", {
    title: "New Client",
    path: "/admin/add-client",
    errorMessage: "Lüften bir resim seçiniz",
    inputs: {
        name: name,
        link: link,
        description: description,
    },
    });
}
await sharp(req.files.clientlogo[0].path)
    .resize(100)
    .webp({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .jpeg({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .png({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .toFile(
    path.resolve(req.files.clientlogo[0].destination, "resized", image)
    );
fs.unlinkSync(req.files.clientlogo[0].path);

    const post = new Post({
        type:"client",
        userId: req.user,
        isActive: isActive,
        date:Date.now(),
        client:{
            name: name,
            link: link,
            clientlogo: image,
            description: description,
        },
        
    });
    
    const progress = new Process({
        userId: req.user,
        type: "insert",
        name: post.client.name + " referansını ekledi",
    });
    progress.save().then(() => {
        post
        .save()
        .then(() => {
            res.redirect("/admin/client?action=create");
        })
        .catch((err) => {
            next(err);
        });
    });
};

exports.getEditClient = (req, res, next) => {
if (req.params.clientid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.clientid })

    .then((client) => {
    if (!client) {
        return res.redirect("/");
    }
    return client;
    })
    .then((client) => {
    res.render("admin/edit-client", {
        title: "Edit Client",
        path: "/admin/client",
        client: client,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditClient = async (req, res, next) => {
const id = req.body.clientid;
const name = req.body.name;
const link = req.body.link;
const image = req.files.clientlogo;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
if (image) {
    await sharp(req.files.clientlogo[0].path)
    .resize(100)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.clientlogo[0].destination,
        "resized",      
        image[0].filename
        )
    );
    fs.unlinkSync(req.files.clientlogo[0].path);
}

Post.findOne({ _id: id})
    .then((client) => {
    if (!client) {
        return res.redirect("/");
    }

    client.client.name = name;
    client.client.link = link;
    client.client.description = description;
    client.isActive = isActive;
    if (image) {
        fs.unlink("wwwroot/img/resized/" + client.client.clientlogo, (err) => {
        if (err) {
            console.log(err);
        }
        });
        client.client.clientlogo = image[0].filename;
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: client.client.name + " referansını güncelledi.",
    });

    progress.save();
    return client.save();
    })
    .then((result) => {
    res.redirect("/admin/client?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteClient = (req, res, next) => {
const id = req.body.clientid;
Post.findOne({ _id: id })
    .then((client) => {
    if (!client) {
        return next(new Error("Silinmek istenen müşteri bulunmadı."));
    }
    fs.unlink("wwwroot/img/resized/" + client.client.clientlogo, (err) => {
        if (err) {
        console.log(err);
        }
    });

    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: client.client.name + " referansını sildi.",
    });
    progress.save();
    return Post.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen müşteri bulunmadı."));
    }
    res.redirect("/admin/client?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getServices = (req, res, next) => {
Post.find({type:"shortservices"})
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .then((services) => {

    res.render("admin/services", {
        title: "Admin Services",
        path: "/admin/services",
        services: services,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddServices = (req, res, next) => {
res.render("admin/add-services", {
    title: "New Services",
    path: "/admin/add-services",
    inputs: {
    name: "",
    description: "",
    },
});
};

exports.postAddServices = (req, res, next) => {
const name = req.body.name;
const icon = req.body.icon;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
    const services = new Post({
        userId: req.user,
        isActive: isActive,
        date:Date.now(),
        shortservices:{
            name: name,
            icon: icon,
            description: description,
            
        },
        type:"shortservices"
    
    });
    
    const progress = new Process({
        userId: req.user,
        type: "insert",
        name: services.shortservices.name + " servisini ekledi",
    });
    progress.save().then(() => {
        services
        .save()
        .then(() => {
            res.redirect("/admin/services?action=create");
        })
        .catch((err) => {
            next(err);
        });
    });

};

exports.getEditServices = (req, res, next) => {
if (req.params.serviceid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.serviceid })

    .then((services) => {
    if (!services) {
        return res.redirect("/");
    }
    return services;
    })
    .then((services) => {
    res.render("admin/edit-services", {
        title: "Edit Services",
        path: "/admin/services",
        services: services,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditServices = (req, res, next) => {
const id=req.body.serviceid
const name = req.body.name;
const icon = req.body.icon;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
Post.findOne({ _id: id })
    .then((services) => {
    if (!services) {
        return res.redirect("/");
    }

    services.shortservices.name = name;
    services.shortservices.icon = icon;
    services.shortservices.description = description;
    services.isActive = isActive;
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: services.shortservices.name + " servisini güncelledi.",
    });
    progress.save();
    return services.save();
    })
    .then((result) => {
    res.redirect("/admin/services?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteServices = (req, res, next) => {
const id = req.body.serviceid;

Post.findOne({ _id: id })
    .then((services) => {
    if (!services) {
        return next(new Error("Silinmek istenen servis bulunmadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: services.shortservices.name + " servisini sildi.",
    });

    progress.save();
    return services.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen servis bulunmadı."));
    }
    res.redirect("/admin/services?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getContact = (req, res, next) => {
Contact.find()
    .then((contact) => {
    res.render("admin/contact", {
        title: "Admin contact",
        path: "/admin/contact",
        contact: contact,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getContactDetail = (req, res, next) => {
if (req.params.contactid === "favicon.ico") {
    return res.status(404);
}
Contact.findById(req.params.contactid)

    .then((contact) => {
    res.render("admin/contact-details", {
        title: "Mail Details",
        contact: contact,
        path: "/admin/contact",
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postDeleteContact = (req, res, next) => {
const id = req.body.contactid;

Contact.findOne({ _id: id })
    .then((contact) => {
    if (!contact) {
        return next(new Error("Silinmek istenen mesaj bulunmadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name:
        contact.mail +
        "un" +
        contact.subject +
        "konulu gönderdiği mesajı sildi.",
    });
    progress.save();
    return contact.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen mesaj bulunmadı."));
    }
    res.redirect("/admin/contact?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAboutServices = (req, res, next) => {
Post.find({type:"aboutservices"})
    .sort({date:-1} )
    .populate("userId", "name -_id")
    .lean()
    .then((aboutservices) => {
    res.render("admin/aboutservices", {
        title: "Admin About Services",
        path: "/admin/aboutservices",
        aboutservices: aboutservices,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddAboutServices = (req, res, next) => {
res.render("admin/add-aboutservices", {
    title: "New About Services",
    path: "/admin/add-aboutservices",
    inputs: {
    name: "",
    description: "",
    },
});
};

exports.postAddAboutServices = async (req, res, next) => {
const { filename: imageUrl } = req.files.servicesImg[0];
const name = req.body.name;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
const isHome = Boolean(req.body.isHome);
const tags = req.body.tags;
const url=slugify(name);

if (!imageUrl) {
    return res.render("admin/add-aboutservices", {
    title: "New About Services",
    path: "/admin/add-aboutservices",
    errorMessage: "Lüften bir resim seçiniz",
    inputs: {
        name: name,
        description: description,
    },
    });
}
await sharp(req.files.servicesImg[0].path)
    .resize(700)
    .webp({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .jpeg({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .png({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .toFile(
    path.resolve(req.files.servicesImg[0].destination, "resized", imageUrl)
    );
fs.unlinkSync(req.files.servicesImg[0].path);
const aboutservices = new Post({
    type:"aboutservices",
    isActive: isActive,
    isHome: isHome,
    date:Date.now(),
    url:url,
    userId:req.user,
    aboutservices:{
        name: name,
        imageUrl: imageUrl,
        description: description,
        tags: tags,
    },

});

const progress = new Process({
    userId: req.user,
    type: "insert",
    name: aboutservices.aboutservices.name + " hizmetini ekledi",
});
progress.save().then(() => {
    aboutservices
    .save()
    .then(() => {
        res.redirect("/admin/aboutservices?action=create");
    })
    .catch((err) => {
        next(err);
    });
});
};

exports.getEditAboutServices = (req, res, next) => {
if (req.params.aboutserviceid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.aboutserviceid })

    .then((aboutservices) => {
    if (!aboutservices) {
        return res.redirect("/");
    }
    return aboutservices;
    })
    .then((aboutservices) => {
    res.render("admin/edit-aboutservices", {
        title: "Edit About Services",
        path: "/admin/aboutservices",
        aboutservices: aboutservices,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditAboutServices = async (req, res, next) => {
const id = req.body.aboutserviceid;
const name = req.body.name;
const imageUrl = req.files.servicesImg;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
const isHome = Boolean(req.body.isHome);
const tags = req.body.tags;
const url=slugify(name);

if (imageUrl) {
    await sharp(req.files.servicesImg[0].path)
    .resize(700)
    .webp({
        quality: 30,
        alphaQuality: 30,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 30,
        alphaQuality: 30,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.servicesImg[0].destination,
        "resized",
        imageUrl[0].filename
        )
    );
    fs.unlinkSync(req.files.servicesImg[0].path);
}
Post.findOne({ _id: id })
    .then((aboutservices) => {
    if (!aboutservices) {
        return res.redirect("/");
    }

    aboutservices.aboutservices.name = name;
    aboutservices.aboutservices.description = description;
    aboutservices.isActive = isActive;
    aboutservices.isHome = isHome;
    aboutservices.aboutservices.tags = tags;
    aboutservices.url=url;
    if (imageUrl) {
        fs.unlink("wwwroot/img/resized/" + aboutservices.aboutservices.imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        });
        aboutservices.aboutservices.imageUrl = imageUrl[0].filename;
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: aboutservices.aboutservices.name + " hizmetini güncelledi.",
    });

    progress.save();
    return aboutservices.save();
    })
    .then((result) => {
    res.redirect("/admin/aboutservices?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteAboutServices = (req, res, next) => {
const id = req.body.aboutserviceid;

Post.findOne({ _id: id })
    .then((aboutservices) => {
    if (!aboutservices) {
        return next(new Error("Silinmek istenen hizmet bulunmadı."));
    }
    fs.unlink("wwwroot/img/resized/" + aboutservices.aboutservices.imageUrl, (err) => {
        if (err) {
        console.log(err);
        }
    });
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: aboutservices.aboutservices.name + " hizmetini sildi.",
    });
    progress.save();
    return aboutservices.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen hizmet bulunmadı."));
    }
    res.redirect("/admin/aboutservices?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getProject = (req, res, next) => {
Post.find({type:"project"})
    .populate("userId", "name -_id")
    .lean()
    .then((project) => {
    res.render("admin/project", {
        title: "Admin About Project",
        path: "/admin/project",
        project: project,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddProject = (req, res, next) => {
res.render("admin/add-project", {
    title: "New Project",
    path: "/admin/add-project",
});
};

exports.postAddProject = async (req, res, next) => {
const { filename: image } = req.files.projectImg[0];
const name = req.body.name;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
const isHome = Boolean(req.body.isHome);
const tags = req.body.tags;
const url=slugify(name);


if (!image) {
    return res.render("admin/add-project", {
    title: "New Project",
    path: "/admin/add-project",
    errorMessage: "Lüften bir resim seçiniz",
    });
}
await sharp(req.files.projectImg[0].path)
    .resize(500)
    .webp({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .jpeg({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
    path.resolve(req.files.projectImg[0].destination, "resized", image)
    );
fs.unlinkSync(req.files.projectImg[0].path);
const project = new Post({
    type:"project",

    userId: req.user,
    isActive: isActive,
    isHome: isHome,
    date:Date.now(),
    url:url,
    project:{
        name: name,
        imageUrl: image,
        description: description,
        tags: tags,
    },

});
const progress = new Process({
    userId: req.user,
    type: "insert",
    name: project.project.name + " projesini ekledi",
});
progress.save().then(() => {
    project
    .save()
    .then(() => {
        res.redirect("/admin/project?action=create");
    })
    .catch((err) => {
        next(err);
    });
});
};

exports.getEditProject = (req, res, next) => {
if (req.params.projectid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.projectid })

    .then((project) => {
    if (!project) {
        return res.redirect("/");
    }
    return project;
    })
    .then((project) => {
    res.render("admin/edit-project", {
        title: "Edit Project",
        path: "/admin/project",
        project: project,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditProject = async (req, res, next) => {
const id = req.body.projectid;
const name = req.body.name;
const image = req.files.projectImg;
const description = req.body.description;
const tags = req.body.tags;
const url=slugify(name);

const isActive = Boolean(req.body.isActive);
const isHome = Boolean(req.body.isHome);

if (image) {
    await sharp(req.files.projectImg[0].path)
    .resize(500)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.projectImg[0].destination,
        "resized",
        image[0].filename
        )
    );
    fs.unlinkSync(req.files.projectImg[0].path);
}
Post.findOne({ _id: id })
    .then((project) => {
    if (!project) {
        return res.redirect("/");
    }

    project.project.name = name;
    project.project.description = description;
    project.isActive = isActive;
    project.isHome = isHome;
    project.project.tags = tags;
    project.url = url;

    if (image) {
        fs.unlink("wwwroot/img/resized/" + project.project.imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        });
        project.project.imageUrl = image[0].filename;
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: project.project.name + " projesini güncelledi.",
    });

    progress.save();
    return project.save();
    })
    .then((result) => {
    res.redirect("/admin/project?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteProject = (req, res, next) => {
const id = req.body.projectid;
Post.findOne({ _id: id })
    .then((project) => {
    if (!project) {
        return next(new Error("Silinmek istenen hizmet bulunmadı."));
    }
    fs.unlink("wwwroot/img/resized/" + project.project.imageUrl, (err) => {
        if (err) {
        console.log(err);
        }
    });
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: project.project.name + " projesini sildi.",
    });
    progress.save();
    return project.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen hizmet bulunmadı."));
    }
    res.redirect("/admin/project?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};
exports.getPage = (req, res, next) => {
Systems.findOne()
    .select("home products about about_isActive blog blog_isActive cart cart_isActive client client_isActive contact contact_isActive home_isActive products_isActive project project_isActive services services_isActive user user_isActive")
    .then((page) => {
    res.render("admin/page", {
        title: "Admin Page Settings",
        path: "/admin/page",
        page: page,
        action: req.query.action,
    });
    })

    .catch((err) => {
    next(err);
    });
};

exports.postEditPage = (req, res, next) => {
const home = req.body.home;
const products = req.body.products;
const services = req.body.services;
const about = req.body.about;
const project = req.body.project;
const client = req.body.client;
const contact = req.body.contact;

const cart = req.body.cart;
const user = req.body.user;
const blog = req.body.blog;


const home_isActive =Boolean( req.body.home_isActive);
const products_isActive = Boolean(req.body.products_isActive);
const services_isActive = Boolean(req.body.services_isActive);
const about_isActive = Boolean(req.body.about_isActive);
const project_isActive = Boolean(req.body.project_isActive);
const client_isActive = Boolean(req.body.client_isActive);
const contact_isActive = Boolean(req.body.contact_isActive);

const cart_isActive = Boolean(req.body.cart_isActive);
const user_isActive = Boolean(req.body.user_isActive);
const blog_isActive = Boolean(req.body.blog_isActive);


Systems.findOne()
    .select("home products about about_isActive blog blog_isActive cart cart_isActive client client_isActive contact contact_isActive home_isActive products_isActive project project_isActive services services_isActive user user_isActive")
    .then((pages) => {
    if (!pages) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Sayfa Ayalarını güncelledi.",
    });

    (pages.home = home),
    (pages.products = products),
    (pages.services = services),
    (pages.about = about),
    (pages.project = project),
    (pages.client = client),
    (pages.contact = contact),
    (pages.cart = cart),
    (pages.user = user);
    (pages.blog = blog);


    pages.home_isActive=home_isActive;
    pages.products_isActive=products_isActive;
    pages.services_isActive=services_isActive;
    pages.about_isActive=about_isActive;
    pages.project_isActive=project_isActive;
    pages.client_isActive=client_isActive;
    pages.contact_isActive=contact_isActive;
    pages.cart_isActive=cart_isActive;
    pages.blog_isActive=blog_isActive;
    pages.user_isActive=user_isActive;



    progress.save();
    pages.save();
    })
    .then((result) => {
    res.redirect("/admin/page?action=edit");
    })
    .catch((err) => next(err));
};

exports.getAbout = (req, res, next) => {
Post.find({type:"about"})
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .then((about) => {
    res.render("admin/about", {
        title: "Admin About Page",
        path: "/admin/about",
        about: about,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddAbout = (req, res, next) => {
res.render("admin/add-about", {
    title: "New About Page",
    path: "/admin/add-about",
    inputs: {
    name: "",
    description: "",
    },
});
};

exports.postAddAbout = (req, res, next) => {
const name = req.body.name;

const description = req.body.description;
const isActive = Boolean(req.body.isActive);
const isHome = Boolean(req.body.isHome);
const url=slugify(name);

const about = new Post({
    type:"about",
    isActive: isActive,
    isHome: isHome,
    userId: req.user,
    url:url,
    date:Date.now(),
    about:{
            name: name,
            description: description,

        }
    },

);

const progress = new Process({
    userId: req.user,
    type: "insert",
    name: about.about.name + " başlıklı bilgiyi hakkımızda sayfasına ekledi",
});
progress.save().then(() => {
    about
    .save()
    .then(() => {
        res.redirect("/admin/about?action=create");
    })
    .catch((err) => {
        next(err);
    });
});
};

exports.getEditAbout = (req, res, next) => {
if (req.params.aboutid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.aboutid })

    .then((about) => {
    if (!about) {
        return res.redirect("/");
    }
    return about;
    })
    .then((about) => {
    res.render("admin/edit-about", {
        title: "Edit About Page",
        path: "/admin/about",
        about: about,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditAbout = (req, res, next) => {
const id = req.body.aboutid;
const name = req.body.name;
const description = req.body.description;
const isActive = Boolean(req.body.isActive);
const isHome = Boolean(req.body.isHome);
const url=slugify(name);

Post.findOne({ _id: id })
    .then((about) => {
    if (!about) {
        return res.redirect("/");
    }
    about.about.name = name;
    about.about.description = description;
    about.isActive = isActive;
    about.isHome = isHome;
    about.url=url;
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name:
        "Hakkımızda sayfasındaki  " +
        about.about.name +
        " başlıklı bilgiyi güncelledi.",
    });

    progress.save();
    return about.save();
    })
    .then((result) => {
    res.redirect("/admin/about?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteAbout = (req, res, next) => {
const id = req.body.aboutid;

Post.findOne({ _id: id })
    .then((about) => {
    if (!about) {
        return next(new Error("Silinmek istenilen bulunmadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: about.about.name + " başlıklı bilgiyi hakkımızda sayfasından sildi.",
    });
    progress.save();
    return about.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenilen bulunmadı."));
    }
    res.redirect("/admin/about?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getNews = (req, res, next) => {
Post.find({type:"news"})
    .sort({ date: 1 })
    .populate("userId", "name -_id")
    .then((news) => {
    res.render("admin/news", {
        title: "Admin News",
        path: "/admin/news",
        news: news,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddNews = (req, res, next) => {
res.render("admin/add-news", {
    title: "New News",
    path: "/admin/add-nwes",
});
};

exports.postAddNews = async (req, res, next) => {
const { filename: image } = req.files.newsImg[0];
const title = req.body.title;
const description = req.body.description;
const newsdate = req.body.newsdate;
const tags = req.body.tags;
const url=slugify(title);

const isActive = Boolean(req.body.isActive);
if (!image) {
    return res.render("admin/add-news", {
    title: "New News",
    path: "/admin/add-news",
    errorMessage: "Lüften bir resim seçiniz",
    });
}
await sharp(req.files.newsImg[0].path)
    .resize(1280)
    .webp({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .jpeg({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .png({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .toFile(path.resolve(req.files.newsImg[0].destination, "resized", image));
fs.unlinkSync(req.files.newsImg[0].path);
const news = new Post({
    type:"news",
    
    userId: req.user,
    newsdate: newsdate,
    isActive: isActive,
    date:Date.now(),
    url:url,
    news:{
        title: title,
        imageUrl: image,
        description: description,
        tags: tags,
    }

});
const progress = new Process({
    userId: req.user,
    type: "insert",
    name: news.news.title + " başlıklı gönderi ekledi",
});
progress.save().then(() => {
    news
    .save()
    .then(() => {
        res.redirect("/admin/news?action=create");
    })
    .catch((err) => {
        next(err);
    });
});
};

exports.getEditNews = (req, res, next) => {
if (req.params.newsid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.newsid })

    .then((news) => {
    if (!news) {
        return res.redirect("/");
    }
    return news;
    })
    .then((news) => {
    res.render("admin/edit-news", {
        title: "Edit News",
        path: "/admin/news",
        news: news,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditNews = async (req, res, next) => {
const id = req.body.newsid;
const title = req.body.title;
const imageUrl = req.files.newsImg;
const description = req.body.description;
const newsdate = req.body.newsdate;
const tags = req.body.tags;
const url=slugify(title);

const isActive = Boolean(req.body.isActive);

if (imageUrl) {
    await sharp(req.files.newsImg[0].path)
    .resize(1280)
    .webp({
        quality: 30,
        alphaQuality: 30,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 30,
        alphaQuality: 30,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 30, alphaQuality: 30, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.newsImg[0].destination,
        "resized",
        imageUrl[0].filename
        )
    );
    fs.unlinkSync(req.files.newsImg[0].path);
}
Post.findOne({ _id: id })
    .then((news) => {
    if (!news) {
        return res.redirect("/");
    }

    news.news.title = title;
    news.news.description = description;
    news.newsdate = newsdate;
    news.news.tags = tags;
    news.isActive = isActive;
    news.url = url;
    
    if (imageUrl) {
        fs.unlink("wwwroot/img/resized/" + news.news.imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        });
        news.news.imageUrl = imageUrl[0].filename;
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: news.news.title + " başlıklı gönderiyi güncelledi.",
    });

    progress.save();
    return news.save();
    })
    .then((result) => {
    res.redirect("/admin/news?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteNews = (req, res, next) => {
const id = req.body.newsid;

Post.findOne({ _id: id })
    .then((news) => {
    if (!news) {
        return next(new Error("Silinmek istenen gönderi bulunmadı."));
    }
    fs.unlink("wwwroot/img/resized/" + news.news.imageUrl, (err) => {
        if (err) {
        console.log(err);
        }
    });
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: news.news.title + " başlıklı gönderiyi sildi.",
    });
    progress.save();
    return news.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen gönderi bulunmadı."));
    }
    res.redirect("/admin/news?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getProcess = (req, res, next) => {
Process.find()
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .then((process) => {
    res.render("admin/process", {
        title: "Admin Process",
        path: "/admin/process",
        process: process,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAdvanced = (req, res, next) => {
Advanced.find()
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .then((advanced) => {
    res.render("admin/advanced", {
        title: "Admin Advanced",
        path: "/admin/advanced",
        advanced: advanced,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getUsers = (req, res, next) => {
User.find({ isLimited: false })
    .where({ isAdmin: false })
    .sort({ date: -1 })
    .then((users) => {
    res.render("admin/users", {
        title: "Admin Users List",
        path: "/admin/users",
        users: users,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};
exports.getUser = (req, res, next) => {
if (req.params.userid === "favicon.ico") {
    return res.status(404);
}
Order.find({ "user.userId": req.params.userid })
    .then((orders) => {
    res.render("admin/order-history", {
        title: "Admin Order History",
        path: "/order-history",
        orders: orders,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAdmin = (req, res, next) => {
User.find()
    .where({ isAdmin: true })
    .then((admin) => {
    User.find()
        .where({ isLimited: true })
        .then((limited) => {
        res.render("admin/alladmin", {
            title: "Admin Settings",
            path: "/admin/alladmin",
            admin: admin,
            limited: limited,
            action: req.query.action,
        });
        });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddAdmin = (req, res, next) => {
var errorMessage = req.session.errorMessage;
delete req.session.errorMessage;
res.render("admin/add-admin", {
    title: "New Admin",
    path: "/admin/add-admin",
    errorMessage: errorMessage,
});
};

exports.postAddAdmin = (req, res, next) => {
const name = req.body.name;
const email = req.body.email;
const password = req.body.password;

const isAdmin = Boolean(req.body.isAdmin);
const isLimited = Boolean(req.body.isLimited);
User.findOne({ email: email })
    .then((user) => {
    if (user) {
        req.session.errorMessage =
        "Bu mail adresi ile daha önce kayıt olunmuş.";
        req.session.save(function (err) {
        console.log(err);
        return res.redirect("/admin/add-admin");
        });
    }
    if (!user) {
        return bcrypt.hash(password, 12);
    }
    })
    .then((hashedPassword) => {
    User.findOne({ email: email }).then((user) => {
        if (!user) {
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
            isAdmin: isAdmin,
            isLimited: isLimited,
        });
        const progress = new Process({
            userId: req.user,
            type: "insert",
            name: newUser.name + " isimli admini ekledi",
        });
        progress.save();
        newUser.save();
        }
    });
    })
    .then(() => {
    Mail.findOne()
        .select("title html properties")
        .then((mail) => {
        Systems.find()
            .select("sgMail")
            .then((apikey) => {
            res.redirect("/admin/alladmin?action=create");
            const msg = {
                to: email,
                subject: mail.title,
                html: mail.html,
            };

            sgMail.send(msg);
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
    if (err.name == "ValidationError") {
        let message = "";
        for (field in err.errors) {
        message += err.errors[field].message + "<br/>";
        }
        res.render("admin/add-admin", {
        path: "/admin/add-admin",
        title: "Add Admin",
        errorMessage: message,
        });
    } else {
        next(err);
    }
    });
};

exports.getEditAdmin = (req, res, next) => {
if (req.params.adminid === "favicon.ico") {
    return res.status(404);
}
const id = req.params.adminid;
User.findOne({ _id: req.params.adminid })

    .then((user) => {
    if (!user) {
        return res.redirect("/");
    }
    return user;
    })
    .then((user) => {
    res.render("admin/edit-admin", {
        title: "Edit Admin",
        path: "/admin/alladmin",
        user: user,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditAdmin = (req, res, next) => {
const id = req.body.adminid;
const email = req.body.email;
const name = req.body.name;

const password = req.body.password;
const isAdmin = Boolean(req.body.isAdmin);
const isLimited = Boolean(req.body.isLimited);
let _user;
User.findOne({ _id: id })
    .then((user) => {
    if (!user) {
        return res.redirect("/");
    }
    _user = user;
    return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
    _user.email = email;
    _user.name = name;
    _user.password = hashedPassword;
    _user.isAdmin = isAdmin;
    _user.isLimited = isLimited;
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: _user.name + " isimli kısıtlı admini güncelledi.",
    });

    progress.save();
    return _user.save();
    })
    .then((result) => {
    res.redirect("/admin/alladmin?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteAdmin = (req, res, next) => {
const id = req.body.adminid;

User.findOne({ _id: id })

    .then((admin) => {
    if (!admin) {
        return next(new Error("Silinmek istenilen admin bulunmadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: admin.name + " isimli admini sildi.",
    });

    Advanced.find()
        .deleteMany({ userId: id })
        .catch((err) => {
        console.log(err);
        });
    progress.save();
    return admin.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen admin bulunmadı."));
    }
    res.redirect("/admin/alladmin?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getActiveModule = (req, res, next) => {
Systems.findOne()
    .select("contactnavbar_isActive darkmode_isActive ecommarce_isActive isNavbar tawkto_isActive translate_isActive whatsapp_isActive")
    .then((active) => {
    res.render("admin/activemodule", {
        title: "Admin Active Module",
        path: "/admin/activemodule",
        active: active,
        action: req.query.action,
    });
    })

    .catch((err) => {
    next(err);
    });
};

exports.postEditActiveModule = (req, res, next) => {
const contactnavbar_isActive = Boolean(req.body.contactnavbar_isActive);
const whatsapp_isActive = Boolean(req.body.whatsapp_isActive);
const tawkto_isActive = Boolean(req.body.tawkto_isActive);
const darkmode_isActive = Boolean(req.body.darkmode_isActive);
const translate_isActive = Boolean(req.body.translate_isActive);
const ecommarce_isActive = Boolean(req.body.ecommarce_isActive);
const isNavbar = Boolean(req.body.isNavbar);

Systems.findOne()
    .select("contactnavbar_isActive darkmode_isActive ecommarce_isActive isNavbar tawkto_isActive translate_isActive whatsapp_isActive")
    .then((active) => {
    if (!active) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: "Modül Ayalarını güncelledi.",
    });

    (active.contactnavbar_isActive = contactnavbar_isActive),
        (active.whatsapp_isActive = whatsapp_isActive),
        (active.tawkto_isActive = tawkto_isActive),
        (active.darkmode_isActive = darkmode_isActive),
        (active.translate_isActive = translate_isActive),
        (active.ecommarce_isActive = ecommarce_isActive),
        (active.isNavbar = isNavbar);
    progress.save();
    active.save();
    })
    .then((result) => {
    res.redirect("/admin/activemodule?action=edit");
    })
    .catch((err) => next(err));
};

exports.getOrders = (req, res, next) => {
Order.find()
    .sort({ date: -1 })

    .then((orders) => {
    res.render("admin/orders", {
        title: "Ordrers",
        path: "/admin/orders",
        orders: orders,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getOrder = (req, res, next) => {
const id = req.params.orderid;
Order.findOne({ _id: id })
    .sort({ date: -1 })

    .then((orders) => {
    res.render("admin/order", {
        title: "Order",
        path: "/admin/orders",
        orders: orders,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postOrders = (req, res, next) => {
const id = req.body.orderid;
const approval = Boolean(req.body.approval);
const cargo = Boolean(req.body.cargo);
const done = Boolean(req.body.done);
const cargocompany = req.body.cargocompany;
const cargonumber = req.body.cargonumber;

Order.findOne({ _id: id })
    .updateOne({
    approval: approval,
    cargo: cargo,
    done: done,
    cargocompany: cargocompany,
    cargonumber: cargonumber,
    })
    .then(() => {
    res.redirect("/admin/orders");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getLang = (req, res, next) => {
Post.find({type:"lang"})
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .then((lang) => {
    res.render("admin/lang", {
        title: "Admin Language",
        path: "/admin/lang",
        lang: lang,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddLang = (req, res, next) => {
res.render("admin/add-lang", {
    title: "New Language",
    path: "/admin/add-lang",
    inputs: {
    name: "",
    price: "",
    description: "",
    },
});
};

exports.postAddLang = async (req, res, next) => {
const { filename: image } = req.files.image[0];
const lang = req.body.lang;
const value = req.body.value;
const isActive = Boolean(req.body.isActive);

if (!image) {
    return res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
    errorMessage: "Lüften bir resim seçiniz",
    inputs: {
        lang: lang,
        value: value,
    },
    });
}
await sharp(req.files.image[0].path)
    .resize(50)
    .webp({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .jpeg({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(path.resolve(req.files.image[0].destination, "resized", image));
fs.unlinkSync(req.files.image[0].path);
const language = new Post({
    isActive: isActive,
    userId: req.user,
    date:Date.now(),
    type:"lang",
    lang:{
        lang: lang,
        value: value,
        imageUrl: image,
    },


});
const progress = new Process({
    userId: req.user,
    type: "insert",
    name: lang.lang + " dilini ekledi",
});
progress.save().then(() => {
    language
    .save()
    .then(() => {
        res.redirect("/admin/lang?action=create");
    })
    .catch((err) => {
        if (err.name == "ValidationError") {
        let message = "";
        for (field in err.errors) {
            message += err.errors[field].message + "<br/>";
        }
        res.render("admin/add-lang", {
            title: "New Language",
            path: "/admin/add-language",
            errorMessage: message,
            inputs: {
            lang: lang,
            value: value,
            },
        });
        } else {
        next(err);
        }
    });
});
};

exports.getEditLang = (req, res, next) => {
if (req.params.langid === "favicon.ico") {
    return res.status(404);
}
Post.findOne({ _id: req.params.langid })

    .then((lang) => {
    if (!lang) {
        return res.redirect("/");
    }
    return lang;
    })
    .then((lang) => {
    res.render("admin/edit-lang", {
        title: "Edit Language",
        path: "/admin/lang",
        lang: lang,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditLang = async (req, res, next) => {
const id = req.body.langid;
const lang = req.body.lang;
const value = req.body.value;
const image = req.files.image;
const isActive = Boolean(req.body.isActive);
if (image) {
    await sharp(req.files.image[0].path)
    .resize(50)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.image[0].destination,
        "resized",
        image[0].filename
        )
    );
    fs.unlinkSync(req.files.image[0].path);
}
Post.findOne({ _id: id })
    .then((language) => {
    if (!language) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: language.lang.lang + " dilini güncelledi.",
    });
    language.lang.lang = lang;
    language.lang.value = value;
    language.isActive = isActive;

    if (image) {
        fs.unlink("wwwroot/img/resized/" + language.lang.imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        });
        language.lang.imageUrl = image[0].filename;
    }
    progress.save();
    return language.save();
    })
    .then((result) => {
    res.redirect("/admin/lang?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteLang = (req, res, next) => {
const id = req.body.langid;

Post.findOne({ _id: id })

    .then((lang) => {
    if (!lang) {
        return next(new Error("Silinmek istenen dil bulumadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: lang.name + " dilini sildi.",
    });
    fs.unlink("wwwroot/img/resized/" + lang.lang.imageUrl, (err) => {
        if (err) {
        console.log(err);
        }
    });
    progress.save();
    return lang.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen dil bulumadı."));
    }
    res.redirect("/admin/lang?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};

exports.getBank = (req, res, next) => {
Bank.find()
    .sort({ date: -1 })
    .populate("userId", "name -_id")
    .then((bank) => {
    res.render("admin/bank", {
        title: "Admin Account Holder",
        path: "/admin/bank",
        bank: bank,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.getAddBank = (req, res, next) => {
res.render("admin/add-bank", {
    title: "New Account Holder",
    path: "/admin/add-bank",
    inputs: {
    name: "",
    holder: "",
    },
});
};

exports.postAddBank = async (req, res, next) => {
const { filename: image } = req.files.image[0];
const iban = req.body.iban;
const holder = req.body.holder;
const isActive = Boolean(req.body.isActive);
const accountType = req.body.accountType;

if (!image) {
    return res.render("admin/add-bank", {
    title: "New Account Holder",
    path: "/admin/add-bank",
    errorMessage: "Lüften bir resim seçiniz",
    inputs: {
        iban: iban,
        holder: holder,
    },
    });
}
await sharp(req.files.image[0].path)
    .resize(250)
    .webp({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .jpeg({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(path.resolve(req.files.image[0].destination, "resized", image));
fs.unlinkSync(req.files.image[0].path);
const bank = new Bank({
    iban: iban,
    holder: holder,
    imageUrl: image,
    isActive: isActive,
    accountType: accountType,
    userId: req.user,
});
const progress = new Process({
    userId: req.user,
    type: "insert",
    name: bank.holder + " kişisine ait banka hesabı ekledi",
});
progress.save().then(() => {
    bank
    .save()
    .then(() => {
        res.redirect("/admin/bank?action=create");
    })
    .catch((err) => {
        if (err.name == "ValidationError") {
        let message = "";
        for (field in err.errors) {
            message += err.errors[field].message + "<br/>";
        }
        res.render("admin/add-bank", {
            title: "New Account Holder",
            path: "/admin/add-bank",
            errorMessage: message,
            inputs: {
            iban: iban,
            holder: holder,
            },
        });
        } else {
        next(err);
        }
    });
});
};

exports.getEditBank = (req, res, next) => {
if (req.params.bankid === "favicon.ico") {
    return res.status(404);
}
Bank.findOne({ _id: req.params.bankid })

    .then((bank) => {
    if (!bank) {
        return res.redirect("/");
    }
    return bank;
    })
    .then((bank) => {
    res.render("admin/edit-bank", {
        title: "Edit Account Holder",
        path: "/admin/bank",
        bank: bank,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postEditBank = async (req, res, next) => {
const id = req.body.bankid;
const iban = req.body.iban;
const holder = req.body.holder;
const image = req.files.image;
const accountType = req.body.accountType;

const isActive = Boolean(req.body.isActive);
if (image) {
    await sharp(req.files.image[0].path)
    .resize(250)
    .webp({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .jpeg({
        quality: 10,
        alphaQuality: 10,
        lossless: true,
        progressive: true,
    })
    .png({ quality: 10, alphaQuality: 10, lossless: true, progressive: true })
    .toFile(
        path.resolve(
        req.files.image[0].destination,
        "resized",
        image[0].filename
        )
    );
    fs.unlinkSync(req.files.image[0].path);
}
Bank.findOne({ _id: id })
    .then((bank) => {
    if (!bank) {
        return res.redirect("/");
    }
    const progress = new Process({
        userId: req.user,
        type: "edit",
        name: bank.holder + " kişisine ait banka hesabını güncelledi.",
    });
    bank.iban = iban;
    bank.holder = holder;
    bank.isActive = isActive;
    bank.accountType = accountType;

    if (image) {
        fs.unlink("wwwroot/img/resized/" + bank.imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        });
        bank.imageUrl = image[0].filename;
    }
    progress.save();
    return bank.save();
    })
    .then((result) => {
    res.redirect("/admin/bank?action=edit");
    })
    .catch((err) => next(err));
};

exports.postDeleteBank = (req, res, next) => {
const id = req.body.bankid;

Bank.findOne({ _id: id })

    .then((bank) => {
    if (!bank) {
        return next(new Error("Silinmek istenen banka hesabı bulumadı."));
    }
    const progress = new Process({
        userId: req.user,
        type: "delete",
        name: bank.holder + " kişisine ait banka hesabını sildi.",
    });
    fs.unlink("wwwroot/img/resized/" + bank.imageUrl, (err) => {
        if (err) {
        console.log(err);
        }
    });
    progress.save();
    return bank.deleteOne({ _id: id });
    })
    .then((result) => {
    if (result.deletedCount === 0) {
        return next(new Error("Silinmek istenen banka hesabı bulumadı."));
    }
    res.redirect("/admin/bank?action=delete");
    })
    .catch((err) => {
    next(err);
    });
};
exports.getReset = (req, res, next) => {
var errorMessage = req.session.errorMessage;
delete req.session.errorMessage;
res.render("admin/password", {
    path: "/admin/password",
    title: "New Password",
    errorMessage: errorMessage,
    action: req.query.action,
});
};

exports.postReset = (req, res, next) => {
const email = req.user.email;
crypto.randomBytes(32, (err, buffer) => {
    if (err) {
    console.log(err);
    return res.redirect("/admin/password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
    .then((user) => {
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
    })
    .then((result) => {
        Systems.findOne()
        .select("siteUrl mail")
        .then((system) => {
            const msg = {
            to: email,
            from: system.mail,
            subject: "Yeni Parola",
            html: `
        
                            <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                            <p>
                                <a href="${system.siteUrl}/admin/new-password/${token}"> Reset Password </a>
                            </p>
                        `,
            };
            sgMail
            .send(msg)
            .then(() => {
                res.redirect("/admin/password?action=true");
            })
            .catch((err) => {
                res.redirect("/admin/password?action=false");
                console.log(err.response.body);
            });
        })
        .catch((err) => {
            next(err);
        });
    })
    .catch((err) => {
        next(err);
    });
});
};
exports.getNewPassword = (req, res, next) => {
var errorMessage = req.session.errorMessage;
delete req.session.errorMessage;
const token = req.params.token;
User.findOne({
    resetToken: token,
    resetTokenExpiration: {
    $gt: Date.now(),
    },
})
    .then((user) => {
    res.render("admin/new-password", {
        path: "/admin/new-password",
        title: "New Password",
        errorMessage: errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
        action: req.query.action,
    });
    })
    .catch((err) => {
    next(err);
    });
};

exports.postNewPassword = (req, res, next) => {
const newPassword = req.body.password;
const token = req.body.passwordToken;
const userId = req.body.userId;

let _user;
User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
})
    .then((user) => {
    _user = user;
    return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
    _user.password = hashedPassword;
    _user.resetToken = undefined;
    _user.resetTokenExpiration = undefined;
    return _user.save();
    })
    .then(() => {
    res.redirect("/admin/password?action=success");
    })
    .catch((err) => {
    console.log(err);
    });
};


exports.getFooter = (req, res, next) => {
    Systems.findOne()
        .select("alt footerdescription slogan title")
        .then((footer) => {
        res.render("admin/footer", {
            title: "Admin Edit Footer",
            path: "/admin/footer",
            footer: footer,
            action: req.query.action,
        });
        })
    
        .catch((err) => {
        next(err);
        });
    };
    
    exports.postEditFooter = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const slogan = req.body.slogan;
    const alt = req.body.alt;

    
    Systems.findOne()
        .select("alt footerdescription slogan title")
        
        .then((footer) => {
        if (!footer) {
            return res.redirect("/");
        }
        const progress = new Process({
            userId: req.user,
            type: "edit",
            name: "Footer alanını güncelledi.",
        });
    
        footer.title=title;
        footer.description=description;
        footer.slogan=slogan;
        footer.alt=alt;
        progress.save();
        footer.save();
        })
        .then((result) => {
        res.redirect("/admin/footer?action=edit");
        })
        .catch((err) => next(err));
    };
    
