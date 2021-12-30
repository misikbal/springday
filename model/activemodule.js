const mongoose = require('mongoose');

const activemoduleSchema = mongoose.Schema({
    contactnavbar_isActive:Boolean,
    whatsapp_isActive:Boolean,
    tawkto_isActive:Boolean,
    darkmode_isActive:Boolean,
    translate_isActive:Boolean,
    ecommarce_isActive:Boolean,
    isNavbar:{
        type:Boolean},
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
});

module.exports = mongoose.model('activemodule', activemoduleSchema);