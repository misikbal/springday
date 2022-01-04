const express = require("express");
const router = express.Router();
const isAuthenticated=require("../middleware/authentication");
const locals=require("../middleware/locals");

const about=require("../middleware/about");
const cart=require("../middleware/cart");
const client=require("../middleware/client");
const contact=require("../middleware/contact");
const home=require("../middleware/home");
const products=require("../middleware/products");
const project=require("../middleware/project");
const services=require("../middleware/services");
const user=require("../middleware/user");

const isMainMode=require("../middleware/isMainMode");
const ecommerce=require("../middleware/ecommerce");
const shopController = require("../controllers/shop");


router.get("/",locals,home,isMainMode,shopController.getIndex);

router.get("/products",locals,products,isMainMode, shopController.getProducts);
router.get("/products/:productid", locals,products,isMainMode,shopController.getProduct);
router.get("/categories/:categoryid", locals,products,isMainMode,shopController.getProductsByCategoryId);

router.get("/cart",locals,cart,isMainMode,ecommerce,isAuthenticated, shopController.getCart);
router.post("/cart",locals,cart,isMainMode,ecommerce,isAuthenticated, shopController.addToCart);

router.get("/aboutservices", locals,services,isMainMode,shopController.getAboutServices);
router.get("/aboutservices/:aboutserviceid", locals,services,isMainMode,shopController.getAboutService);

router.get("/project", locals,project,isMainMode,shopController.getProjects);
router.get("/project/:projectid", locals,project,isMainMode,shopController.getProject);


router.get("/about", locals,about,isMainMode,shopController.getAbouts);
router.get("/about/:aboutid", locals,about,isMainMode,shopController.getAbout);

router.get("/news", locals,isMainMode,shopController.getAllNews);
router.get("/news/:newsid", locals,isMainMode,shopController.getNews);

router.get("/contactus",locals,contact,isMainMode, shopController.getContact);
router.post("/contactus", shopController.postAddContact);


router.post("/delete-cartItem",locals,user,isMainMode,ecommerce,isAuthenticated, shopController.postCartItemDelete);
router.get("/create-order",locals,user,isMainMode,ecommerce,isAuthenticated, shopController.getAdress);
router.post("/create-order",locals,user,isMainMode,ecommerce,isAuthenticated, shopController.postOrder);
router.get("/orders/:orderid",locals,user,isMainMode,ecommerce,isAuthenticated, shopController.getOrder);
router.post("/orders/:orderid",locals,user,isMainMode,ecommerce,isAuthenticated, shopController.postPayment);

router.get("/orders",locals,user,isMainMode,ecommerce,isAuthenticated, shopController.getOrders);



router.get("/client",locals,client,isMainMode, shopController.getClient);

module.exports = router;