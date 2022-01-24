const mongoose = require('mongoose');;
const settingsSchema = mongoose.Schema({
    //settings
    siteUrl:{
        type:String,
        required:true
    },
    protokol:{
        type:String,
        default:"http2"
    },
    language: {
        type: String,
        trim:true
    },
    mainMode: {
        type: Boolean,
    },
    isMemory: {
        type: Boolean,
    },
    phone: String,
    mail: String,
    address:String,

    googlemaps:{
        type:String,
    },
    sgMail:{
        type:String,
    },
    tawktoscript:{
        type:String,
    },
    googleAnalitcs:{
        type:String,
    },
    tags:{
        type:String,
    },
    description:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    },
    //active
    contactnavbar_isActive:Boolean,
    whatsapp_isActive:Boolean,
    tawkto_isActive:Boolean,
    darkmode_isActive:Boolean,
    translate_isActive:Boolean,
    ecommarce_isActive:Boolean,
    isNavbar:Boolean,


    //page
    home: String,
    home_isActive:Boolean,
    products:String,
    products_isActive:Boolean,

    services:String,
    services_isActive:Boolean,

    about:String,
    about_isActive:Boolean,

    project:String,
    project_isActive:Boolean,

    client:String,
    client_isActive:Boolean,

    contact:String,
    contact_isActive:Boolean,

    cart:String,
    cart_isActive:Boolean,

    user:String,
    user_isActive:Boolean,
    
    blog:String,
    blog_isActive:Boolean,




    //social media
    facebook:String,
    instagram:String,
    twitter:String,
    linkedin:String,
    youtube:String,
    contactmail:String,
    contactphone:String,



    //Logo
    logo:{
        type:String,
    },
    favico:{
        type:String,
    },
    footerLogo:{
        type:String,
    },
    loadingLogo:{
        type:String,
    },
    loadingisActive:{
        type:Boolean
    },
    loadingtext:String,


    //themes

    navbarLight:{
        type:String,
    },
    navbarDark:{
        type:String,
    },
    bodyLight:{
        type:String,
    },
    bodyDark:{
        type:String,
    },
    infoLight:{
        type:String,
    },
    infoDark:{
        type:String,
    },
    footerLight:{
        type:String,
    },
    footerDark:{
        type:String,
    },
    cardLight:{
        type:String,
    },
    cardrDark:{
        type:String,
    },


    //footer

    title: {
        type:String,
    },
    footerdescription:{
        type:String
    },
    slogan:{
        type:String
    },
    alt:{
        type:String
    },
});

module.exports = mongoose.model('Settings', settingsSchema);