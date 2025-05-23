!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):e.bounds=n()}(this,function(){"use strict";function i(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function s(){if(!("IntersectionObserver"in window))throw new Error("\n      bounds.js requires IntersectionObserver on the global object.\n      IntersectionObserver is unavailable in IE and other older\n      versions of browsers.\n      See https://github.com/ChrisCavs/bounds.js/blob/master/README.md\n      for more compatibility information.\n    ")}function u(){}var n=(function(e,n,t){return n&&i(e.prototype,n),t&&i(e,t),e}(a,[{key:"watch",value:function(e,n,t){var i={el:e,onEnter:1<arguments.length&&void 0!==n?n:u,onLeave:2<arguments.length&&void 0!==t?t:u};return this.nodes.push(i),this.observer.observe(e),i}},{key:"unWatch",value:function(e){var n=this._findByNode(e,!0);return-1!==n&&(this.nodes.splice(n,1),this.observer.unobserve(e)),this}},{key:"check",value:function(e){return(this._findByNode(e)||{}).history}},{key:"clear",value:function(){return this.nodes=[],this.observer.disconnect(),this}},{key:"_emit",value:function(e){var i=this,n=e.map(function(e){var n=i._findByNode(e.target),t=e.intersectionRatio;return n.history=e.isIntersecting,e.isIntersecting?n.onEnter(t):n.onLeave(t),{el:e.target,inside:e.isIntersecting,outside:!e.isIntersecting,ratio:e.intersectionRatio}});this.onEmit(n)}},{key:"_findByNode",value:function(n,e){var t=1<arguments.length&&void 0!==e&&e?"findIndex":"find";return this.nodes[t](function(e){return e.el.isEqualNode(n)})}}],[{key:"checkCompatibility",value:function(){s()}}]),a);function a(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=e.root,t=e.margins,i=e.threshold,o=e.onEmit;!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,a),s();var r={root:n||null,rootMargin:function(e){var n=0<arguments.length&&void 0!==e?e:{},t=n.top,i=void 0===t?0:t,o=n.right,r=void 0===o?0:o,s=n.bottom,u=void 0===s?0:s,a=n.left;return i+"px "+r+"px "+u+"px "+(void 0===a?0:a)+"px"}(t),threshold:i||0};this.nodes=[],this.onEmit=o||u,this.observer=new IntersectionObserver(this._emit.bind(this),r)}return function(e){return new n(e)}});
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