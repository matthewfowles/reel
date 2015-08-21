/*
# Reel JS
This is the JS for the reel JS plugin. This plugin
is used to caused animations when scrolling up and
down a page.
liscense: MIT
Author: Matthew Fowles
*/


var reel = function() {

    'use strict'; // set up srict mode


    var scrollers = [], // the array all animated elements will stored in with animation info.
        scroll = 0; // Current scroll point of the page


    /* 
    ## init **function**
	
	Start request animation frame and run get 
    scroll to update current scroll position.
    Then run update to update elements.
    Animation runs recursivly throughout. this is better 
    than binding to the window on scroll event.
    Thanks to @rikroots for pointing this out.
    */

    var init = function() {

        getScroll();

        function animate() {
            requestAnimationFrame(function() {
                getScroll();
                update();
                animate();
            });
        }

        animate();

    };


    /* 
    ## remove property **object**
    Object function to update individual properties.
    */

    var properties = {
        opacity: {
            property: 'opacity',
            update: function(element, value) {
                element.style.opacity = value;
            }
        },
        rotate: {
            property: 'transform',
            update: function(element, value) {
                var re = /rotate\([-\d\d]+deg\)/g;
                element.style.transform = 'rotate(' + value + 'deg)';
                element.style.webkitTransform = 'rotate(' + value + 'deg)';
            }
        }
    };


    /* 
    ## getScroll **function**
    	Get the current vertical scroll coords of the document.
        Polyfill if there is no widow y axis offset.
    */

    var getScroll = function() {

        if (w.pageYOffset !== undefined) {
            scroll = window.pageYOffset;
        } else {
            var sy,
                r = document.documentElement,
                b = document.body;
            sy = r.scrollTop || b.scrollTop || 0;
            scroll = sy;
        }
    };


    /* 
    ## update **function**
	check if we have any scrollers currently if so pass each
	one individually to the calculate fuction;
    */


    var update = function() {
        if (scrollers.length > 0) {
            for (var i = scrollers.length - 1; i >= 0; i--) {
                calculate(scrollers[i]);
            }
        } else {
            return;
        }
    };


    /* 
    ## calculate **function**
    */

    var calculate = function(scroller) {

        var scrollDiff = scroller.fromPos - scroller.toPos,
            scrollAmount = reel.scroll - scroller.fromPos,
            propertyDiff = scroller.fromStyle - scroller.toStyle,
            unit = propertyDiff / scrollDiff,
            animateFrom = scroller.element.style[scroller.type.property] || 0,
            animateTo = unit * scrollAmount;

        if (animateTo === scroller.toStyle || animateTo === scroller.fromStyle) {
            return;
        } else if (animateTo > scroller.toStyle) {
            animate(scroller.element, scroller.type, animateFrom, scroller.toStyle);
        } else if (animateTo < scroller.fromStyle) {
            animate(scroller.element, scroller.type, animateFrom, scroller.fromStyle);
        } else {
            animate(scroller.element, scroller.type, animateFrom, animateTo);
        }
    };


    /* 
    ## animate **function**
    pass the 
    */

    var animate = function(element, property, from, to) {
        properties[property].update(element, to);
    };


    /* 
    ## addReel **function**
    Add a new reel to the list of reels already being updated. 
    The reels are individual property updates on elements.
    */


    var addReel = function(name, element, fromPos, toPos, type, fromStyle, toStyle) {

        scrollers.push({
            name: name,
            element: element,
            fromPos: fromPos,
            toPos: toPos,
            type: type,
            fromStyle: fromStyle,
            toStyle: toStyle
        });

    };


    /* 
    ## removeReel **function**
        Use this function to remove reels from the update cycle.
        Using the name you bound them to at the start. 
    */

    var removeReel = function(name) {

    };


    /* 
    ## Request animation polyfill
        Use this to get all vendor prefixes and fallbacks sorted.
    */

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());




};

module && module.exprots ? module.exports = reel : window.reel = reel;