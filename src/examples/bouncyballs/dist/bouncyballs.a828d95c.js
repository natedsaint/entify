parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Tfx0":[function(require,module,exports) {
"use strict";function r(r,e,n,t,o,i,u){try{var a=r[i](u),s=a.value}catch(c){return void n(c)}a.done?e(s):Promise.resolve(s).then(t,o)}function e(e){return function(){var n=this,t=arguments;return new Promise(function(o,i){var u=e.apply(n,t);function a(e){r(u,o,i,a,s,"next",e)}function s(e){r(u,o,i,a,s,"throw",e)}a(void 0)})}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n={Entify:{},globals:{},workerCount:0,destroyWorker:function(){var r=e(regeneratorRuntime.mark(function r(e){return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.terminate();case 2:return n.workerCount--,r.abrupt("return");case 4:case"end":return r.stop()}},r)}));return function(e){return r.apply(this,arguments)}}(),createWorkers:function(){for(var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5,e=arguments.length>1?arguments[1]:void 0,t=new Array(r),o=0;o<r;o++)t[o]=new Worker(e);return n.workerCount+=r,t},doWork:function(r,e,t){return new Promise(function(o,i){r.onmessage=o,r.onerror=i,r.postMessage({chunk:e,allData:t,fps:n.Entify.fps,globals:JSON.stringify(n.globals)})})},doInit:function(r,e,n){var t=n?[n]:void 0;return new Promise(function(o,i){r.onmessage=o,r.onerror=i,r.postMessage({init:!0,data:e,transferrables:n},t)})},doDistributedWork:function(r,e){var t=e.length/r.length;return Promise.all(r.map(function(r,o){var i=o*t,u=n.doWork(r,e.slice(i,i+t),e);return r.promise=u,u}))}},t=n;exports.default=t;
},{}],"KKFU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./workers.js"));function t(e){return e&&e.__esModule?e:{default:e}}function r(e,t,r,n,a,s,o){try{var i=e[s](o),u=i.value}catch(c){return void r(c)}i.done?t(u):Promise.resolve(u).then(n,a)}function n(e){return function(){var t=this,n=arguments;return new Promise(function(a,s){var o=e.apply(t,n);function i(e){r(o,a,s,i,u,"next",e)}function u(e){r(o,a,s,i,u,"throw",e)}i(void 0)})}}var a={};e.default.Entify=a,a.globals={},a.allEntities=[],a.Entity=function(){return this.id=(+new Date).toString(16)+(1e8*Math.random()|0).toString(16)+a.Entity.prototype.count,a.Entity.prototype.count++,this.components={},a.allEntities.push(this),this},a.Entity.prototype.count=0,a.Entity.destroy=function(e){var t=a.allEntities.findIndex(function(t){return t.id===e});t&&a.allEntities.splice(t,1)},a.Entity.prototype.print=function(){return console.log(JSON.stringify(this,null,4)),this},a.Entity.prototype.addComponent=function(e){return this.components[e.name]=e,this},a.Entity.prototype.removeComponent=function(e){var t=e;return"function"==typeof e&&(t=e.prototype.name),delete this.components[t],this},a.Components={},a.AllSystems=[],a.System=function(e){return this.setName(e),this.work=function(){},this.setup=function(){},this.postSetup=function(){},this.cleanup=function(){},this.globals=a.globals,a.AllSystems.push(this),this},a.System.prototype.setName=function(e){return this.name=e,this},a.System.prototype.workify=function(t,r,s){var o=this,i=this.setup.bind(this);this.setup=n(regeneratorRuntime.mark(function n(){var u,c,p,l,f,v,h,x;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,i();case 2:if(o.workers&&o.workers.length&&(o.workers.forEach(function(e){e.terminate()}),o.workers.length=0),u=r||a.globals.workerCount,e.default.globals=a.globals,o.workers=e.default.createWorkers(u,t),!s){n.next=38;break}c=!0,p=!1,l=void 0,n.prev=10,f=o.workers[Symbol.iterator]();case 12:if(c=(v=f.next()).done){n.next=21;break}if(h=v.value,!(x=s())){n.next=18;break}return n.next=18,e.default.doInit(h,x.data,x.transferrables);case 18:c=!0,n.next=12;break;case 21:n.next=27;break;case 23:n.prev=23,n.t0=n.catch(10),p=!0,l=n.t0;case 27:n.prev=27,n.prev=28,c||null==f.return||f.return();case 30:if(n.prev=30,!p){n.next=33;break}throw l;case 33:return n.finish(30);case 34:return n.finish(27);case 35:case 38:return n.abrupt("return");case 39:case"end":return n.stop()}},n,null,[[10,23,27,35],[28,,30,34]])})),this.oldWork=this.work,this.work=n(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.oldWork();case 2:return t.next=4,e.default.doDistributedWork(o.workers,a.allEntities).then(function(e){var t=[];return e.forEach(function(e){t=t.concat(e.data)}),a.allEntities=t,e});case 4:return t.abrupt("return",t.sent);case 5:case"end":return t.stop()}},t)})),this.oldCleanup=this.cleanup,this.cleanup=n(regeneratorRuntime.mark(function t(){var r,n,a,s,i,u,c,p,l,f,v,h;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.oldCleanup();case 2:if(!o.workers||!o.workers.length){t.next=56;break}r=!0,n=!1,a=void 0,t.prev=6,s=o.workers[Symbol.iterator]();case 8:if(r=(i=s.next()).done){t.next=15;break}return u=i.value,t.next=12,u.promise;case 12:r=!0,t.next=8;break;case 15:t.next=21;break;case 17:t.prev=17,t.t0=t.catch(6),n=!0,a=t.t0;case 21:t.prev=21,t.prev=22,r||null==s.return||s.return();case 24:if(t.prev=24,!n){t.next=27;break}throw a;case 27:return t.finish(24);case 28:return t.finish(21);case 29:c=!0,p=!1,l=void 0,t.prev=32,f=o.workers[Symbol.iterator]();case 34:if(c=(v=f.next()).done){t.next=41;break}return h=v.value,t.next=38,e.default.destroyWorker(h);case 38:c=!0,t.next=34;break;case 41:t.next=47;break;case 43:t.prev=43,t.t1=t.catch(32),p=!0,l=t.t1;case 47:t.prev=47,t.prev=48,c||null==f.return||f.return();case 50:if(t.prev=50,!p){t.next=53;break}throw l;case 53:return t.finish(50);case 54:return t.finish(47);case 55:o.workers.length=0;case 56:return t.abrupt("return");case 57:case"end":return t.stop()}},t,null,[[6,17,21,29],[22,,24,28],[32,43,47,55],[48,,50,54]])}))},a.start=n(regeneratorRuntime.mark(function e(){var t,r,n,s,o,i,u,c,p,l,f,v;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=!0,r=!1,n=void 0,e.prev=3,s=a.startSystems[Symbol.iterator]();case 5:if(t=(o=s.next()).done){e.next=12;break}return i=o.value,e.next=9,i.work(a.allEntities);case 9:t=!0,e.next=5;break;case 12:e.next=18;break;case 14:e.prev=14,e.t0=e.catch(3),r=!0,n=e.t0;case 18:e.prev=18,e.prev=19,t||null==s.return||s.return();case 21:if(e.prev=21,!r){e.next=24;break}throw n;case 24:return e.finish(21);case 25:return e.finish(18);case 26:u=!0,c=!1,p=void 0,e.prev=29,l=a.loopSystems[Symbol.iterator]();case 31:if(u=(f=l.next()).done){e.next=38;break}return v=f.value,e.next=35,v.setup();case 35:u=!0,e.next=31;break;case 38:e.next=44;break;case 40:e.prev=40,e.t1=e.catch(29),c=!0,p=e.t1;case 44:e.prev=44,e.prev=45,u||null==l.return||l.return();case 47:if(e.prev=47,!c){e.next=50;break}throw p;case 50:return e.finish(47);case 51:return e.finish(44);case 52:a.playing=!0,window.requestAnimationFrame(a.loop);case 54:case"end":return e.stop()}},e,null,[[3,14,18,26],[19,,21,25],[29,40,44,52],[45,,47,51]])})),a.restart=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a.playing=!1,e.next=3,a.reset();case 3:window.requestAnimationFrame(a.start);case 4:case"end":return e.stop()}},e)})),a.pause=function(){a.playing=!1},a.play=function(){a.playing=!0,window.requestAnimationFrame(a.loop)},a.reset=n(regeneratorRuntime.mark(function e(){var t,r,n,s,o,i,u,c,p,l,f,v;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=!0,r=!1,n=void 0,e.prev=3,s=a.startSystems[Symbol.iterator]();case 5:if(t=(o=s.next()).done){e.next=12;break}return i=o.value,e.next=9,i.cleanup();case 9:t=!0,e.next=5;break;case 12:e.next=18;break;case 14:e.prev=14,e.t0=e.catch(3),r=!0,n=e.t0;case 18:e.prev=18,e.prev=19,t||null==s.return||s.return();case 21:if(e.prev=21,!r){e.next=24;break}throw n;case 24:return e.finish(21);case 25:return e.finish(18);case 26:u=!0,c=!1,p=void 0,e.prev=29,l=a.loopSystems[Symbol.iterator]();case 31:if(u=(f=l.next()).done){e.next=38;break}return v=f.value,e.next=35,v.cleanup();case 35:u=!0,e.next=31;break;case 38:e.next=44;break;case 40:e.prev=40,e.t1=e.catch(29),c=!0,p=e.t1;case 44:e.prev=44,e.prev=45,u||null==l.return||l.return();case 47:if(e.prev=47,!c){e.next=50;break}throw p;case 50:return e.finish(47);case 51:return e.finish(44);case 52:return a.allEntities.length=0,e.abrupt("return");case 54:case"end":return e.stop()}},e,null,[[3,14,18,26],[19,,21,25],[29,40,44,52],[45,,47,51]])}));var s=performance.now();a.loop=n(regeneratorRuntime.mark(function e(){var t,r,n,o,i,u,c,p,l;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=!0,r=!1,n=void 0,e.prev=3,o=a.loopSystems[Symbol.iterator]();case 5:if(t=(i=o.next()).done){e.next=12;break}return u=i.value,e.next=9,u.work(a.allEntities);case 9:t=!0,e.next=5;break;case 12:e.next=18;break;case 14:e.prev=14,e.t0=e.catch(3),r=!0,n=e.t0;case 18:e.prev=18,e.prev=19,t||null==o.return||o.return();case 21:if(e.prev=21,!r){e.next=24;break}throw n;case 24:return e.finish(21);case 25:return e.finish(18);case 26:c=performance.now(),p=c-s,a.deltaTime=p,l=p/1e3,a.fps=Math.round(1/l),s=c,a.playing&&window.requestAnimationFrame(a.loop);case 33:case"end":return e.stop()}},e,null,[[3,14,18,26],[19,,21,25]])}));var o=a;exports.default=o;
},{"./workers.js":"Tfx0"}],"lWcS":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t={Color:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return this.h=t,this.s=o,this.l=i,this}};t.Color.prototype.name="color",t.Position=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t,this.y=o,this},t.Position.prototype.name="position",t.Size=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.1;return this.radius=t,this},t.Size.prototype.name="size",t.Velocity=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return this.x=t,this.y=o,this},t.Velocity.prototype.name="velocity";var o=t;exports.default=o;
},{}],"gJo9":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("../../Entify.js")),t=n(require("./components.js"));function n(e){return e&&e.__esModule?e:{default:e}}var o={Dot:function(n,o,d,r){var u=new e.default.Entity,a=o.h||0,l=o.s||0,i=o.l||0,f=d.y,s=d.x,p=r.x,c=r.y;return u.addComponent(new t.default.Color(a,l,i)),u.addComponent(new t.default.Size(n)),u.addComponent(new t.default.Position(s,f)),u.addComponent(new t.default.Velocity(p,c)),u}},d=o;exports.default=d;
},{"../../Entify.js":"KKFU","./components.js":"lWcS"}],"Y/Oq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t={getRandomInt:function(t){return Math.floor(Math.random()*Math.floor(t))}},e=t;exports.default=e;
},{}],"IbsW":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("../../Entify.js")),t=n(require("./assemblages.js")),r=n(require("./util.js"));function n(e){return e&&e.__esModule?e:{default:e}}function a(e,t){return u(e)||l(e,t)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function l(e,t){var r=[],n=!0,a=!1,o=void 0;try{for(var l,u=e[Symbol.iterator]();!(n=(l=u.next()).done)&&(r.push(l.value),!t||r.length!==t);n=!0);}catch(s){a=!0,o=s}finally{try{n||null==u.return||u.return()}finally{if(a)throw o}}return r}function u(e){if(Array.isArray(e))return e}function s(e,t,r,n,a,o,l){try{var u=e[o](l),s=u.value}catch(c){return void r(c)}u.done?t(s):Promise.resolve(s).then(n,a)}function i(e){return function(){var t=this,r=arguments;return new Promise(function(n,a){var o=e.apply(t,r);function l(e){s(o,n,a,l,u,"next",e)}function u(e){s(o,n,a,l,u,"throw",e)}l(void 0)})}}var f=r.default.getRandomInt,d=new e.default.System("generator");d.work=function(){for(var e=d.numDots,r=c.width/c.height,n=Math.ceil(Math.sqrt(e*r)),a=Math.ceil(Math.sqrt(e/r)),o=c.width/n,l=c.height/a,u=0,s=0;e--;){var i={h:f(360),s:"60%",l:"50%"},p=f(10)+3;s<n?s++:(s=0,u++);var h={x:(u+1)*l+15,y:(s+1)*o+15},v=f(1)?1:-1,y=f(1)?1:-1,m={x:f(6)+1*v,y:f(6)+1*y};new t.default.Dot(p,i,h,m)}};var p=new e.default.System("collider");p.workify("collider.js");var h=new e.default.System("mover");h.workify("mover.js");var v=new e.default.System("drawer");v.setup=i(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.default.globals.offscreen){t.next=4;break}return e.default.globals.ctx=e.default.globals.c.getContext("2d",{alpha:!0}),v.perfCounter=0,t.abrupt("return");case 4:case"end":return t.stop()}},t)})),v.work=i(regeneratorRuntime.mark(function t(){var r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.default.globals.offscreen||(r=e.default.globals.ctx,v.perfCounter++,r.clearRect(0,0,e.default.globals.c.width,e.default.globals.c.height),e.default.allEntities.forEach(function(e){var t=e.components.color,n=e.components.size,a=e.components.position;r.beginPath(),r.fillStyle="hsl(".concat(t.h,", ").concat(t.s,", ").concat(t.l,")"),r.strokeStyle="hsl(".concat(t.h+180,", ").concat(t.s,", ").concat(t.l,")"),r.arc(a.x,a.y,n.radius,0,2*Math.PI),r.stroke(),r.fill()}),(v.perfCounter%30==0||!v.perfText&&e.default.fps)&&(v.perfCounter=0,v.perfText=e.default.fps+" fps"),r.font="32px helvetica",r.fillStyle="#fff",r.fillText(v.perfText,10,50)),t.abrupt("return",e.default.allEntities);case 2:case"end":return t.stop()}},t)})),v.workify("drawer.js",1,function(){if(e.default.globals.offscreen){var t=e.default.globals.c,r=t.cloneNode(),n=t.parentNode;n.removeChild(t),n.appendChild(r),e.default.globals.c=r;var a=e.default.globals.c.transferControlToOffscreen();return{data:a,transferrables:a}}return!1});var y=new e.default.System("clicker");y.work=i(regeneratorRuntime.mark(function r(){return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:y.clicks.forEach(function(r){if(0===r[2]){var n=f(10)+3,o={h:f(360),s:"60%",l:"50%"},l={x:r[0],y:r[1]},u=f(1)?1:-1,s=f(1)?1:-1,c={x:f(6)+1*u,y:f(6)+1*s};new t.default.Dot(n,o,l,c)}else 2===r[2]&&e.default.allEntities.forEach(function(t){var n=a(r,2),o=n[0],l=n[1],u=t.components.position,s=u.x,c=u.y,i=t.components.size.radius;Math.hypot(o-s,l-c)<=1+i&&e.default.Entity.destroy(t.id)})}),y.clicks.length=0;case 2:case"end":return r.stop()}},r)})),y.setup=function(){var t=!1;y.clicks=[],e.default.globals.c.addEventListener("mousedown",function(e){t=e.button,y.clicks.push([e.layerX,e.layerY,e.button])}),e.default.globals.c.addEventListener("mousemove",function(e){0!==t&&2!==t||y.clicks.push([e.layerX,e.layerY,t])}),e.default.globals.c.addEventListener("mouseup",function(){t=!1}),e.default.globals.c.addEventListener("contextmenu",function(e){e.preventDefault()})};var m={generatorSystem:d,colliderSystem:p,moverSystem:h,drawerSystem:v,clickerSystem:y};exports.default=m;
},{"../../Entify.js":"KKFU","./assemblages.js":"gJo9","./util.js":"Y/Oq"}],"Focm":[function(require,module,exports) {
"use strict";var e,t=a(require("../../Entify.js")),r=a(require("./systems.js"));function a(e){return e&&e.__esModule?e:{default:e}}function n(e,t,r,a,n,u,l){try{var o=e[u](l),s=o.value}catch(d){return void r(d)}o.done?t(s):Promise.resolve(s).then(a,n)}function u(e){return function(){var t=this,r=arguments;return new Promise(function(a,u){var l=e.apply(t,r);function o(e){n(l,a,u,o,s,"next",e)}function s(e){n(l,a,u,o,s,"throw",e)}o(void 0)})}}var l="&#10074; &#10074;",o="&#9654;";t.default.globals.width=800,t.default.globals.height=600,(e=document.getElementById("c")).width=t.default.globals.width,e.height=t.default.globals.height,e.transferControlToOffscreen?t.default.globals.offscreen=!0:t.default.globals.offscreen=!1,t.default.globals.c=e,r.default.generatorSystem.numDots=200,t.default.startSystems=[r.default.generatorSystem],t.default.loopSystems=[r.default.colliderSystem,r.default.moverSystem,r.default.drawerSystem,r.default.clickerSystem],t.default.start(),document.querySelector("#pause").addEventListener("click",function(e){t.default.playing?(t.default.pause(),e.target.innerHTML=o):(t.default.play(),e.target.innerHTML=l)}),document.querySelector("#restart").addEventListener("click",u(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.default.pause(),r.default.generatorSystem.numDots=parseInt(document.querySelector("#dotsInput").value),t.default.globals.workerCount=parseInt(document.querySelector("#workersInput").value),t.default.restart(),document.querySelector("#pause").innerHTML=l;case 5:case"end":return e.stop()}},e)})));
},{"../../Entify.js":"KKFU","./systems.js":"IbsW"}]},{},["Focm"], null)
//# sourceMappingURL=/bouncyballs.a828d95c.js.map