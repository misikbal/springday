const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");

app.set("view engine", "pug");
app.set("views", "./views");
const mainModeRoutes = require("./routes/mainMode");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const accountRoutes = require("./routes/account");

const User=require("./model/user");
const Page=require("./model/page");
const Social=require("./model/socialmedia");
const Logo=require("./model/logo");
const System=require("./model/system");
const Themes=require("./model/themes");
const About=require("./model/about");
const Category=require("./model/category");
const ActiveModule=require("./model/activemodule");
const Slide=require("./model/slide");









//  mongodb+srv://misikbal:A1b2c3d4.@cluster0.jajbp.mongodb.net/sptrindDay?retryWrites=true&w=majority
const connectionString="mongodb+srv://springdayAdmin:A1b2c3d4.@cluster0.pwmu2.mongodb.net/node?retryWrites=true&w=majority";
const mongoose =require("mongoose");

const session=require("express-session");
const mongoDbStore=require("connect-mongodb-session")(session);
const csurf= require("csurf");
const multer=require("multer");
const sharp = require('sharp');
const locals=require("./middleware/locals");
const isAdmin=require("./middleware/isAdmin");

const MulterSharpResizer = require("multer-sharp-resizer");
const fs=require("fs");


const error = require("./controllers/errors");
const port = process.env.PORT || 8000;
var store=new mongoDbStore({
    uri:connectionString,
    collection:"mySessions"
})

// var store=new mongoDbStore({
//     uri:connectionString,
//     collection:"mySessions"
// })
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
});

app.use(session({
    secret:"springday",
    resave: true,
    saveUninitialized:false,
    cookie:{
        maxAge:3600000
    },
    store:store
}));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "wwwroot")));
app.use(express.json())
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Not an image! Please upload only images.", false);
    }
};

const storage=multer.diskStorage({
    destination:path.resolve(__dirname,"." ,"wwwroot/img/"),
    filename : function(req, file, callback) {
        callback(null, file.fieldname+"-"+ Date.now()+path.extname(file.originalname.toString().split(".")[0]+".webp"))
    }
})

app.use(multer({storage:storage,fileFilter: multerFilter}).fields([
    { name:'image', maxCount:1},    
    { name: 'logo', maxCount: 1 },
    { name: 'favico', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
    { name: 'cimage', maxCount: 1 },
    { name:"slideimg",maxCount:1},
    { name: 'categoryImg', maxCount: 1 },
    { name: 'servicesImg', maxCount: 1 },
    { name: 'projectImg', maxCount: 1 },  
    { name: 'newsImg', maxCount: 1 }, 
    { name: 'flFileUpload', maxCount: 12 }, 


]));


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

app.use((req,res,next)=>{
    Page.findOne()
        .then(page=>{
            Social.findOne()
            .then(social=>{
                Logo.findOne()
                .then(logo=>{
                    System.findOne()
                    .then(system=>{
                        Themes.findOne()
                        .then(theme=>{
                            About.find()
                            .where({isHome:false})
                            .where({isActive:true})
                            .then(footerabouts=>{
                                Category.find()
                                .then(menucategory=>{
                                    ActiveModule.findOne()
                                    .then(active=>{
                                            req.system=system;
                                            req.page=page;
                                            req.social=social;
                                            req.logo=logo;
                                            req.theme=theme;
                                            req.footerabouts=footerabouts;
                                            req.menucategory=menucategory;
                                            req.active=active;
                                            next();
                                        })
                                        
                                    
                                })
                                
                            })
                            
                        })
                        
                    })

                })
                
            })
            
        })
        .catch(err=>{console.log(err)});
        

})
app.use("/admin", adminRoutes);

app.use(userRoutes)


app.use(mainModeRoutes)

app.get('/files',locals,isAdmin, function (req, res) {
    const images = fs.readdirSync('wwwroot/img')
    var sorted = []
    for (let item of images){
        if(item.split('.').pop() === 'png'
        || item.split('.').pop() === 'jpg'
        || item.split('.').pop() === 'jpeg'
        || item.split('.').pop() === 'svg'
        || item.split('.').pop() === 'webp'){
            var abc = {
                    "image" : "/img/"+item,
                    "folder" : '/'
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
})
  //upload image to folder upload
app.post('/upload',locals,isAdmin, function (req, res, next) {
        res.redirect('back')
});
  //delete file
app.post('/delete_file',locals,isAdmin, function(req, res, next){
    var url_del = 'public' + req.body.url_del
    console.log(url_del)
    if(fs.existsSync(url_del)){
        fs.unlinkSync(url_del)
    }
    res.redirect('back')
});
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
        app.listen(port, () => {
            console.log("App is running on port " + port);
        });
    })
    .catch(err=>{
        
        console.log(err)});
