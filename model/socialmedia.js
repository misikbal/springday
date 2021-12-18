const mongoose = require('mongoose');
const SocialMediaSchema = mongoose.Schema({

    facebook:String,
    instagram:String,
    twitter:String,
    linkedin:String,
    youtube:String,
    mail:String,
    phone:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
});

module.exports = mongoose.model('Socialmedia', SocialMediaSchema);