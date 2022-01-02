const express = require("express");
const router = express.Router();
const isAuthenticated=require("../middleware/authentication");
const locals=require("../middleware/locals");
const isMainMode=require("../middleware/isMainMode");
const ecommerce=require("../middleware/ecommerce");
const shopController = require("../controllers/shop");


router.get("/",locals,isMainMode,shopController.getIndex);

router.get("/products",locals,isMainMode, shopController.getProducts);
router.get("/products/:productid", locals,isMainMode,shopController.getProduct);
router.get("/categories/:categoryid", locals,isMainMode,shopController.getProductsByCategoryId);

router.get("/cart",locals,isMainMode,ecommerce,isAuthenticated, shopController.getCart);
router.post("/cart",locals,isMainMode,ecommerce,isAuthenticated, shopController.addToCart);

router.get("/aboutservices", locals,isMainMode,shopController.getAboutServices);
router.get("/aboutservices/:aboutserviceid", locals,isMainMode,shopController.getAboutService);

router.get("/project", locals,isMainMode,shopController.getProjects);
router.get("/project/:projectid", locals,isMainMode,shopController.getProject);


router.get("/about", locals,isMainMode,shopController.getAbouts);
router.get("/about/:aboutid", locals,isMainMode,shopController.getAbout);

router.get("/news", locals,isMainMode,shopController.getAllNews);
router.get("/news/:newsid", locals,isMainMode,shopController.getNews);

router.get("/contactus",locals,isMainMode, shopController.getContact);
router.post("/contactus", shopController.postAddContact);


router.post("/delete-cartItem",locals,isMainMode,ecommerce,isAuthenticated, shopController.postCartItemDelete);
router.get("/create-order",locals,isMainMode,ecommerce,isAuthenticated, shopController.getAdress);
router.post("/create-order",locals,isMainMode,ecommerce,isAuthenticated, shopController.postOrder);
router.get("/orders/:orderid",locals,isMainMode,ecommerce,isAuthenticated, shopController.getOrder);
router.post("/orders/:orderid",locals,isMainMode,ecommerce,isAuthenticated, shopController.postPayment);

router.get("/orders",locals,isMainMode,ecommerce,isAuthenticated, shopController.getOrders);



router.get("/client",locals,isMainMode, shopController.getClient);

module.exports = router;