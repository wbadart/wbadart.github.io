/**
 * src/assets/js/resize.js
 *
 * JS functionality for wbadart.info
 * portfolio page (mainly vert center. I'll
 * convert to flex box as browser support
 * for it improves
 *
 * Will Badart
 * created: APR 2017
 */

(function(global){
'use strict';

global.onload = global.onresize = (function vert_center(target){
    switch(target.charAt(0)){
        case '.': target = document.getElementsByClassName(target.slice(1))[0];
                  break;
        case '#': target = document.getElementById(target.slice(1));
                  break;
        default:  target = document.getElementsByTagName(target)[0]; }
    return function(){
        target.style.marginTop =
            ((window.innerHeight - target.clientHeight) / 2) + 'px';
    }
})('.container');

})(window);

