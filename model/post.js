const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    aboutservices:{
        imageUrl:{
            type:String,
        },
        name:{
            type:String,
        },
        description:{
            type:String,
        },
        tags:{
            type:Array,
            default: undefined
        },
    },
    client:{
        clientlogo:{
            type:String,
        },
        name:{
            type:String,
        },
        description:{
            type:String,
        },
        link:{
            type:String,
        },
    },

    about:{
        name:{
            type:String,
        },
        description:{
            type:String,
        },

    },
    news:{
        title:String,
        description: String,
        imageUrl: String,
        tags:{
            type:Array,
            default: undefined
        },
        newsdate: String,
    },
    project:{
        imageUrl:{
            type:String
        },
        name:{
            type:String
        },
        description:{
            type:String,
        },
        tags:{
            type:Array,
            default:undefined
        }
    },

    shortservices:{
        
        icon:{
            type:String
        },
        name:{
            type:String
        },
        description:{
            type:String,
        }
    },
    slide:{

        image:{
            type:String
        },
        title: {
            type: String,
            trim:true
        },
        description: {
            type: String,
        },
        buttonName: String,
        buttonLink: String,
        animate:String,
    },
    lang:{
        lang:String,
        imageUrl: String,
        value:String
    },
    type:String,
    isActive:Boolean,
    isHome:Boolean,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    date: {
        type: Date
    },
    url:String,
    newsdate:String

});

module.exports = mongoose.model('Post', postSchema);