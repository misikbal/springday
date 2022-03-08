const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const accountController = require('../controllers/account');
const uploadController = require('../controllers/upload');



const isAdmin=require("../middleware/isAdmin");
const isLimited=require("../middleware/isLimited");


const locals=require("../middleware/locals");

router.get('/',locals,isLimited,adminController.getTasks);




router.get('/products',locals,isLimited,adminController.getProducts);
router.get('/add-product',locals,isAdmin,adminController.getAddProduct);
router.post('/add-product',locals,isAdmin, adminController.postAddProduct);
router.get('/products/:productid',locals,isAdmin, adminController.getEditProduct);
router.post('/products',locals,isAdmin,adminController.postEditProduct);
router.post('/delete-product',locals,isAdmin,adminController.postDeleteProduct);



router.get('/add-category',locals,isAdmin, adminController.getAddCategory);
router.post('/add-category',locals,isAdmin, adminController.postAddCategory);
router.get('/categories',locals,isLimited, adminController.getCategories);
router.get('/categories/:categoryid',locals, isAdmin,adminController.getEditCategory);
router.post('/categories',locals,isAdmin, adminController.postEditCategory);
router.post('/delete-category',locals,isAdmin, adminController.postDeleteCategory);




router.get('/slide',locals, isLimited,userController.getSlide);
router.get('/add-slide',locals, isAdmin,userController.getAddSlide);
router.post('/add-slide',locals,isAdmin, userController.postAddSlide);
router.get('/slide/:slideid',locals,isAdmin, userController.getEditSlide);
router.post('/slide',locals,isAdmin, userController.postEditSlide);
router.post('/delete-slide',locals,isAdmin, userController.postDeleteSlide);




router.get('/client',locals, isLimited,adminController.getClient);
router.get('/add-client',locals, isAdmin,adminController.getAddClient);
router.post('/add-client',locals,isAdmin, adminController.postAddClient);
router.get('/client/:clientid',locals,isAdmin, adminController.getEditClient);
router.post('/client',locals,isAdmin, adminController.postEditClient);
router.post('/delete-client',locals,isAdmin, adminController.postDeleteClient);




router.get('/services',locals, isLimited,adminController.getServices);
router.get('/add-services',locals, isAdmin,adminController.getAddServices);
router.post('/add-services',locals,isAdmin, adminController.postAddServices);
router.get('/services/:serviceid',locals,isAdmin, adminController.getEditServices);
router.post('/services',locals,isAdmin, adminController.postEditServices);
router.post('/delete-services',locals,isAdmin, adminController.postDeleteServices);




router.get('/aboutservices',locals,isLimited, adminController.getAboutServices);
router.get('/add-aboutservices',locals, isAdmin,adminController.getAddAboutServices);
router.post('/add-aboutservices',locals,isAdmin, adminController.postAddAboutServices);
router.get('/aboutservices/:aboutserviceid',locals,isAdmin, adminController.getEditAboutServices);
router.post('/aboutservices',locals,isAdmin, adminController.postEditAboutServices);
router.post('/delete-aboutservices',locals,isAdmin, adminController.postDeleteAboutServices);

router.get('/about',locals,isLimited, adminController.getAbout);
router.get('/add-about',locals, isAdmin,adminController.getAddAbout);
router.post('/add-about',locals,isAdmin, adminController.postAddAbout);
router.get('/about/:aboutid',locals,isAdmin, adminController.getEditAbout);
router.post('/about',locals,isAdmin, adminController.postEditAbout);
router.post('/delete-about',locals,isAdmin, adminController.postDeleteAbout);



router.get('/project',locals, isLimited,adminController.getProject);
router.get('/add-project',locals, isAdmin,adminController.getAddProject);
router.post('/add-project',locals,isAdmin, adminController.postAddProject);
router.get('/project/:projectid',locals,isAdmin, adminController.getEditProject);
router.post('/project',locals,isAdmin, adminController.postEditProject);
router.post('/delete-project',locals,isAdmin, adminController.postDeleteProject);





