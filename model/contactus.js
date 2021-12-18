const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name:{
        type:String,
        required:true["İsminizi yazınız"]
    },
    mail:{
        type:String,
        required:true["Mail Adresinizi Girmelisiniz"]
    },
    subject:{
        type:String,
        required:true["Konu Alanını Boş Bırakamazsınız"]
    },
    message:{
        type:String,
        required:true["Açıklama Alanını Boş Bırakamazsınız"]
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('contactus', contactSchema);