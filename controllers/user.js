const Product=require('../model/product');
const Post=require('../model/post');
const Category=require('../model/category');




const Process=require('../model/process');
const sharp = require('sharp');
const path = require('path');

const fs=require("fs");

exports.getSlide = (req, res, next) => {
    Post.find({type:"slide"})
        .sort({date:-1})
        .populate("userId","name -_id")
        .then(slide => {
                res.render('admin/slide', {
                    title: 'Admin Slide',
                    slide: slide,
                    path: '/admin/slide',
                    action: req.query.action
                });
        })
        .catch((err) => {
            next(err);
        });
}

exports.getAddSlide = (req, res, next) => {
    Product.find()
    .select("name")
    .then(product=>{
        Category.find({isActive: true})
        .select("name")
        .then(category=>{
            Post.find({$or: [{type:"news"} , {type:"about"},{type:"aboutservices"},{type:"project"}]})
            .where({isActive: true})
            .select("type url project.name aboutservices.name news.title about.name")
            .then(post=>{
                res.render('admin/add-slide', {
                    title: 'New Slide',
                    path: '/admin/add-slide',
                    product:product,
                    category:category,
                    post:post,
                    inputs:{
                        image:"",
                        title:"",
                        description:"",
                        buttonName:"",
                        buttonLink:"",
                        animate:"",
                        isActive:"",
                    }      
            })
            
        });
        })
        
        })
}

exports.postAddSlide = async(req, res, next) => {
    // const writeFileAsync = require('util').promisify(require('fs').writeFile);
    const {filename:image}=req.files.slideimg[0];

    
    const title = req.body.title;
    const description = req.body.description;
    const buttonName = req.body.buttonName;
    const buttonLink=req.body.buttonLink;
    const animate=req.body.animate;
    const isActive = Boolean(req.body.isActive);
    if(!image){
        return res.render('admin/add-slide', {
            title: 'New Slide',
            path: '/admin/add-slide',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                title:title,
                description:description,
                buttonName:buttonName,
                animate:animate,
                isActive:isActive,
            }      
        });
    }
    
    const resizedImageBuf=await sharp(req.files.slideimg[0].path)
    .resize(540)
    .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
    .toBuffer()
    // await writeFileAsync(req.files.slideimg[0].destination+"/"+req.files.slideimg[0].filename.toString().split(".webp")[0]+".txt", "data:"+req.files.slideimg[0].mimetype+";base64,"+resizedImageBuf.toString('base64'), 'utf-8');
    const slide = new Post(
        {   
            type:"slide",
            isActive:isActive,
            userId:req.user,
            date:Date.now(),
            slide:{
                image: "data:"+req.files.slideimg[0].mimetype+";base64,"+resizedImageBuf.toString('base64'),
                title:title,
                description:description,
                buttonName:buttonName,
                buttonLink:buttonLink,
                animate:animate,
            }
            

        }
    );
    const progress=new Process(
        { 
            userId:req.user,
            type:"insert",
            name:slide.slide.title+" başlıklı slaytı ekledi"
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
    Post.findOne({_id:req.params.slideid})
        
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
                Category.find({isActive: true})
                .select("name")
                .then(category=>{
                    Post.find({$or: [{type:"news"} , {type:"about"},{type:"aboutservices"},{type:"project"}]})
                    .where({isActive: true})
                    .select("type url project.name aboutservices.name news.title about.name")
                    .then(post=>{
                                    res.render('admin/edit-slide', {
                                        title: 'Edit Slide',
                                        path: '/admin/slide',
                                        slide: slide,
                                        product:product,
                                        post:post,
                                        category:category
                                    });
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
    Post.findOne({_id:id})
        .then(async(slide)=>{
            if(!slide){
                return res.redirect("/");
            }
            slide.slide.title=title,
            slide.slide.description=description,
            slide.slide.buttonName=buttonName,
            slide.slide.buttonLink=buttonLink,
            slide.slide.animate=animate,
            slide.isActive=isActive
            if (image) {
                // const writeFileAsync = require('util').promisify(require('fs').writeFile);                
                const resizedImageBuf= await sharp(req.files.slideimg[0].path)
                .resize(540)
                .webp({quality:10,alphaQuality:10,lossless:true,progressive:true})
                .jpeg({quality:10,alphaQuality:10,lossless:true,progressive:true})
                .png({quality:10,alphaQuality:10,lossless:true,progressive:true})
                // .toBuffer()
                // await writeFileAsync(req.files.slideimg[0].destination+"/"+req.files.slideimg[0].filename.toString().split(".webp")[0]+".txt", "data:"+req.files.slideimg[0].mimetype+";base64,"+resizedImageBuf.toString('base64'), 'utf-8');
                .toFile(
                    path.resolve(
                    req.files.slideimg[0].destination,
                    "resized",
                    req.files.slideimg[0].filename
                    )
                );
                fs.unlinkSync(req.files.slideimg[0].path);
                // slide.slide.image =  "data:"+req.files.slideimg[0].mimetype+";base64,"+resizedImageBuf.toString('base64');
                slide.slide.image=req.files.slideimg[0].filename;
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"edit",
                    name:slide.slide.title+" başlıklı slaytı güncelledi."
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
    Post.findOne({_id:id})
        .then(slide=>{
            if(!slide){
                return next(new Error("Silinmek istenen slide bulumadı."));
            }
            const progress=new Process(
                { 
                    userId:req.user,
                    type:"delete",
                    name:slide.slide.title+" başlıklı slaytı sildi."
                });
            progress.save()
            return Post.deleteOne({_id:id})

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