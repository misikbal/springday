const compression = require('compression')
const spdy = require("spdy")
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");
app.use(compression())
app.set("view engine", "pug");
app.set("views", "./views");
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 300, checkperiod: 310 } );
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
const Lang=require("./model/lang");
const Footer=require("./model/footer");
const News=require("./model/news");











//  mongodb+srv://misikbal:A1b2c3d4.@cluster0.jajbp.mongodb.net/sptrindDay?retryWrites=true&w=majority
const connectionString="mongodb+srv://springdayAdmin:A1b2c3d4.@cluster0.pwmu2.mongodb.net/node?retryWrites=true&w=majority";
const mongoose =require("mongoose");

const session=require("express-session");
const mongoDbStore=require("connect-mongodb-session")(session);
const csurf= require("csurf");
const multer=require("multer");
const locals=require("./middleware/locals");
const isAdmin=require("./middleware/isAdmin");
const isFile=require("./middleware/isFile");
const fs=require("fs");
const sharp = require('sharp');


const error = require("./controllers/errors");
const port = process.env.PORT || 8000;
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

app.use(
    
    session({
        secret:process.env.SECRET ||"b92aaa7646686ed3833a60b352778234d1ea31e77d4122216e46523b411464ef",
        resave: true,
        saveUninitialized:false,
        cookie:{
            maxAge:36000000
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
    { name: 'loadingLogo', maxCount: 1 },
    { name: 'cimage', maxCount: 1 },
    { name:"slideimg",maxCount:1},
    { name: 'categoryImg', maxCount: 1 },
    { name: 'servicesImg', maxCount: 1 },
    { name: 'projectImg', maxCount: 1 },  
    { name: 'newsImg', maxCount: 1 },
    { name: 'clientlogo', maxCount: 1 },

    { name: 'flFileUpload', maxCount: 12 }, 


]));

app.use(async (req,res,next)=>{
    await Page.findOne()
        .then(async(page)=>{
            await Social.findOne()
            .then(async(social)=>{
                await Logo.findOne()
                .then(async(logo)=>{
                    await System.findOne()
                    .then(async(system)=>{
                        await Themes.findOne()
                        .then(async(theme)=>{
                            await About.find()
                            .limit(7)
                            .where({isHome:false})
                            .where({isActive:true})
                            
                            .then(async(footerabouts)=>{
                                await Category.find()
                                .where({isActive:true})
                                .then(async(menucategory)=>{
                                    await ActiveModule.findOne()
                                    .then(async(active)=>{
                                        await Lang.find()
                                        .sort({date:1})
                                        .then(async(lang)=>{
                                            await Logo.findOne()
                                            .select("loadingLogo isActive loadingtext")
                                            .then(async(loading)=>{
                                                await Footer.findOne()
                                                .then(async(footer)=>{
                                                    await News.find()
                                                    .limit(7)
                                                    .where({isActive:true})
                                                    .then(async(blog)=>{
                                                        req.system=system;
                                                        req.page=page;
                                                        req.social=social;
                                                        req.logo=logo;
                                                        req.theme=theme;
                                                        req.footerabouts=footerabouts;
                                                        req.menucategory=menucategory;
                                                        req.active=active;
                                                        req.lang=lang;
                                                        req.loading=loading;
                                                        req.footer=footer;
                                                        req.blog=blog;
    
                                                        next();
                                                    })
                                                    
                                                })
                                                    
                                                })
                                                
                                            
                                        })
                                            
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

app.get('/files',isFile,isAdmin, function (req, res) {
    const images = fs.readdirSync('wwwroot/img/upload')
    var sorted = []
    for (let item of images){
        if(item.split('.').pop() === 'png'
        || item.split('.').pop() === 'jpg'
        || item.split('.').pop() === 'jpeg'
        || item.split('.').pop() === 'svg'
        || item.split('.').pop() === 'webp'){
            var abc = {
                    "image" : "/img/upload/"+item,
                    "folder" : '/'
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
})
app.post('/upload',isFile,isAdmin,async function (req, res, next) {
    const image=req.files.flFileUpload;

    if(image){
        await sharp(req.files.flFileUpload[0].path)
        .resize(700)
        .webp({quality:30,alphaQuality:30,lossless:true,progressive:true})
        .jpeg({quality:30,alphaQuality:30,lossless:true,progressive:true})
        .png({quality:30,alphaQuality:30,lossless:true,progressive:true})
        .toFile(
            path.resolve(req.files.flFileUpload[0].destination,'upload',image[0].filename)
        )
        fs.unlinkSync(req.files.flFileUpload[0].path)
    }
    
    res.redirect('back')
});
app.post('/delete_file',isFile,isAdmin, function(req, res, next){
    var url_del =__dirname+"/wwwroot" + req.body.url_del
    console.log(req.body.url_del)
    console.log(url_del)
    if(fs.existsSync(url_del)){
        fs.unlinkSync(url_del)
    }
    res.redirect('back')
});
app.use(csurf());
app.use("/admin", adminRoutes);

app.use(function (req, res, next) {
        if (req.method != 'GET') {
        return next();
        }
        var cachedReponse = myCache.get(req.url);
        if (cachedReponse) {
        res.header(cachedReponse.headers);
        res.header('X-Proxy-Cache', 'HIT');
        return res.send(cachedReponse.body);
        } else {
        res.originalSend = res.send;
        res.send = (body) => {
            myCache.set(req.url, {
            'headers'   : res.getHeaders(),
            'body'      : body
            });
            res.header('X-Proxy-Cache', 'MISS');
            res.originalSend(body);
        };
        return next();
        }
    });

app.use(userRoutes)


app.use(mainModeRoutes)

app.use(accountRoutes);

app.use("/500",locals,error.get505page);
app.use(locals,error.get404page);
app.use((error,req,res,next)=>{
    console.log(error);
    res.status(500).render("error/500",{title:"Error"} ) 
})

mongoose.connect(process.env.MONGODB_URI || connectionString,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=>{
        console.log("mongodb baglandı");
        spdy.createServer(
            {
                key: fs.readFileSync("./server.key"),
                cert: fs.readFileSync("./server.crt")
            },
            app
        ).listen(port, () => {
            console.log("Proje calıştırıldı " + port);
        });
    })
    .catch(err=>{
        
        console.log(err)});
