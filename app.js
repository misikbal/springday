const compression = require('compression')
const spdy = require("spdy")
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");
var minimonster = require('minimonster').middleware;
app.use(compression())
app.set("view engine", "pug");
app.set("views", "./views");
const mainModeRoutes = require("./routes/mainMode");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const accountRoutes = require("./routes/account");

const User=require("./model/user");
const System=require("./model/system");
const About=require("./model/about");
const Category=require("./model/category");
const Lang=require("./model/lang");
const News=require("./model/news");
const Post=require("./model/post");













//  mongodb+srv://misikbal:A1b2c3d4.@cluster0.jajbp.mongodb.net/sptrindDay?retryWrites=true&w=majority
const connectionString="mongodb+srv://springdayAdmin:A1b2c3d4.@cluster0.pwmu2.mongodb.net/node?retryWrites=true&w=majority";
const mongoose =require("mongoose");
const cookieParser = require('cookie-parser');
const session=require("express-session");
const mongoDbStore=require("connect-mongodb-session")(session);
const csurf= require("csurf");
const multer=require("multer");
const locals=require("./middleware/locals");
const isAdmin=require("./middleware/isAdmin");
const isFile=require("./middleware/isFile");
const isMainMode=require("./middleware/isMainMode");


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
app.use(cookieParser());
app.use(minimonster.minify({ 
    src: __dirname + '/public/wwwroot', // required
    useInMemoryCache: true, // defaults to true
    inMemoryCacheTTL: 108000, // defaults to 3 hours
    cacheDirectoryName:  "_mm", // defaults to "_mm"
    cacheExtension: ".mini", // defaults to ".mini"
    debugMode: false, // defaults to false
    cssCompressor: 'yui-css', // defaults to "yui-css"
    // jsCompressor:  'uglifyjs', // defaults to "uglifyjs"
    maxAge: 864000000 // default to 1 day
}));
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
app.use(express.static(path.join(__dirname, "wwwroot"), { maxAge: 86400000 }));
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



app.use((req,res,next)=>{
    if(!req.session.user){
        res.cookie('lang', 'tr', {
            expires: new Date(Date.now() + 2592000000)
        });
        return next();
    }
    res.cookie('lang', 'tr', {
        expires: new Date(Date.now() + 2592000000)
    });
    User.findById(req.session.user._id)
        .then(user=>{
            req.user=user;
            next();
        })
        .catch(err=>{console.log(err)});
        

})

app.use( async(req,res,next)=>{    
    await System.findOne()
        .lean()
        .then(async(system)=>{
                    await Category.find()
                        .lean()
                        .where({ isActive: true })
                        .then(async(menucategory) => {
                                    await Post.find({$or: [{type:"client"} , {type:"about"},{type:"lang"},{type:"news"}]})
                                        .select("client.clientlogo client.name about.name lang.lang lang.value lang.imageUrl news.title isHome isActive url type")
                                        .where({isActive: true})
                                        .sort({date: -1})
                                        .lean()
                                        .then(async(globalvalue)=>{
                                            req.baselogo=await fs.readFileSync( path.join(__dirname,"." ,"wwwroot/img/",system.logo).toString()),
                                            req.basefav=await fs.readFileSync( path.join(__dirname,"." ,"wwwroot/img/",system.favico).toString()),
                                            req.baseloading=await fs.readFileSync( path.join(__dirname,"." ,"wwwroot/img/",system.loadingLogo).toString()),
                                            req.system = await system;
                                            req.menucategory =await menucategory;
                                            req.globalvalue =await globalvalue;
                                            next();

                        });
                    
                })
                
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
        System.findOne()
        .select("protokol")
        .then(system=>{
        if(system.protokol=="http2"){
            spdy.createServer(
                {
                    key: fs.readFileSync("./server.key"),
                    cert: fs.readFileSync("./server.crt")
                },
                app
            ).listen(port, () => {
                console.log("HTTP2 Proje calıştırıldı " + port);
            });
        }
        else if(system.protokol=="http"){
            app.listen(port, () => {
                console.log("HTTP Proje calıştırıldı " + port);
            });
        }
        })

    })
    .catch(err=>{
        
        console.log(err)});
