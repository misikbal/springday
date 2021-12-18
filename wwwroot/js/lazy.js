// const {Bound} = require('../../node_modules/bounds.js/dist/bounds');
import * as Bound from "./bounds.js";
const boundary=Bound({
    margins:{bottom:-100}
})
const image=document.querySelectorAll("img")
const whenImageEnters=()=>{
    return()=>{
        image.src=image.dataset.src
        boundary.unWatch(image)
    }

}
image.forEach(img=>{
    boundary.watch(img,whenImageEnters(img))

});