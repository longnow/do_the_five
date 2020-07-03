var dt5=function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([,function(e,t,r){"use strict";r.r(t),r.d(t,"downloadFile",(function(){return ge})),r.d(t,"playInPopup",(function(){return Pe})),r.d(t,"recordInPopup",(function(){return Be})),r.d(t,"saveTranslations",(function(){return ce})),r.d(t,"toTarget",(function(){return K}));function n(e,t,r,n){return new(r||(r=Promise))((function(i,s){function o(e){try{c(n.next(e))}catch(e){s(e)}}function a(e){try{c(n.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,a)}c((n=n.apply(e,t||[])).next())}))}Object.create;Object.create;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};function s(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}function o(e){return"function"==typeof e}var a=!1,c={Promise:void 0,set useDeprecatedSynchronousErrorHandling(e){e&&(new Error).stack;a=e},get useDeprecatedSynchronousErrorHandling(){return a}};function u(e){setTimeout((function(){throw e}),0)}var l={closed:!0,next:function(e){},error:function(e){if(c.useDeprecatedSynchronousErrorHandling)throw e;u(e)},complete:function(){}},h=function(){return Array.isArray||function(e){return e&&"number"==typeof e.length}}();var d=function(){function e(e){return Error.call(this),this.message=e?e.length+" errors occurred during unsubscription:\n"+e.map((function(e,t){return t+1+") "+e.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=e,this}return e.prototype=Object.create(Error.prototype),e}(),f=function(){function e(e){this.closed=!1,this._parentOrParents=null,this._subscriptions=null,e&&(this._unsubscribe=e)}return e.prototype.unsubscribe=function(){var t;if(!this.closed){var r,n=this._parentOrParents,i=this._unsubscribe,s=this._subscriptions;if(this.closed=!0,this._parentOrParents=null,this._subscriptions=null,n instanceof e)n.remove(this);else if(null!==n)for(var a=0;a<n.length;++a){n[a].remove(this)}if(o(i))try{i.call(this)}catch(e){t=e instanceof d?p(e.errors):[e]}if(h(s)){a=-1;for(var c=s.length;++a<c;){var u=s[a];if(null!==(r=u)&&"object"==typeof r)try{u.unsubscribe()}catch(e){t=t||[],e instanceof d?t=t.concat(p(e.errors)):t.push(e)}}}if(t)throw new d(t)}},e.prototype.add=function(t){var r=t;if(!t)return e.EMPTY;switch(typeof t){case"function":r=new e(t);case"object":if(r===this||r.closed||"function"!=typeof r.unsubscribe)return r;if(this.closed)return r.unsubscribe(),r;if(!(r instanceof e)){var n=r;(r=new e)._subscriptions=[n]}break;default:throw new Error("unrecognized teardown "+t+" added to Subscription.")}var i=r._parentOrParents;if(null===i)r._parentOrParents=this;else if(i instanceof e){if(i===this)return r;r._parentOrParents=[i,this]}else{if(-1!==i.indexOf(this))return r;i.push(this)}var s=this._subscriptions;return null===s?this._subscriptions=[r]:s.push(r),r},e.prototype.remove=function(e){var t=this._subscriptions;if(t){var r=t.indexOf(e);-1!==r&&t.splice(r,1)}},e.EMPTY=function(e){return e.closed=!0,e}(new e),e}();function p(e){return e.reduce((function(e,t){return e.concat(t instanceof d?t.errors:t)}),[])}var g=function(){return"function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random()}(),m=function(e){function t(r,n,i){var s=e.call(this)||this;switch(s.syncErrorValue=null,s.syncErrorThrown=!1,s.syncErrorThrowable=!1,s.isStopped=!1,arguments.length){case 0:s.destination=l;break;case 1:if(!r){s.destination=l;break}if("object"==typeof r){r instanceof t?(s.syncErrorThrowable=r.syncErrorThrowable,s.destination=r,r.add(s)):(s.syncErrorThrowable=!0,s.destination=new y(s,r));break}default:s.syncErrorThrowable=!0,s.destination=new y(s,r,n,i)}return s}return s(t,e),t.prototype[g]=function(){return this},t.create=function(e,r,n){var i=new t(e,r,n);return i.syncErrorThrowable=!1,i},t.prototype.next=function(e){this.isStopped||this._next(e)},t.prototype.error=function(e){this.isStopped||(this.isStopped=!0,this._error(e))},t.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this))},t.prototype._next=function(e){this.destination.next(e)},t.prototype._error=function(e){this.destination.error(e),this.unsubscribe()},t.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},t.prototype._unsubscribeAndRecycle=function(){var e=this._parentOrParents;return this._parentOrParents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parentOrParents=e,this},t}(f),y=function(e){function t(t,r,n,i){var s,a=e.call(this)||this;a._parentSubscriber=t;var c=a;return o(r)?s=r:r&&(s=r.next,n=r.error,i=r.complete,r!==l&&(o((c=Object.create(r)).unsubscribe)&&a.add(c.unsubscribe.bind(c)),c.unsubscribe=a.unsubscribe.bind(a))),a._context=c,a._next=s,a._error=n,a._complete=i,a}return s(t,e),t.prototype.next=function(e){if(!this.isStopped&&this._next){var t=this._parentSubscriber;c.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?this.__tryOrSetError(t,this._next,e)&&this.unsubscribe():this.__tryOrUnsub(this._next,e)}},t.prototype.error=function(e){if(!this.isStopped){var t=this._parentSubscriber,r=c.useDeprecatedSynchronousErrorHandling;if(this._error)r&&t.syncErrorThrowable?(this.__tryOrSetError(t,this._error,e),this.unsubscribe()):(this.__tryOrUnsub(this._error,e),this.unsubscribe());else if(t.syncErrorThrowable)r?(t.syncErrorValue=e,t.syncErrorThrown=!0):u(e),this.unsubscribe();else{if(this.unsubscribe(),r)throw e;u(e)}}},t.prototype.complete=function(){var e=this;if(!this.isStopped){var t=this._parentSubscriber;if(this._complete){var r=function(){return e._complete.call(e._context)};c.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?(this.__tryOrSetError(t,r),this.unsubscribe()):(this.__tryOrUnsub(r),this.unsubscribe())}else this.unsubscribe()}},t.prototype.__tryOrUnsub=function(e,t){try{e.call(this._context,t)}catch(e){if(this.unsubscribe(),c.useDeprecatedSynchronousErrorHandling)throw e;u(e)}},t.prototype.__tryOrSetError=function(e,t,r){if(!c.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{t.call(this._context,r)}catch(t){return c.useDeprecatedSynchronousErrorHandling?(e.syncErrorValue=t,e.syncErrorThrown=!0,!0):(u(t),!0)}return!1},t.prototype._unsubscribe=function(){var e=this._parentSubscriber;this._context=null,this._parentSubscriber=null,e.unsubscribe()},t}(m);var b=function(){return"function"==typeof Symbol&&Symbol.observable||"@@observable"}();function v(e){return e}function w(e){return 0===e.length?v:1===e.length?e[0]:function(t){return e.reduce((function(e,t){return t(e)}),t)}}var E=function(){function e(e){this._isScalar=!1,e&&(this._subscribe=e)}return e.prototype.lift=function(t){var r=new e;return r.source=this,r.operator=t,r},e.prototype.subscribe=function(e,t,r){var n=this.operator,i=function(e,t,r){if(e){if(e instanceof m)return e;if(e[g])return e[g]()}return e||t||r?new m(e,t,r):new m(l)}(e,t,r);if(n?i.add(n.call(i,this.source)):i.add(this.source||c.useDeprecatedSynchronousErrorHandling&&!i.syncErrorThrowable?this._subscribe(i):this._trySubscribe(i)),c.useDeprecatedSynchronousErrorHandling&&i.syncErrorThrowable&&(i.syncErrorThrowable=!1,i.syncErrorThrown))throw i.syncErrorValue;return i},e.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(t){c.useDeprecatedSynchronousErrorHandling&&(e.syncErrorThrown=!0,e.syncErrorValue=t),!function(e){for(;e;){var t=e,r=t.closed,n=t.destination,i=t.isStopped;if(r||i)return!1;e=n&&n instanceof m?n:null}return!0}(e)?console.warn(t):e.error(t)}},e.prototype.forEach=function(e,t){var r=this;return new(t=_(t))((function(t,n){var i;i=r.subscribe((function(t){try{e(t)}catch(e){n(e),i&&i.unsubscribe()}}),n,t)}))},e.prototype._subscribe=function(e){var t=this.source;return t&&t.subscribe(e)},e.prototype[b]=function(){return this},e.prototype.pipe=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return 0===e.length?this:w(e)(this)},e.prototype.toPromise=function(e){var t=this;return new(e=_(e))((function(e,r){var n;t.subscribe((function(e){return n=e}),(function(e){return r(e)}),(function(){return e(n)}))}))},e.create=function(t){return new e(t)},e}();function _(e){if(e||(e=c.Promise||Promise),!e)throw new Error("no Promise impl found");return e}var x=function(){function e(){return Error.call(this),this.message="object unsubscribed",this.name="ObjectUnsubscribedError",this}return e.prototype=Object.create(Error.prototype),e}(),S=function(e){function t(t,r){var n=e.call(this)||this;return n.subject=t,n.subscriber=r,n.closed=!1,n}return s(t,e),t.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var e=this.subject,t=e.observers;if(this.subject=null,t&&0!==t.length&&!e.isStopped&&!e.closed){var r=t.indexOf(this.subscriber);-1!==r&&t.splice(r,1)}}},t}(f),C=function(e){function t(t){var r=e.call(this,t)||this;return r.destination=t,r}return s(t,e),t}(m),B=function(e){function t(){var t=e.call(this)||this;return t.observers=[],t.closed=!1,t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return s(t,e),t.prototype[g]=function(){return new C(this)},t.prototype.lift=function(e){var t=new R(this,this);return t.operator=e,t},t.prototype.next=function(e){if(this.closed)throw new x;if(!this.isStopped)for(var t=this.observers,r=t.length,n=t.slice(),i=0;i<r;i++)n[i].next(e)},t.prototype.error=function(e){if(this.closed)throw new x;this.hasError=!0,this.thrownError=e,this.isStopped=!0;for(var t=this.observers,r=t.length,n=t.slice(),i=0;i<r;i++)n[i].error(e);this.observers.length=0},t.prototype.complete=function(){if(this.closed)throw new x;this.isStopped=!0;for(var e=this.observers,t=e.length,r=e.slice(),n=0;n<t;n++)r[n].complete();this.observers.length=0},t.prototype.unsubscribe=function(){this.isStopped=!0,this.closed=!0,this.observers=null},t.prototype._trySubscribe=function(t){if(this.closed)throw new x;return e.prototype._trySubscribe.call(this,t)},t.prototype._subscribe=function(e){if(this.closed)throw new x;return this.hasError?(e.error(this.thrownError),f.EMPTY):this.isStopped?(e.complete(),f.EMPTY):(this.observers.push(e),new S(this,e))},t.prototype.asObservable=function(){var e=new E;return e.source=this,e},t.create=function(e,t){return new R(e,t)},t}(E),R=function(e){function t(t,r){var n=e.call(this)||this;return n.destination=t,n.source=r,n}return s(t,e),t.prototype.next=function(e){var t=this.destination;t&&t.next&&t.next(e)},t.prototype.error=function(e){var t=this.destination;t&&t.error&&this.destination.error(e)},t.prototype.complete=function(){var e=this.destination;e&&e.complete&&this.destination.complete()},t.prototype._subscribe=function(e){return this.source?this.source.subscribe(e):f.EMPTY},t}(B);var k=function(){function e(e,t){this.predicate=e,this.inclusive=t}return e.prototype.call=function(e,t){return t.subscribe(new P(e,this.predicate,this.inclusive))},e}(),P=function(e){function t(t,r,n){var i=e.call(this,t)||this;return i.predicate=r,i.inclusive=n,i.index=0,i}return s(t,e),t.prototype._next=function(e){var t,r=this.destination;try{t=this.predicate(e,this.index++)}catch(e){return void r.error(e)}this.nextOrComplete(e,t)},t.prototype.nextOrComplete=function(e,t){var r=this.destination;Boolean(t)?r.next(e):(this.inclusive&&r.next(e),r.complete())},t}(m);var T=function(){function e(e,t){this.project=e,this.thisArg=t}return e.prototype.call=function(e,t){return t.subscribe(new L(e,this.project,this.thisArg))},e}(),L=function(e){function t(t,r,n){var i=e.call(this,t)||this;return i.project=r,i.count=0,i.thisArg=n||i,i}return s(t,e),t.prototype._next=function(e){var t;try{t=this.project.call(this.thisArg,e,this.count++)}catch(e){return void this.destination.error(e)}this.destination.next(t)},t}(m);function I(){let e,t,r=0,n=[],i=0,s=!1;function o(e,t){if("in"===e)for(let e=0;e<2e3;++e)t[e]=e/2e3*t[e];else if("out"===e)for(let e=0;e<2e3;++e)t[-e]=e/2e3*t[-e]}function a(){return r=0,i=0,n=[],s?(e="rawdata",u(t.transaction([e],"readwrite").objectStore(e).clear())):Promise.resolve();var e}function c(e,t){let r=new Float32Array(t),n=0;for(let t=0;t<e.length;t++)r.set(e[t],n),n+=e[t].length;return r}function u(e){return new Promise((t,r)=>{e.onsuccess=function(){t(this.result)},e.onerror=function(e){r(e.target)}})}this.onmessage=function(l){switch(l.data.command){case"init":!function(r){e=r.sampleRate,s=!!r.experimentalStorage,s?new Promise((e,t)=>{let r=indexedDB.open("aikumic",1);r.onsuccess=function(){e(this.result)},r.onerror=function(e){t(e.target)},r.onupgradeneeded=function(t){let r=this.result,n=r.createObjectStore("rawdata",{autoIncrement:!0});Promise.all([u(n.transaction)]).then(()=>{e(r)})}}).then(e=>(t=e,a())).then(()=>{this.postMessage({command:"ready",data:null})}):this.postMessage({command:"ready",data:null})}(l.data.config);break;case"record":!function(e,a){1===a?o("in",e):2===a&&o("out",e);if(n.push(e),r+=e.length,i+=e.length,s&&n.length>15){let e=c(n,i);i=0,n=[],l="rawdata",h=e,u(t.transaction([l],"readwrite").objectStore(l).put({data:h}))}var l,h}(l.data.buffer,l.data.type);break;case"getBuffer":!function(){let e=c(n,r);this.postMessage({command:"getBuffer",data:e})}();break;case"streamBuffer":!function(){if(s){let e=t.transaction("rawdata").objectStore("rawdata"),s=0,o=this;e.openCursor().onsuccess=function(e){let t=this.result;if(t){let e=t.value.data;s+=e.length,o.postMessage({command:"streamBuffer",data:e,remaining:r-s}),t.continue()}else if(i>0){let e=c(n,i);o.postMessage({command:"streamBuffer",data:e,remaining:0})}}}else{let e=c(n,r);this.postMessage({command:"streamBuffer",data:e,remaining:0})}}();break;case"clear":a()}}}class A{constructor(e){if(this.progressSubject=new B,this.config={bufferLen:8192,numChannels:1,resample:!0,sampleRate:16e3,experimentalStorage:!1},this.recording=!1,this.playing=!1,this.hasData=!1,this.stopping=!1,this.stopTick=0,this.startFlag=!1,this.ready=!1,this.onready=null,this.onreadyResolve=null,this.startRecording=null,this.finalBuffers=[],this.callbacks={getBuffer:[]},this.processing=!1,this.pinterval=null,this.audioContext=e&&e.audioContext?e.audioContext:new AudioContext,this.debugMode=!(!e||!e.debug)&&e.debug,e){if(!1===e.resample)this.config.resample=!1,this.config.sampleRate=this.audioContext.sampleRate;else if(e.resampleRate){if(e.resampleRate<3e3||e.resampleRate>=this.audioContext.sampleRate)throw new Error("Invalid reSample rate");this.config.sampleRate=e.resampleRate}e.bufferLen&&(this.config.bufferLen=e.bufferLen)}this._init()}_init(){this.debug("init()"),this.recording=!1,this.finalBuffers=[],this.hasData=!1,this._initWorker()}debug(...e){this.debugMode&&console.log("aikumic:",...e)}connect(){return n(this,void 0,void 0,(function*(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("No mediaDevices.getUserMedia in browser!");let e=yield navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.sourceNode=this.audioContext.createMediaStreamSource(e),this.stream=e}))}record(){if(!this.ready)throw new Error("Microphone worker is not ready.");if(!this.sourceNode)throw new Error("No source node, did you call .connect() first?");if(!this.canRecord())throw new Error("Cannot start recording, check canRecord() first.");this.node=this.audioContext.createScriptProcessor(this.config.bufferLen,this.config.numChannels,this.config.numChannels),this.node.onaudioprocess=e=>{if(!this.recording)return;this.stopping&&(this.debug("stopping recording",this.stopTick),1===this.stopTick?(this.recording=!1,this.stopping=!1,this.hasData=!0,this.stopTick=0):++this.stopTick);let t=e.inputBuffer.getChannelData(0),r=new Float32Array(t.length);r.set(t,0);let n=0;this.recording?this.startFlag&&(n=1,this.startFlag=!1):n=2,this.worker.postMessage({command:"record",type:n,buffer:r})},this.sourceNode.connect(this.node),this.node.connect(this.audioContext.destination),this.startRecording=new Date,this.startFlag=!0,this.recording=!0,this.stopping=!1,this._progressTick()}destroy(){if(this.stream)for(let e of this.stream.getAudioTracks())e.stop();this.progressSubject.complete()}getElapsed(){let e=0;for(let t of this.finalBuffers)e+=t.length;let t=this.startRecording?(new Date).valueOf()-this.startRecording.valueOf():0;return~~(e/this.config.sampleRate*1e3)+t}isRecording(){return this.recording}isReady(){return this.ready}isPlaying(){return this.playing}hasRecordedData(){return this.hasData}observeProgress(){return this.progressSubject.asObservable()}pause(){return n(this,void 0,void 0,(function*(){if(this.recording)for(this.stopping=!0,this.debug("pausing");this.recording;)yield this._waitMilliseconds(100)}))}canRecord(){return!this.stopping&&!this.recording&&!this.processing}resume(){return!this.recording&&(this.recording=!0,this.stopping=!1,!0)}stop(){return n(this,void 0,void 0,(function*(){for(this.debug("stopping"),this.stopping=!0;this.recording;)yield this._waitMilliseconds(100);return this.sourceNode.disconnect(this.node),this.node.disconnect(this.audioContext.destination),this._saveSegment()}))}getLastLength(){if(0===this.finalBuffers.length)return{offset:0,frames:0,ms:0};{let e=0,t=0,r=0,n=0;for(let i=0;i<this.finalBuffers.length;++i)i<this.finalBuffers.length-1?e+=this.finalBuffers[i].length:(t=e,r=this.finalBuffers[i].length,n=Math.floor(r/this.config.sampleRate*1e3));return{offset:t,frames:r,ms:n}}}getTotalLength(){let e=0;for(let t=0;t<this.finalBuffers.length;++t)e+=this.finalBuffers[t].length;return{ms:Math.floor(e/this.config.sampleRate*1e3),frames:e}}getSegmentCount(){return this.finalBuffers.length}_waitMilliseconds(e){return new Promise(t=>{setTimeout(()=>{t()},e)})}_reSampleBuffer(e){let t=~~(e.length/this.audioContext.sampleRate*this.config.sampleRate),r=new OfflineAudioContext(1,t,this.config.sampleRate),n=r.createBuffer(1,e.length,this.audioContext.sampleRate);n.copyToChannel(e,0);let i=r.createBufferSource();return i.buffer=n,i.connect(r.destination),i.start(),r.startRendering().then(e=>new Float32Array(e.getChannelData(0)))}_saveSegment(){return new Promise(e=>{this.processing=!0;let t=0,r=[],i=[];this._getBufferFromWorker().subscribe(e=>{this.debug("getBufferFromWorker2() returned",e),this.config.resample?r.push(this._reSampleBuffer(e)):i.push(e)},null,()=>n(this,void 0,void 0,(function*(){this.debug("*** getBufferFromWorker2() completed"),this.config.resample&&(i=yield Promise.all(r));for(let e of i)t+=e.length;this.finalBuffers.push(this.mergeBuffers(i,t)),this.startRecording=null,this.debug("finalbuff",this.finalBuffers),this.processing=!1,this.worker.postMessage({command:"clear"}),e(this.getLastLength())})))})}clear(){this.recording=!1,this.finalBuffers=[],this.hasData=!1,this.worker.postMessage({command:"clear"})}clearLastSegment(){if(!this.hasData)throw new Error("No segments to clear.");1===this.getSegmentCount()?this.clear():this.finalBuffers.pop()}playSegment(e){return n(this,void 0,void 0,(function*(){if(e>this.finalBuffers.length-1)throw new Error("segment out of range");yield this._playBuffers([this.finalBuffers[e]])}))}playAll(){return n(this,void 0,void 0,(function*(){0!==this.finalBuffers.length&&(yield this._playBuffers(this.finalBuffers))}))}exportSegmentWav(e){if(e>this.finalBuffers.length-1)throw new Error("segment out of range");return this._arraysToWav([this.finalBuffers[e]])}exportLastSegmentWav(){return this._arraysToWav([this.finalBuffers[this.finalBuffers.length-1]])}exportAllWav(){return 0===this.finalBuffers.length?null:this._arraysToWav(this.finalBuffers)}stripMs(e){const t=this.finalBuffers.length-1;if(t<0)return;const r=this.config.sampleRate*e/1e3;this.finalBuffers[t].length>=r&&(this.finalBuffers[t]=this.finalBuffers[t].slice(0,this.finalBuffers[t].length-r))}_playBuffers(e){return new Promise((t,r)=>{this.playing&&r("already playing");let n=0;for(let t of e)n+=t.length;let i=this.audioContext.createBuffer(1,n,this.config.sampleRate),s=0;for(let t=0;t<e.length;++t)i.getChannelData(0).set(e[t],s),s+=e[t].length;let o=this.audioContext.createBufferSource();o.buffer=i,o.connect(this.audioContext.destination),o.start(),this.playing=!0,o.onended=()=>{this.playing=!1,t()}})}_getBufferFromWorker(){var e,t,r,n;return this.worker.postMessage({command:"streamBuffer"}),((e,t)=>E.create(r=>{let n=e.subscribe(e=>{r.next(e),t(e)&&r.complete()},r.onError,r.onCompleted);return()=>{n.unsubscribe()}}))(this.obsWorker.pipe((e=e=>"streamBuffer"===e.command,void 0===t&&(t=!1),function(r){return r.lift(new k(e,t))})),e=>0===e.remaining).pipe((r=e=>e.data,function(e){if("function"!=typeof r)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return e.lift(new T(r,n))}))}_progressTick(){this.pinterval||(this.pinterval=setInterval(()=>{this.recording?this.progressSubject.next(this.getElapsed()):(clearInterval(this.pinterval),this.pinterval=null)},100))}mergeBuffers(e,t){let r=new Float32Array(t),n=0;for(let t=0;t<e.length;t++)r.set(e[t],n),n+=e[t].length;return r}_initWorker(){this.onready=new Promise(e=>{this.onreadyResolve=e});this.worker=(e=>{let t=e.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];return new Worker(URL.createObjectURL(new Blob([t],{type:"text/javascript"})))})(I),this.obsWorker=new B,this.worker.onmessage=e=>{"ready"===e.data.command?(this.ready=!0,this.onreadyResolve()):this.obsWorker.next(e.data)},this.worker.postMessage({command:"init",config:{sampleRate:this.audioContext.sampleRate,experimentalStorage:this.config.experimentalStorage}})}_arraysToWav(e,t=1,r=this.config.sampleRate){const n=(e,t,r)=>{for(let n=0;n<r.length;n++,t+=2){let i=Math.max(-1,Math.min(1,r[n]));e.setInt16(t,i<0?32768*i:32767*i,!0)}},i=(e,t,r)=>{for(let n=0;n<r.length;n++)e.setUint8(t+n,r.charCodeAt(n))};return new Blob([((e,t,r)=>{let s=0;for(let t of e)s+=t.length;var o=new ArrayBuffer(44+2*s),a=new DataView(o);i(a,0,"RIFF"),a.setUint32(4,36+2*s,!0),i(a,8,"WAVE"),i(a,12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,t,!0),a.setUint32(24,r,!0),a.setUint32(28,4*r,!0),a.setUint16(32,2*t,!0),a.setUint16(34,16,!0),i(a,36,"data"),a.setUint32(40,2*s,!0);let c=0;for(let t of e)n(a,44+2*c,t),c+=t.length;return a})(e,t,r)],{type:"audio/wav"})}}class O{constructor(e){this.updateRateMs=100,this.onProgressEvent=null,this.onEndEvent=null,this.playing=!1,this.ended=!1,this.currentTime=0,this.framesPlayed=0,this.progressSubject=new B,this.debugMode=!1,this.pinterval=null,this.audioContext=e&&e.audioContext?e.audioContext:new AudioContext,this.debugMode=!(!e||!e.debug)&&e.debug}debug(...e){this.debugMode&&console.log("aikuplaya:",...e)}load(e){return fetch(e,{mode:"cors"}).then(e=>e.arrayBuffer().then(e=>this._decodeAndInitialize(e)))}loadFromBlob(e){return new Promise(t=>{let r=new FileReader;r.onloadend=()=>{this._decodeAndInitialize(r.result).then(()=>{t()})},r.readAsArrayBuffer(e)})}_decodeAndInitialize(e){return n(this,void 0,void 0,(function*(){this.pause(),this.source=null;let t=yield this.audioContext.decodeAudioData(e);this.currentTime=0,this.buffer=t,this.sampleRate=t.sampleRate,this.frames=t.length,this.channels=t.numberOfChannels,this.duration=t.duration;let r=this.sampleRate*(this.updateRateMs/1e3);this.scriptBufferLength=this._pow2floor(r),this.updateInterval=this.scriptBufferLength/this.sampleRate}))}_pow2floor(e){e++;for(var t=1;e>>=1;)t<<=1;return t}play(e=0){this.currentTime=e,this.startOffset=this.currentTime,this.source=this.audioContext.createBufferSource(),this.source.buffer=this.buffer,this.source.connect(this.audioContext.destination),this.ended=!1,this.source.onended=()=>{this.playing=!1,this.debug("ended"),this.ended=!0,this.progressSubject.next(-1)},this.source.start(this.audioContext.currentTime,this.currentTime),this.startPlay=new Date,this.playing=!0,this.startProgress()}playMs(e=0){this.play(e/1e3)}startProgress(){this.pinterval||(this.pinterval=setInterval(()=>{if(!this.playing||this.ended)clearInterval(this.pinterval),this.pinterval=null;else{let e=((new Date).valueOf()-this.startPlay.valueOf())/1e3;this.currentTime=this.startOffset+e,this.progressSubject.next(this.currentTime)}},100))}pause(){this.playing&&(this.playing=!1,this.source.onended=null,this.source.stop())}isPlaying(){return this.playing}hasEnded(){return this.ended}pos(){return this.currentTime}setPos(e){this.currentTime=e}observeProgress(){return this.progressSubject}playBuffer(e,t){var r=this.audioContext.createBufferSource(),n=this.audioContext.createBuffer(1,e.length,t);n.getChannelData(0).set(e),r.buffer=n,r.connect(this.audioContext.destination),r.start()}destroy(){this.pause()}}const j="https://apps.panlex.org/do_the_five-server",M=window.top,U=[...document.querySelectorAll("[contenteditable='true']")],D=new URLSearchParams(M.location.search),$=null!==D.get("official"),W=D.get("uid")||"eng-000",F=D.get("id")||"";let N={};const q={},H={},z={blob:{},changed:!1,exists:{},key:null,mic:null,player:null,playing:null,recording:null,recordMs:1e4,resample:!0},V=new Error("borked-error"),Y=new Error("frozen-uid-error"),Q=new Error("pw-empty-error"),X=new Error("panlexese-error"),G=new Error("title-error");let J;const K=M.toTarget=e=>{const t=M.scrollY,r=new URL(M.location);r.hash=e||"",e||(r.href+="#"),M.location.replace(r),r.hash="",M.history.replaceState(null,"",r),M.scrollY!==t&&M.scroll({left:M.scollX,top:t,behavior:"auto"}),J=e},Z=e=>{27===e.keyCode&&(J&&K(),z.playing&&xe(),z.recording&&ke(!0))},ee=e=>e.replace(/[&<>]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[e]||e)),te=e=>{U.forEach(t=>{var r,n;if(t.innerHTML=(r=e[t.id],n="stop"===t.id,Array.isArray(r)?r.map(([e,t])=>`<span class="panlexese pl${t}">${ee(n?e.toUpperCase():e)}</span>`).join(" — "):ee(r)),"language"!==t.id){const e=t.parentNode.querySelector(".dt5-play");e.addEventListener("click",we(t.id)),z.exists[t.id]&&(e.style.display="unset")}}),$&&(U.forEach(t=>{H[t.id]=t.textContent,Array.isArray(e[t.id])&&(q[t.id]=t.textContent,t.classList.add("highlight-dark"),t.addEventListener("input",e=>{t.classList.remove("highlight-dark")},{once:!0}))}),N.audio_frozen||U.forEach(e=>{if("language"!==e.id){const t=document.createElement("i");t.className="fas fa-microphone",t.addEventListener("click",Se(e.id)),e.parentNode.querySelector(".audio-buttons").appendChild(t)}}),M.onbeforeunload=e=>{ue()&&(e.preventDefault(),e.returnValue="")}),document.title=document.getElementById("stop").textContent},re=e=>{U.forEach(t=>{var r,n;t.parentNode.setAttribute("title",(r=e[t.id],n="stop"===t.id,Array.isArray(r)?r.map(([e,t])=>n?e.toUpperCase():e).join(" — "):r))})},ne=e=>{const t=new URL(j+"/");return e.filter((t,r)=>e.indexOf(t)===r).forEach(e=>e&&t.searchParams.append("uid",e)),t},ie=e=>{const t=new URL(M.location);t.searchParams.set("uid",e.target.dataset.uid),t.searchParams.delete("id"),$&&t.searchParams.set("official",""),M.location=t},se=()=>{if(!$)return Promise.reject(V);const e={err:null,highlight:null},t=Array.from(U).reduce((e,t)=>({...e,[t.id]:t.textContent}),{}),r=new FormData;r.set("uid",W);for(const e in t)e in q&&q[e]===t[e]||r.set(e,t[e]);if(r.set("email",document.getElementById("email-input").value.trim()),r.set("name",document.getElementById("name-input").value.trim()),t.stop===q.stop&&(e.err=G,e.highlight="stop"),Object.keys(t).some(e=>t[e].match(/—| - /)&&!("stop"===e&&t.stop===q.stop))&&(e.err=X,e.highlight=null),$)if(N.official_frozen&&le())e.err=Y;else{const t=document.getElementById("official-pw").value.trim().toLowerCase();t.length?(r.set("official",t),Object.keys(z.blob).forEach(e=>{r.set("audio-"+e,z.blob[e])})):e.err||(e.err=Q,e.highlight="official-pw")}return fetch(j+"/add",{method:"POST",body:r}).then(e=>e.json()).then(t=>(e.url=new URL(M.location),e.url.searchParams.set("uid",W),z.changed=!1,U.forEach(e=>{H[e.id]=e.textContent}),e))},oe=()=>new Promise((e,t)=>{se().then(t=>{e(t.url)},()=>{const t=new URL(M.location);t.searchParams.has("uid")||t.searchParams.set("uid",W),e(t)})}),ae=e=>{e.searchParams.delete("official"),e.searchParams.delete("edit")},ce=()=>{se().then(e=>{e.err?(e=>{let t=document.getElementById(e.err.message).innerHTML;if(e.err===Y&&(t=t.replace(/\{langname\}/,ee(N.name_expr_txt))),M.document.getElementById("error").innerHTML=t,e.highlight){const t=document.getElementById(e.highlight);t.classList.remove("highlight-dark"),t.classList.add("highlight-red"),t.addEventListener("focus",e=>{t.classList.remove("highlight-red")},{once:!0})}K("error-popup")})(e):(e.url.searchParams.set("success",1),M.location=e.url)},e=>{e!==V&&console.log(e)})},ue=()=>z.changed||le(),le=()=>U.some(e=>H[e.id]!==e.textContent),he={facebook:(e,t)=>"https://facebook.com/sharer/sharer.php?u="+encodeURIComponent(t),twitter:(e,t)=>`https://twitter.com/intent/tweet/?text=${encodeURIComponent(e)}&url=${encodeURIComponent(t)}`,whatsapp:(e,t)=>"whatsapp://send?text="+encodeURIComponent(e+" "+t),vk:(e,t)=>`http://vk.com/share.php?title=${encodeURIComponent(e)}&url=${encodeURIComponent(t)}`,telegram:(e,t)=>`https://telegram.me/share/url?text=${encodeURIComponent(e)}&url=${encodeURIComponent(t)}`,weibo:(e,t)=>`http://service.weibo.com/share/share.php?title=${encodeURIComponent(e)}&url=${encodeURIComponent(t)}`,qq:(e,t)=>`http://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(e)}&url=${encodeURIComponent(t)}`,email:(e,t)=>`mailto:?subject=${encodeURIComponent(e)}&body=${encodeURIComponent(t)}`,weixin:(e,t)=>"",linkedin:(e,t)=>`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(t)}&title=${encodeURIComponent(e)}`},de=new QRCode(document.getElementById("qrcode"),{width:500,height:500}),fe=e=>{const t=e.currentTarget.id;oe().then(e=>{ae(e),pe(e,t)}),e.preventDefault()},pe=(e,t)=>{"weixin"===t?(de.makeCode(e.toString()),K("qrcode-popup")):(K(),window.open(he[t](document.getElementById("stop").textContent,e),"_blank","noopener"))},ge=e=>{oe().then(t=>{ae(t);const r=new URL("https://panlex.org/do_the_five-download/");r.search=t.search,r.searchParams.set("type",e),window.open(r,"_blank","noopener")})};let me,ye=0;const be=document.getElementById("poster").getBoundingClientRect().width,ve=()=>{const e=document.getElementById("container"),t=.95*M.document.documentElement.clientWidth/be;e.style.transform=t<1?`scale(${t})`:null;const r=Number(e.getBoundingClientRect().height);if(document.body.style.height=r+"px",me){me.style.height=r+40+"px";const e=me.getBoundingClientRect().left;0!==e&&(ye-=e,me.style.left=ye+"px")}},we=e=>t=>{let r=!0;z.playing&&(z.playing.key===e&&(r=!1),xe()),r&&Ee(e).then(()=>{_e(e,t.target,"fa-volume-up","fa-stop-circle")})},Ee=e=>(z.player||(z.player=new O),z.blob[e]?z.player.loadFromBlob(z.blob[e]):z.player.load(`${j}/audio/${W}_${e}.mp3?${z.exists[e]}`)),_e=(e,t,r,n)=>{t.classList.remove(r),t.classList.add(n),z.playing={key:e,node:t,stoppedClass:r,playingClass:n},z.player.play(),z.player.observeProgress().subscribe(e=>{-1===e&&z.playing&&xe()})},xe=()=>{z.playing.node.classList.remove(z.playing.playingClass),z.playing.node.classList.add(z.playing.stoppedClass),z.playing=null,z.player.pause()},Se=e=>()=>{z.key=e;const t=M.document.getElementById("dt5-record-text");t.setAttribute("dir",N.dir),t.textContent=document.getElementById(e).textContent,Ce(z.exists[e]),K("record-popup")},Ce=e=>{const t=M.document.getElementById("dt5-play").classList;e?t.remove("fa-disabled"):t.add("fa-disabled")},Be=e=>{if(z.recording)ke(!0);else{z.playing&&xe(),z.mic=new A(z.resample?{resampleRate:16e3}:{resample:!1});const t=M.document.getElementById("dt5-progress");t.value=0,z.mic.observeProgress().subscribe(e=>{t.value=e/z.recordMs}),Promise.all([z.mic.connect(),z.mic.onready]).then(()=>{z.mic.canRecord()&&(Re(e.target,"fa-dot-circle","fa-stop-circle"),t.style.visibility="unset",z.timeout&&clearTimeout(z.timeout),z.timeout=setTimeout(()=>{z.recording&&ke(!1)},z.recordMs))})}},Re=(e,t,r)=>{Ce(!1),z.recording={node:e,stoppedClass:t,recordingClass:r},z.mic.record(),e.classList.remove(t),e.classList.add(r)},ke=e=>{z.timeout&&clearTimeout(z.timeout),z.recording.node.classList.remove(z.recording.recordingClass),z.recording.node.classList.add(z.recording.stoppedClass),M.document.getElementById("dt5-progress").style.visibility="hidden",z.recording=null,z.mic.stop().then(()=>{Ce(!0),document.getElementById(z.key).parentNode.querySelector(".dt5-play").style.display="unset",e&&z.mic.stripMs(500),z.blob[z.key]=z.mic.exportAllWav(),z.changed=z.exists[z.key]=!0,z.mic.destroy(),z.mic=null})},Pe=e=>{const t=M.document.getElementById("dt5-progress");z.playing?(xe(),t.style.visibility="hidden"):z.exists[z.key]&&Ee(z.key).then(()=>{t.value=0,z.player.observeProgress().subscribe(e=>{-1===e?t.style.visibility="hidden":t.value=e/z.player.duration}),_e(z.key,e.target,"fa-play-circle","fa-stop-circle"),t.style.visibility="unset"})},Te=()=>{if(window!==M&&Le(),window.addEventListener("keydown",Z),M.addEventListener("resize",ve),ve(),(()=>{if("eng-000"!==W){const e=ne(["eng-000","eng-000"]);return fetch(e).then(e=>e.json()).then(e=>{re(e)})}Promise.resolve()})(),[...M.document.getElementsByClassName("app")].forEach(e=>{const t=new URL(M.location);ae(t),e.href=he[e.id](document.getElementById("stop").textContent,t),e.addEventListener("click",fe)}),navigator.maxTouchPoints&&navigator.share){const e=document.getElementById("share-button");e.removeAttribute("onclick"),e.addEventListener("click",()=>navigator.share({url:M.location.href}))}if(D.has("print")&&document.documentElement.classList.add("fullsize"),D.has("png")&&document.documentElement.classList.add("png"),$||[...document.getElementsByClassName("official-only")].forEach(e=>{e.style.display="none"}),$?(U.forEach(e=>{e.addEventListener("paste",t=>{window.setTimeout(()=>{const t=window.getSelection();t.isCollapsed||t.collapseToEnd();let r=t.focusNode,n=1!==r.nodeType||r.textContent.length?t.focusOffset:0;for(;"true"!==r.contentEditable;){let e=r.previousSibling;for(;e;)n+=e.textContent.length,e=e.previousSibling;r=r.parentNode}e.textContent=e.textContent.replace(/\u00A0/g," "),n>e.textContent.length&&(n=e.textContent.length);const i=document.createRange();i.setStart(e.firstChild,n),i.setEnd(e.firstChild,n),t.removeAllRanges(),t.addRange(i)},0)})}),M.document.getElementById("dt5-record").addEventListener("click",Be),M.document.getElementById("dt5-play").addEventListener("click",Pe)):(U.forEach(e=>{e.contentEditable=!1}),document.getElementById("bottom-form").style.display="none"),"rtl"===N.dir&&[...document.styleSheets].some(e=>!!e.href.match(/\/styles\.css/)&&([...e.rules].filter(e=>e.type===CSSRule.STYLE_RULE&&("#do_the_five #search-icon"===e.selectorText||"#do_the_five .audio-buttons"===e.selectorText)).forEach(e=>{e.style.setProperty("left",e.style.getPropertyValue("right")),e.style.removeProperty("right")}),!0)),window.webkitAudioContext){z.resample=!1,window.AudioContext=window.webkitAudioContext;const e=window.AudioContext.prototype.decodeAudioData;window.AudioContext.prototype.decodeAudioData=function(t){return new Promise((r,n)=>{e.call(this,t,r,n)})}}},Le=()=>{me=M.document.querySelector("iframe"),M.dt5=window.dt5,M.addEventListener("keydown",Z),document.querySelectorAll('link[rel="stylesheet"]').forEach(e=>{(e=e.cloneNode()).setAttribute("href",e.href),M.document.head.appendChild(e)});const e=M.document.createElement("div");e.id="do_the_five",document.querySelectorAll(".overlay").forEach(t=>{e.appendChild(t)}),M.document.body.appendChild(e);const t=M.document.querySelector("meta[name='viewport']");t&&t.getAttribute("content").match(/maximum-scale/)&&t.replaceWith(document.querySelector("meta[name='viewport']").cloneNode())};fetch(`${j}/langvar/${W}`).then(e=>e.json()).then(e=>{N=e,document.documentElement.setAttribute("lang","und-"+N.script_expr_txt),document.documentElement.setAttribute("dir",N.dir);const t=document.getElementById("lang-picker");return t.value=N.name_expr_txt,t.addEventListener("language-select",ie),t.addEventListener("focus",e=>{e.currentTarget.value=""}),document.getElementById("lang-picker-form").addEventListener("submit",e=>{e.preventDefault();const t=e.target.querySelector("li");t&&t.click()}),(()=>{const e=ne([W,"eng-000","eng-000"]);return F&&e.searchParams.append("id",F),fetch(e).then(e=>e.json()).then(e=>{z.exists=e.audio,delete e.audio,te(e)})})()}).finally(()=>{if(Te(),document.body.style.visibility="visible",D.has("success")){const e=new URL(M.location);e.searchParams.delete("success"),M.history.replaceState(null,"",e),setTimeout(()=>{return e="success-alert",M.document.getElementById("alert").innerHTML=document.getElementById(e).innerHTML,void K("alert-popup");var e},200)}})}]);