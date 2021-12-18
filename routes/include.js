const express = require("express");
const router = express.Router();
const isAdmin=require("../middleware/isAdmin");
const locals=require("../middleware/locals");
const layoutController = require("../controllers/layout");


router.get("/api/logo",locals,layoutController.getLayout);
router.get("/api/social",locals,layoutController.getSocial);


module.exports = router;