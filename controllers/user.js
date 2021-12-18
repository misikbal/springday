const Slide=require('../model/slide');
const Product=require('../model/product');

const mongoose =require("mongoose");
const fs=require("fs");

exports.getSlide = (req, res, next) => {
    Slide.find()
        .sort({date:-1})
        .select("image title description buttonName buttonLink animate isActive")
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
    
    res.render('admin/add-slide', {
        title: 'New Slide',
        path: '/admin/add-slide',
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
}

exports.postAddSlide = async(req, res, next) => {
    const image=req.files;
    const title = req.body.title;
    const description = req.body.description;
    const buttonName = req.body.buttonName;
    const buttonLink=req.body.buttonLink;
    const animate=req.body.animate;
    const isActive = req.body.isActive;

    console.log(image.slideimg[0]);
    if(!image.slideimg[0]){
        return res.render('admin/add-slide', {
            title: 'New Slide',
            path: '/admin/add-slide',
            errorMessage:"Lüften bir resim seçiniz",
            inputs:{
                // image:image.file,
                title:title,
                description:description,
                buttonName:buttonName,
                buttonLink:buttonLink,
                animate:animate,
                isActive:isActive,
            }      
        });
    }
    const slide = new Slide(
        {   
            image: image.slideimg[0].filename,
            title:title,
            description:description,
            buttonName:buttonName,
            buttonLink:buttonLink,
            animate:animate,
            isActive:isActive,
            userId:req.user,
        }
    );

    slide.save()
        .then(() => {
            res.redirect('/admin/slide');
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
                        buttonLink:buttonLink,
                        animate:animate,
                        isActive:isActive,
                    }
                });
            }else{
                
                next(err);
            }
        
    });


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
                res.render('admin/edit-slide', {
                    title: 'Edit Slide',
                    path: '/admin/slide',
                    slide: slide,
                    product:product
                });
                    })
                    })

        .catch(err => { next(err); });
}

exports.postEditSlide = (req, res, next) => {


    const id = req.body.slideid;
    const title = req.body.title;
    const description = req.body.description;
    const buttonName = req.body.buttonName;
    const buttonLink = req.body.buttonLink;
    const animate = req.body.animate;
    const isActive = req.body.isActive;
    const image = req.files;

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
            if (image.slideimg) {
                fs.unlink("wwwroot/img/"+slide.image,err=>{
                    if(err){
                    console.log(err);
                    }
                });
                slide.image = image.slideimg[0].filename;
            }
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
            fs.unlink("wwwroot/img/"+slide.image,err=>{
                if(err){
                console.log(err);
                }
            });
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