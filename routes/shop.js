const express = require("express");
const router = express.Router();
const isAuthenticated=require("../middleware/authentication");
const locals=require("../middleware/locals");
const shopController = require("../controllers/shop");
const adminController = require("../controllers/admin");
const layoutController = require("../controllers/layout");


router.get("/",locals,shopController.getIndex);

router.get("/products",locals, shopController.getProducts);
router.get("/products/:productid", locals,shopController.getProduct);
router.get("/categories/:categoryid", locals,shopController.getProductsByCategoryId);

router.get("/cart",locals,isAuthenticated, shopController.getCart);
router.post("/cart",locals,isAuthenticated, shopController.addToCart);

router.get("/aboutservices", locals,shopController.getAboutServices);
router.get("/aboutservices/:aboutserviceid", locals,shopController.getAboutService);

router.get("/project", locals,shopController.getProjects);
router.get("/project/:projectid", locals,shopController.getProject);

router.get("/contactus",locals, shopController.getContact);
router.post("/contactus", shopController.postAddContact);

router.post("/delete-cartItem",locals,isAuthenticated, shopController.postCartItemDelete);
router.post("/create-order",locals,isAuthenticated, shopController.postOrder);
router.get("/orders",locals,isAuthenticated, shopController.getOrders);
router.get("/api/logo",locals,layoutController.getLayout);
router.get("/api/social",locals,layoutController.getSocial);

module.exports = router;