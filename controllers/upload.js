
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Not an image! Please upload only images.", false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
const uploadImages= upload.fields([
    { name:'image', maxCount:5},    
    { name: 'logo', maxCount: 1 },
    { name: 'favico', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
    { name: 'cimage', maxCount: 1 },
    { name:"slideimg",maxCount:1},
    { name: 'categoryImg', maxCount: 1 },
    { name: 'servicesImg', maxCount: 1 },
    { name: 'projectImg', maxCount: 1 },  

]);
const resizerImages = async (req, res, next) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    const filename = {
        image: `image-${Date.now()}`,
        logo: `logo-${Date.now()}`,
    };
const sizes = [
    {
        path: "original",
        width: null,
        height: null,
    },
    {
        path: "large",
        width: 800,
        height: 950,
    },
    {
        path: "medium",
        width: 300,
        height: 450,
    },
    {
        path: "thumbnail",
        width: 100,
        height: 250,
    },
];
const uploadPath = `../wwwroot/img/`;
const fileUrl = `${req.protocol}://${req.get(
    "host"
)}/img/`;
// sharp options
const sharpOptions = {
    fit: "contain",
    background: { r: 255, g: 255, b: 255 },
};
// create a new instance of MulterSharpResizer and pass params
const resizeObj = new MulterSharpResizer(
    req,
    filename,
    sizes,
    uploadPath,
    fileUrl,
    sharpOptions
);
const getDataUploaded = resizeObj.getData();
req.body.image = getDataUploaded.image;
req.body.logo = getDataUploaded.logo;
};
module.exports={
    resizerImages,
    uploadImages        
}