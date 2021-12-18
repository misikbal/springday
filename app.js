const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");

app.set("view engine", "pug");
app.set("views", "./views");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const accountRoutes = require("./routes/account");
const User=require("./model/user");
//  mongodb+srv://misikbal:A1b2c3d4.@cluster0.jajbp.mongodb.net/sptrindDay?retryWrites=true&w=majority
const connectionString="mongodb+srv://springdayAdmin:A1b2c3d4.@cluster0.pwmu2.mongodb.net/node?retryWrites=true&w=majority";
const mongoose =require("mongoose");

const session=require("express-session");
const mongoDbStore=require("connect-mongodb-session")(session);
const csurf= require("csurf");
const multer=require("multer");
const sharp = require('sharp');
const locals=require("./middleware/locals");

const error = require("./controllers/errors");

var store=new mongoDbStore({
    uri:connectionString,
    collection:"mySessions"
})

var store=new mongoDbStore({
    uri:connectionString,
    collection:"mySessions"
})
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
});
app.use(session({
    secret:"keyboard cat",
    resave: true,
    saveUninitialized:false,
    cookie:{
        maxAge:3600000
    },
    store:store
}));


// const { filename: image } = req.files;

// await sharp(req.file.path)
// .rotate()
// .resize(500)
// .toFile(
//     path.resolve(req.file.destination,'resized',image.webp)
// )
// fs.unlinkSync(req.file.path)


const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null, "./wwwroot/img/")
    },
    filename:function (req,file,cb) {
        cb(null,file.fieldname+"-"+ Date.now()+path.extname(file.originalname))
    }
})
app.use(bodyparser.urlencoded({ extended: true }));
app.use(multer({storage:storage}).fields([
    { name:'image', maxCount:1},    
    { name: 'logo', maxCount: 1 },
    { name: 'favico', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
    { name: 'cimage', maxCount: 1 },
    { name:"slideimg",maxCount:1},
    { name: 'categoryImg', maxCount: 1 },
    { name: 'servicesImg', maxCount: 1 },
    { name: 'projectImg', maxCount: 1 },  

]));

app.use(express.static(path.join(__dirname, "wwwroot")));
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            req.user=user;
            next();
        })
        .catch(err=>{console.log(err)});
        

})
app.use(csurf());
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);
app.use("/500",locals,error.get505page);
app.use(locals,error.get404page);
app.use((error,req,res,next)=>{
    console.log(error);
    res.status(500).render("error/500",{title:"Error"} ) 
})

mongoose.connect(process.env.MONGODB_URI || connectionString,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=>{
        console.log("connected to mongodb");
        app.listen(1000);
    })
    .catch(err=>{
        
        console.log(err)});
