const express = require('express');
const router = express.Router();
const accountController=require("../controllers/account");
const locals=require("../middleware/locals");
const auth=require("../middleware/isAuth");

router.get("/login",locals,auth,accountController.getLogin);
router.post("/login",locals,auth,accountController.postLogin);

router.get("/register",locals,auth,accountController.getRegister);
router.post("/register",auth,accountController.postRegister);
router.get("/logout",locals,accountController.getLogout);

router.get("/reset-password",locals,auth,accountController.getReset);
router.post("/reset-password",locals,auth,accountController.postReset );

router.get("/reset-password/:token",auth,locals,accountController.getNewPassword);
router.post("/new-password",locals,auth,accountController.postNewPassword );

module.exports=router;



