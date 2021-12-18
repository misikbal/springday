const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const accountController = require('../controllers/account');


const isAdmin=require("../middleware/isAdmin");
const locals=require("../middleware/locals");
router.get('/',locals,isAdmin, adminController.getTasks);




router.get('/products',locals,isAdmin, adminController.getProducts);
router.get('/add-product',locals, isAdmin,adminController.getAddProduct);
router.post('/add-product',locals,isAdmin, adminController.postAddProduct);
router.get('/products/:productid',locals,isAdmin, adminController.getEditProduct);
router.post('/products',locals,isAdmin, adminController.postEditProduct);
router.post('/delete-product',locals,isAdmin, adminController.postDeleteProduct);



router.get('/add-category',locals,isAdmin, adminController.getAddCategory);
router.post('/add-category',locals,isAdmin, adminController.postAddCategory);
router.get('/categories',locals,isAdmin, adminController.getCategories);
router.get('/categories/:categoryid',locals, isAdmin,adminController.getEditCategory);
router.post('/categories',locals,isAdmin, adminController.postEditCategory);
router.post('/delete-category',locals,isAdmin, adminController.postDeleteCategory);




router.get('/slide',locals,isAdmin, userController.getSlide);
router.get('/add-slide',locals, isAdmin,userController.getAddSlide);
router.post('/add-slide',locals,isAdmin, userController.postAddSlide);
router.get('/slide/:slideid',locals,isAdmin, userController.getEditSlide);
router.post('/slide',locals,isAdmin, userController.postEditSlide);
router.post('/delete-slide',locals,isAdmin, userController.postDeleteSlide);




router.get('/client',locals,isAdmin, adminController.getClient);
router.get('/add-client',locals, isAdmin,adminController.getAddClient);
router.post('/add-client',locals,isAdmin, adminController.postAddClient);
router.get('/client/:clientid',locals,isAdmin, adminController.getEditClient);
router.post('/client',locals,isAdmin, adminController.postEditClient);
router.post('/delete-client',locals,isAdmin, adminController.postDeleteClient);




router.get('/services',locals,isAdmin, adminController.getServices);
router.get('/add-services',locals, isAdmin,adminController.getAddServices);
router.post('/add-services',locals,isAdmin, adminController.postAddServices);
router.get('/services/:serviceid',locals,isAdmin, adminController.getEditServices);
router.post('/services',locals,isAdmin, adminController.postEditServices);
router.post('/delete-services',locals,isAdmin, adminController.postDeleteServices);




router.get('/aboutservices',locals,isAdmin, adminController.getAboutServices);
router.get('/add-aboutservices',locals, isAdmin,adminController.getAddAboutServices);
router.post('/add-aboutservices',locals,isAdmin, adminController.postAddAboutServices);
router.get('/aboutservices/:aboutserviceid',locals,isAdmin, adminController.getEditAboutServices);
router.post('/aboutservices',locals,isAdmin, adminController.postEditAboutServices);
router.post('/delete-aboutservices',locals,isAdmin, adminController.postDeleteAboutServices);




router.get('/project',locals,isAdmin, adminController.getProject);
router.get('/add-project',locals, isAdmin,adminController.getAddProject);
router.post('/add-project',locals,isAdmin, adminController.postAddProject);
router.get('/project/:projectid',locals,isAdmin, adminController.getEditProject);
router.post('/project',locals,isAdmin, adminController.postEditProject);
router.post('/delete-project',locals,isAdmin, adminController.postDeleteProject);




router.get('/contact',locals,isAdmin,adminController.getContact);
router.get('/contact/:contactid',locals,isAdmin,adminController.getContactDetail);
router.post('/delete-contact',locals,isAdmin, adminController.postDeleteContact);



router.get('/mail',locals,isAdmin,accountController.getMail);
router.post('/mail',locals,isAdmin, accountController.postEditMail);



router.get('/system',locals,isAdmin,adminController.getSystems);
router.post('/system',locals,isAdmin, adminController.postEditSystems);





router.get('/logo',locals,isAdmin,adminController.getLogo);
router.post('/logo',locals,isAdmin, adminController.postEditLogo);




router.get("/themes",locals,isAdmin,adminController.getThemes);
router.post("/themes",locals,isAdmin,adminController.postEditThemes);





router.get("/social",locals,isAdmin,adminController.getSocialMedia);
router.post("/social",locals,isAdmin,adminController.postEditSocialMedia);

module.exports = router;   