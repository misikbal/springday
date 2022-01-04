const Slide=require('../model/slide');
const Product=require('../model/product');
const About=require('../model/about');
const Services=require('../model/aboutservices');
const Project=require('../model/project');
const Blog=require('../model/news');
const Client=require('../model/client');



const Process=require('../model/process');
const sharp = require('sharp');
const path = require('path');

const fs=require("fs");

exports.getSlide = (req, res, next) => {
    Slide.find()
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(slide => {
            Product.find()
            .select("name")
            .then(product=>{

                res.render('admin/slide', {
                    title: 'Admin Slide',
                    slide: slide,
                    product:product,
                    path: '/admin/slide',
                    action: req.query.action
                });
            })

        })
        .catch((err) => {
            next(err);
        });
}

exports.getAddSlide = (req, res, next) => {
    Product.find()
    .select("name")
    .then(product=>{
        About.find()
        .where({isActive:true})
        .select("name")
        .then(about=>{
            Services.find()
            .where({isActive:true})
            .select("name")
            .then(services=>{
                Project.find()
                .select("name")
                .where({isActive:true})
                .then(project=>{
                    Blog.find()
                    .where({isActive:true})
                    .select("title")
                    .then(blog=>{
                        Client.find()
                        .where({isActive:true})
                        .select("name")
                        .then(client=>{
                            res.render('admin/add-slide', {
                                title: 'New Slide',
                                path: '/admin/add-slide',
                                product:product,
                                about:about,
                                services:services,
                                project:project,
                                blog:blog,
                                client:client,
                                inputs:{
                                    image:"",
                                    title:"",
                                    description:"",
                                    buttonName:"",
                                    buttonLink:"",
                                    animate:"",
                                    isActive:"",
                                }      
                        });
                        })
                    })
                })
            })
        })
});

}

exports.postAddSlide = async(req, res, next) => {
    
    const {filename:image}=req.files.slideimg[0];

    
    const title = req.body.title;
    const description = req.body.description;
    const buttonName = req.body.buttonName;
    const buttonLink=req.body.buttonLink;
    const animate=req.body.animate;
    const isActive = Boolean(req.body.isActive);
    console.log(image)
    if(!image){
        return res.render('admin/add-slide', {
            title: 'New Slide',
            path: '/admin/add-slide',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                image:image.file,
                title:title,
                description:description,
                buttonName:buttonName,
                animate:animate,
                isActive:isActive,
            }      
        });
    }
    
    await sharp(req.files.slideimg[0].path)
    .resize(960)
    .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .toFile(
        path.resolve(req.files.slideimg[0].destination,'resized',image)
    )
    fs.unlinkSync(req.files.slideimg[0].path)
    console.log("burada")
    const slide = new Slide(
        {   
            image: image,
            title:title,
            description:description,
            buttonName:buttonName,
            buttonLink:buttonLink,
            animate:animate,
            isActive:isActive,
            userId:req.user,
        }
    );
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:slide.title+" başlıklı slaytı ekledi"
        }
    )
    progress.save().then(() => {
        slide.save()
        .then(() => {
            res.redirect('/admin/slide?action=create');
        })
        .catch(err => {
            if(err.name=="ValidationError"){
                let message="";
                for(field in err.errors){
                    message+=err.errors[field].message+"<br/>";
                }
                res.render('admin/add-slide', {
                    title: 'New Slide',
                    path: '/admin/add-slide',
                    errorMessage:message,
                    inputs:{
                        title:title,
                        image:image,
                        description:description,
                        buttonName:buttonName,
                        animate:animate,
                        isActive:isActive,
                    }
                });
            }else{
                
                next(err);
            }
        
    });
    })

}

exports.getEditSlide = (req, res, next) => {
    if (req.params.categoryid === "favicon.ico") {
        return res.status(404)
    }
    Slide.findOne({_id:req.params.slideid,userId:req.user._id})
        
        .then(slide => {
            if(!slide){
                return res.redirect("/");
            }
            return slide;
        })
        .then(slide=>{
            Product.find()
            .select("name")
            .then(product=>{
                About.find()
                .where({isActive:true})
                .select("name")
                .then(about=>{
                    Services.find()
                    .where({isActive:true})
                    .select("name")
                    .then(services=>{
                        Project.find()
                        .where({isActive:true})
                        .select("name")
                        .then(project=>{
                            Blog.find()
                            .where({isActive:true})
                            .select("title")
                            .then(blog=>{
                                Client.find()
                                .where({isActive:true})
                                .select("name")
                                .then(client=>{
                                    res.render('admin/edit-slide', {
                                        title: 'Edit Slide',
                                        path: '/admin/slide',
                                        slide: slide,
                                        product:product,
                                        about:about,
                                        services:services,
                                        project:project,
                                        blog:blog,
                                        client:client,
                                    });
                                })
                        })
                })
            })
        })
    })
})


        .catch(err => { next(err); });
}

exports.postEditSlide = async (req, res, next) => {


    const id = req.body.slideid;
    const title = req.body.title;
    const description = req.body.description;
    const buttonName = req.body.buttonName;
    const buttonLink = req.body.buttonLink;
    const animate = req.body.animate;
    const isActive = Boolean(req.body.isActive);
    const image=req.files.slideimg;
    if(image){
        await sharp(req.files.slideimg[0].path)
        .resize(1280)
        .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
        .toFile(
            path.resolve(req.files.slideimg[0].destination,'resized',image[0].filename)
        )
        fs.unlinkSync(req.files.slideimg[0].path)
    }
    Slide.findOne({_id:id})
        .then(slide=>{
            if(!slide){
                return res.redirect("/");
            }
            slide.title=title,
            slide.description=description,
            slide.buttonName=buttonName,
            slide.buttonLink=buttonLink,
            slide.animate=animate,
            slide.isActive=isActive
            if (image) {
                fs.unlink("wwwroot/img/resized/"+slide.image,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                slide.image = image[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:slide.title+" başlıklı slaytı güncelledi."
                });

            progress.save()
            return slide.save();
        }).then(result=>{
            res.redirect('/admin/slide?action=edit');
        })
        .catch(err => next(err));

    
}

exports.postDeleteSlide = (req, res, next) => {

    const id = req.body.slideid;
    Slide.findOne({_id:id,userId:req.user._id})
        .then(slide=>{
            if(!slide){
                return next(new Error("Silinmek istenen slide bulumadı."));
            }
            fs.unlink("wwwroot/img/resized/"+slide.image,err=>{
                if(err){
                console.log(err);
                }
            });
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:slide.title+" başlıklı slaytı sildi."
                });
            progress.save()
            return Slide.deleteOne({_id:id,userId:req.user._id})

        }).then((result) => {
            if(result.deletedCount===0){
                return next(new Error("Silinmek istenen slide bulumadı."));
            }
            res.redirect('/admin/slide?action=delete');
        })
        .catch(err => {
            next(err);
        });
    
}