router.get('/news',locals,isLimited, adminController.getNews);
router.get('/add-news',locals, isAdmin,adminController.getAddNews);
router.post('/add-news',locals,isAdmin, adminController.postAddNews);
router.get('/news/:newsid',locals,isAdmin, adminController.getEditNews);
router.post('/news',locals,isAdmin, adminController.postEditNews);
router.post('/delete-news',locals,isAdmin, adminController.postDeleteNews);





router.get('/contact',locals,isLimited,adminController.getContact);
router.get('/contact/:contactid',locals,isLimited,adminController.getContactDetail);
router.post('/delete-contact',locals,isAdmin, adminController.postDeleteContact);



router.get('/mail',locals,isLimited,accountController.getMail);
router.post('/mail',locals,isAdmin, accountController.postEditMail);



router.get('/system',locals,isAdmin,adminController.getSystems);
router.post('/system',locals,isAdmin, adminController.postEditSystems);





router.get('/logo',locals,isLimited,adminController.getLogo);
router.post('/logo',locals,isAdmin, adminController.postEditLogo);




router.get("/themes",locals,isLimited,adminController.getThemes);
router.post("/themes",locals,isAdmin,adminController.postEditThemes);





router.get("/social",locals,isLimited,adminController.getSocialMedia);
router.post("/social",locals,isAdmin,adminController.postEditSocialMedia);

router.get("/orders",locals,isLimited,adminController.getOrders);
router.get("/orders/:orderid",locals,isLimited,adminController.getOrder);

router.post("/orders",locals,isAdmin,adminController.postOrders);


router.get("/page",locals,isLimited,adminController.getPage);
router.post("/page",locals,isAdmin,adminController.postEditPage);

router.get("/process",locals,isAdmin,adminController.getProcess);
router.get("/advanced",locals,isAdmin,adminController.getAdvanced);
router.get("/users",locals,isLimited,adminController.getUsers);
router.get("/users/:userid",locals,isLimited,adminController.getUser);
router.get("/activemodule",locals,isLimited,adminController.getActiveModule);
router.post("/activemodule",locals,isAdmin,adminController.postEditActiveModule);




router.get('/alladmin',locals,isAdmin, adminController.getAdmin);
router.get('/add-admin',locals, isAdmin,adminController.getAddAdmin);
router.post('/add-admin',locals,isAdmin, adminController.postAddAdmin);
router.get('/alladmin/:adminid',locals,isAdmin, adminController.getEditAdmin);
router.post('/alladmin',locals,isAdmin, adminController.postEditAdmin);
router.post('/delete-admin',locals,isAdmin, adminController.postDeleteAdmin);




router.get('/lang',locals,isLimited, adminController.getLang);
router.get('/add-lang',locals, isAdmin,adminController.getAddLang);
router.post('/add-lang',locals,isAdmin, adminController.postAddLang);
router.get('/lang/:langid',locals,isAdmin, adminController.getEditLang);
router.post('/lang',locals,isAdmin, adminController.postEditLang);
router.post('/delete-lang',locals,isAdmin, adminController.postDeleteLang);



router.get('/bank',locals,isLimited, adminController.getBank);
router.get('/add-bank',locals, isAdmin,adminController.getAddBank);
router.post('/add-bank',locals,isAdmin, adminController.postAddBank);
router.get('/bank/:bankid',locals,isAdmin, adminController.getEditBank);
router.post('/bank',locals,isAdmin, adminController.postEditBank);
router.post('/delete-bank',locals,isAdmin, adminController.postDeleteBank);

// router.get("/password",locals,isAdmin,adminController.getReset);
// router.post("/password",locals,isAdmin,adminController.postReset );

router.get("/password",locals,isLimited,adminController.getReset);
router.post("/password",locals,isLimited,adminController.postReset );
router.get("/new-password/:token",isLimited,locals,adminController.getNewPassword);
router.post("/new-password",locals,isLimited,adminController.postNewPassword );


router.get("/footer",locals,isLimited,adminController.getFooter);
router.post("/footer",locals,isAdmin,adminController.postEditFooter);
module.exports = router;   