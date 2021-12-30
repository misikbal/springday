const express = require("express");
const router = express.Router();
const isAdmin=require("../middleware/isAdmin");
const locals=require("../middleware/locals");
const adminController = require("../controllers/admin");


router.get("/mainMode",locals,adminController.getMainMode);



module.exports = router;