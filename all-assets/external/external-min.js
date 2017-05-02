function Peppermint(t,e){function n(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])}function i(t){var e=["Webkit","Moz","O","ms"],n=document.createElement("div");if(void 0!==n.style[t])return!0;t=t.charAt(0).toUpperCase()+t.slice(1);for(var i in e)if(void 0!==n.style[e[i]+t])return!0;return!1}function o(t,e){new RegExp("(\\s|^)"+e+"(\\s|$)").test(t.className)||(t.className+=" "+e)}function r(t,e){t.className=t.className.replace(new RegExp("(\\s+|^)"+e+"(\\s+|$)","g")," ").replace(/^\s+|\s+$/g,"")}function s(t,e){0>t?t=0:t>P-1&&(t=P-1);for(var n=M.dots.length-1;n>=0;n--)r(M.dots[n],O.activeDot);return o(M.dots[t],O.activeDot),I=t,a(-t*M.width,void 0===e?N.speed:e),h(),N.onSlideChange&&N.onSlideChange(t),t}function a(t,e){var n=e?e+"ms":"";E.style.webkitTransitionDuration=E.style.MozTransitionDuration=E.style.msTransitionDuration=E.style.OTransitionDuration=E.style.transitionDuration=n,c(t)}function u(t,e){if(D&&clearInterval(D),!e)return void c(t);var n=+new Date,i=M.left;D=setInterval(function(){function o(t,e){return(e-t)*u+t}var r,s,a=+new Date-n,u=a/e,l=[0,.7,1,1];return u>=1?(c(t),void clearInterval(D)):(r=t-i,s=o(o(o(l[0],l[1]),o(l[1],l[2])),o(o(l[1],l[2]),o(l[2],l[3]))),void c(Math.floor(s*r+i)))},15)}function c(t){E.style.webkitTransform="translate("+t+"px,0) translateZ(0)",E.style.msTransform=E.style.MozTransform=E.style.OTransform=E.style.transform="translateX("+t+"px)",M.left=t}function l(t){E.style.left=t+"px",M.left=t}function d(){var t=I+1;return t>P-1&&(t=0),s(t)}function f(){var t=I-1;return 0>t&&(t=P-1),s(t)}function m(){C=!0,h()}function h(){C&&(S&&clearTimeout(S),S=setTimeout(function(){d()},N.slideshowInterval))}function p(){S&&clearTimeout(S)}function v(){C=!1,S&&clearTimeout(S)}function w(){M.width=t.offsetWidth,E.style.width=M.width*P+"px";for(var e=0;P>e;e++)M.slides[e].style.width=M.width+"px";a(-I*M.width)}function x(t,e,n,i){e&&(t.addEventListener?t.addEventListener(e,n,!!i):t.attachEvent("on"+e,n))}function y(){EventBurrito(E,{mouse:N.mouseDrag,start:function(){o(t,O.drag)},move:function(t,e,n){p(),n.x=n.x/(!I&&n.x>0||I==P-1&&n.x<0?Math.abs(n.x)/M.width*2+1:1),a(n.x-M.width*I)},end:function(e,n,i){if(i.x){var o=Math.abs(i.x)/M.width,a=Math.floor(o)+(o-Math.floor(o)>.25?1:0),u=i.time<k+k*a/1.8&&Math.abs(i.x)-a*M.width>(a?-M.width/9:20);a+=u?1:0,i.x<0?s(I+a,N.touchSpeed):s(I-a,N.touchSpeed),N.stopSlideshowAfterInteraction&&v()}r(t,O.drag)}})}function g(){var e=N.slidesContainer||t,n=N.dotsContainer||t;if(!(N.disableIfOneSlide&&e.children.length<=1)){(!L.transforms||window.opera)&&(c=l),(!L.transitions||window.opera)&&(a=u),E=N.slidesContainer||document.createElement("div"),o(E,O.slides);for(var i=0,d=e.children.length;d>i;i++){var f=e.children[i],h=document.createElement("li");M.slides.push(f),h.setAttribute("tabindex","0"),h.setAttribute("role","button"),h.innerHTML="<span></span>",function(e,n){x(n,"click",function(){s(e),N.stopSlideshowAfterInteraction&&v()}),x(n,"keyup",function(t){13==t.keyCode&&(s(e),N.stopSlideshowAfterInteraction&&v())}),x(n,"mouseup",function(){o(n,O.mouseClicked)}),x(n,"blur",function(){r(n,O.mouseClicked)},!0),x(f,"focus",f.onfocusin=function(){t.scrollLeft=0,setTimeout(function(){t.scrollLeft=0},0),s(e)},!0)}(i,h),M.dots.push(h)}P=M.slides.length,b=100/P,o(t,O.active),r(t,O.inactive),N.mouseDrag&&o(t,O.mouse),M.width=t.offsetWidth,E.style.width=M.width*P+"px";for(var i=0;P>i;i++)M.slides[i].style.width=M.width+"px",E.appendChild(M.slides[i]);if(N.slidesContainer||t.appendChild(E),N.dots&&P>1){T=document.createElement("ul"),o(T,O.dots);for(var i=0,d=M.dots.length;d>i;i++)T.appendChild(M.dots[i]);N.dotsPrepend?n.insertBefore(T,n.firstChild):n.appendChild(T)}x(window,"resize",w),x(window,"orientationchange",w),setTimeout(function(){s(N.startSlide,0)},0),N.slideshow&&m(),y(),setTimeout(function(){N.onSetup&&N.onSetup(P)},0)}}var P,b,T,E,S,C,D,M={slides:[],dots:[],left:0},k=200,I=0,N={speed:300,touchSpeed:300,slideshow:!1,slideshowInterval:4e3,stopSlideshowAfterInteraction:!1,startSlide:0,mouseDrag:!0,disableIfOneSlide:!0,cssPrefix:"peppermint-",dots:!1,dotsPrepend:!1,dotsContainer:void 0,slidesContainer:void 0,onSlideChange:void 0,onSetup:void 0};e&&n(N,e);var O={inactive:N.cssPrefix+"inactive",active:N.cssPrefix+"active",mouse:N.cssPrefix+"mouse",drag:N.cssPrefix+"drag",slides:N.cssPrefix+"slides",dots:N.cssPrefix+"dots",activeDot:N.cssPrefix+"active-dot",mouseClicked:N.cssPrefix+"mouse-clicked"},L={transforms:i("transform"),transitions:i("transition")};return g(),{slideTo:function(t,e){return s(parseInt(t,10),e)},next:d,prev:f,start:m,stop:v,pause:p,getCurrentPos:function(){return I},getSlidesNumber:function(){return P},recalcWidth:w}}function EventBurrito(t,e){function n(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])}function i(t,e,n,i){return e?(t.addEventListener?t.addEventListener(e,n,!!i):t.attachEvent("on"+e,n),{remove:function(){o(t,e,n,i)}}):void 0}function o(t,e,n,i){e&&(t.removeEventListener?t.removeEventListener(e,n,!!i):t.detachEvent("on"+e,n))}function r(t){t.preventDefault?t.preventDefault():t.returnValue=!1}function s(t){if(w={x:(h?t.clientX:t.touches[0].clientX)-v.x,y:(h?t.clientY:t.touches[0].clientY)-v.y,time:Number(new Date)-v.time},w.time-y[y.length-1].time){for(var e=0;e<y.length-1&&w.time-y[e].time>80;e++);x={x:(w.x-y[e].x)/(w.time-y[e].time),y:(w.y-y[e].y)/(w.time-y[e].time)},y.length>=5&&y.shift(),y.push({x:w.x,y:w.y,time:w.time})}}function a(t,e){P=!0,h=e,E[h](t)||(i(document,T[h][1],u),i(document,T[h][2],c),i(document,T[h][3],c),f.preventDefault&&h&&r(t),v={x:h?t.clientX:t.touches[0].clientX,y:h?t.clientY:t.touches[0].clientY,time:Number(new Date)},m=void 0,w={x:0,y:0,time:0},x={x:0,y:0},y=[{x:0,y:0,time:0}],f.start(t,v))}function u(t){!f.preventScroll&&m||E[h](t)||(s(t),(Math.abs(w.x)>f.clickTolerance||Math.abs(w.y)>f.clickTolerance)&&(P=!1),void 0===m&&3!==h&&(m=Math.abs(w.x)<Math.abs(w.y)&&!f.preventScroll)||(f.preventDefault&&r(t),f.move(t,v,w,x)))}function c(t){h&&s(t),!P&&t.target&&t.target.blur&&t.target.blur(),o(document,T[h][1],u),o(document,T[h][2],c),o(document,T[h][3],c),f.end(t,v,w,x)}function l(){g.push(i(t,T[b][0],function(t){a(t,b)})),g.push(i(t,"dragstart",r)),f.mouse&&!b&&g.push(i(t,T[3][0],function(t){a(t,3)})),g.push(i(t,"click",function(t){P?f.click(t):r(t)}))}var d=function(){},f={preventDefault:!0,clickTolerance:0,preventScroll:!1,mouse:!0,start:d,move:d,end:d,click:d};e&&n(f,e);var m,h,p={pointerEvents:!!window.navigator.pointerEnabled,msPointerEvents:!!window.navigator.msPointerEnabled},v={},w={},x={},y=[],g=[],P=!0,b=p.pointerEvents?1:p.msPointerEvents?2:0,T=[["touchstart","touchmove","touchend","touchcancel"],["pointerdown","pointermove","pointerup","pointercancel"],["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerCancel"],["mousedown","mousemove","mouseup",!1]],E=[function(t){return t.touches&&t.touches.length>1||t.scale&&1!==t.scale},function(t){return!t.isPrimary||t.buttons&&1!==t.buttons||!f.mouse&&"touch"!==t.pointerType&&"pen"!==t.pointerType},function(t){return!t.isPrimary||t.buttons&&1!==t.buttons||!f.mouse&&t.pointerType!==t.MSPOINTER_TYPE_TOUCH&&t.pointerType!==t.MSPOINTER_TYPE_PEN},function(t){return t.buttons&&1!==t.buttons}];return l(),{getClicksAllowed:function(){return P},kill:function(){for(var t=g.length-1;t>=0;t--)g[t].remove()}}}window.jQuery&&!function(t){t.fn.Peppermint=function(e){return this.each(function(){t(this).data("Peppermint",Peppermint(this,e))}),this}}(window.jQuery);