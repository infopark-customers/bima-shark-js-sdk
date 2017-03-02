/*! BImA-Notifications JS-SDK v0.1.1 */
!function(t){function n(e){if(i[e])return i[e].exports;var o=i[e]={exports:{},id:e,loaded:!1};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var i={};return n.m=t,n.c=i,n.p="",n(0)}([function(t,n,i){(function(n){!function(e){"use strict";e.NotificationService=function(){function t(t){t=t||{},this.configuration={},this.configuration.accessId=t.accessId,this.configuration.serviceToken=t.serviceToken,this.configuration.userId=t.userId,this.configuration.apiEndpoint=t.apiEndpoint,this.configuration.webSocketUrl=t.webSocketUrl,this.configuration.jQuery=t.jQuery||jQuery||window.jQuery||$,"undefined"==typeof this.configuration.useHttps&&(this.configuration.useHttps=!0),this.callbacks=t.callbacks,"undefined"!=typeof this.callbacks&&"function"==typeof this.callbacks?this.callbacks=[callbacks]:"object"==typeof this.callbacks?this.callbacks=this.callbacks:this.callbacks=[],this.subscriptionsInitialized=!1,this.subscriptionsInitializationsCount=0,o.call(this),s.call(this),n.call(this),r.call(this),e.call(this)}function n(){try{var t=i(2);this._actionCableConsumer=t.createConsumer(this.configuration.fullSocketUrl),this._actionCableConsumer.connect()}catch(t){throw new Error(t)}}function e(){var t=i(3);this.Api=new t(this)}function o(){var t=this.configuration.webSocketUrl,n=this.configuration.accessId,i=this.configuration.serviceToken;if(!(t&&n&&i))throw new Error("Required option properties are missing");if(!t.match(/^ws:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/)&&!t.match(/^wss:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/))throw new Error("options.webSocketUrl has invalid format");this.configuration.fullSocketUrl=t,this.configuration.fullSocketUrl+="?access_id="+n,this.configuration.fullSocketUrl+="&service_token="+i,this.configuration.fullSocketUrl=encodeURI(this.configuration.fullSocketUrl)}function r(){var t=i(4);c=new t(this)}function s(){this.configuration=Object.freeze(this.configuration)}var c=null;return t.channelNames=Object.freeze(["GlobalNotificationsChannel","UserNotificationsChannel"]),t.editableConfigurationKeys=Object.freeze(["accessId","serviceToken","userId","apiEndpoint","webSocketUrl","jQuery"]),t.prototype.addCallback=function(t){"function"==typeof t&&"object"==typeof this.callbacks&&this.callbacks.push(t)},t.prototype.connect=function(){this._actionCableConsumer.connect,c.resubscribeToAllChannels()},t.prototype.disconnect=function(){c.unsubscribeAllChannels(),this._actionCableConsumer.disconnect()},t.prototype.fullSocketUrl=function(){return this.configuration.fullSocketUrl},t.prototype.markNotificationAsRead=function(t){var n=c.subscriptions.UserNotificationsChannel;n.perform("mark_notification_as_read",{notification_id:t})},t.prototype.updateConfiguration=function(i){i=i||{};var c=Object.keys(i);if(c.length>0){var u=this.configuration.jQuery,a=this.configuration.userId,l=u.extend(!0,{},this.configuration);for(var h in c){var f=c[h];if(!(u.inArray(f,t.editableConfigurationKeys)>-1))throw new Error("Unallowed configuration key `"+f+"`");l[f]=i[f]}a!==l.userId&&(this.subscriptionsInitialized=!1,this.subscriptionsInitializationsCount=0),this.configuration=l,this.disconnect(),o.call(this),s.call(this),n.call(this),r.call(this),e.call(this)}},t}(),"undefined"!=typeof n&&(t.exports=NotificationService)}(window)}).call(n,i(1))},function(t,n){function i(){throw new Error("setTimeout has not been defined")}function e(){throw new Error("clearTimeout has not been defined")}function o(t){if(l===setTimeout)return setTimeout(t,0);if((l===i||!l)&&setTimeout)return l=setTimeout,setTimeout(t,0);try{return l(t,0)}catch(n){try{return l.call(null,t,0)}catch(n){return l.call(this,t,0)}}}function r(t){if(h===clearTimeout)return clearTimeout(t);if((h===e||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(t);try{return h(t)}catch(n){try{return h.call(null,t)}catch(n){return h.call(this,t)}}}function s(){g&&p&&(g=!1,p.length?d=p.concat(d):b=-1,d.length&&c())}function c(){if(!g){var t=o(s);g=!0;for(var n=d.length;n;){for(p=d,d=[];++b<n;)p&&p[b].run();b=-1,n=d.length}p=null,g=!1,r(t)}}function u(t,n){this.fun=t,this.array=n}function a(){}var l,h,f=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:i}catch(t){l=i}try{h="function"==typeof clearTimeout?clearTimeout:e}catch(t){h=e}}();var p,d=[],g=!1,b=-1;f.nextTick=function(t){var n=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)n[i-1]=arguments[i];d.push(new u(t,n)),1!==d.length||g||o(c)},u.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=a,f.addListener=a,f.once=a,f.off=a,f.removeListener=a,f.removeAllListeners=a,f.emit=a,f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,n,i){var e,o;(function(){(function(){(function(){var t=[].slice;this.ActionCable={INTERNAL:{message_types:{welcome:"welcome",ping:"ping",confirmation:"confirm_subscription",rejection:"reject_subscription"},default_mount_path:"/cable",protocols:["actioncable-v1-json","actioncable-unsupported"]},createConsumer:function(t){var n;return null==t&&(t=null!=(n=this.getConfig("url"))?n:this.INTERNAL.default_mount_path),new r.Consumer(this.createWebSocketURL(t))},getConfig:function(t){var n;return n=document.head.querySelector("meta[name='action-cable-"+t+"']"),null!=n?n.getAttribute("content"):void 0},createWebSocketURL:function(t){var n;return t&&!/^wss?:/i.test(t)?(n=document.createElement("a"),n.href=t,n.href=n.href,n.protocol=n.protocol.replace("http","ws"),n.href):t},startDebugging:function(){return this.debugging=!0},stopDebugging:function(){return this.debugging=null},log:function(){var n;if(n=1<=arguments.length?t.call(arguments,0):[],this.debugging)return n.push(Date.now()),console.log.apply(console,["[ActionCable]"].concat(t.call(n)))}}}).call(this)}).call(this);var r=this.ActionCable;(function(){(function(){var t=function(t,n){return function(){return t.apply(n,arguments)}};r.ConnectionMonitor=function(){function n(n){this.connection=n,this.visibilityDidChange=t(this.visibilityDidChange,this),this.reconnectAttempts=0}var i,e,o;return n.pollInterval={min:3,max:30},n.staleThreshold=6,n.prototype.start=function(){if(!this.isRunning())return this.startedAt=e(),delete this.stoppedAt,this.startPolling(),document.addEventListener("visibilitychange",this.visibilityDidChange),r.log("ConnectionMonitor started. pollInterval = "+this.getPollInterval()+" ms")},n.prototype.stop=function(){if(this.isRunning())return this.stoppedAt=e(),this.stopPolling(),document.removeEventListener("visibilitychange",this.visibilityDidChange),r.log("ConnectionMonitor stopped")},n.prototype.isRunning=function(){return null!=this.startedAt&&null==this.stoppedAt},n.prototype.recordPing=function(){return this.pingedAt=e()},n.prototype.recordConnect=function(){return this.reconnectAttempts=0,this.recordPing(),delete this.disconnectedAt,r.log("ConnectionMonitor recorded connect")},n.prototype.recordDisconnect=function(){return this.disconnectedAt=e(),r.log("ConnectionMonitor recorded disconnect")},n.prototype.startPolling=function(){return this.stopPolling(),this.poll()},n.prototype.stopPolling=function(){return clearTimeout(this.pollTimeout)},n.prototype.poll=function(){return this.pollTimeout=setTimeout(function(t){return function(){return t.reconnectIfStale(),t.poll()}}(this),this.getPollInterval())},n.prototype.getPollInterval=function(){var t,n,e,o;return o=this.constructor.pollInterval,e=o.min,n=o.max,t=5*Math.log(this.reconnectAttempts+1),Math.round(1e3*i(t,e,n))},n.prototype.reconnectIfStale=function(){if(this.connectionIsStale())return r.log("ConnectionMonitor detected stale connection. reconnectAttempts = "+this.reconnectAttempts+", pollInterval = "+this.getPollInterval()+" ms, time disconnected = "+o(this.disconnectedAt)+" s, stale threshold = "+this.constructor.staleThreshold+" s"),this.reconnectAttempts++,this.disconnectedRecently()?r.log("ConnectionMonitor skipping reopening recent disconnect"):(r.log("ConnectionMonitor reopening"),this.connection.reopen())},n.prototype.connectionIsStale=function(){var t;return o(null!=(t=this.pingedAt)?t:this.startedAt)>this.constructor.staleThreshold},n.prototype.disconnectedRecently=function(){return this.disconnectedAt&&o(this.disconnectedAt)<this.constructor.staleThreshold},n.prototype.visibilityDidChange=function(){if("visible"===document.visibilityState)return setTimeout(function(t){return function(){if(t.connectionIsStale()||!t.connection.isOpen())return r.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = "+document.visibilityState),t.connection.reopen()}}(this),200)},e=function(){return(new Date).getTime()},o=function(t){return(e()-t)/1e3},i=function(t,n,i){return Math.max(n,Math.min(i,t))},n}()}).call(this),function(){var t,n,i,e,o,s,c=[].slice,u=function(t,n){return function(){return t.apply(n,arguments)}},a=[].indexOf||function(t){for(var n=0,i=this.length;n<i;n++)if(n in this&&this[n]===t)return n;return-1};e=r.INTERNAL,n=e.message_types,i=e.protocols,o=2<=i.length?c.call(i,0,t=i.length-1):(t=0,[]),s=i[t++],r.Connection=function(){function t(t){this.consumer=t,this.open=u(this.open,this),this.subscriptions=this.consumer.subscriptions,this.monitor=new r.ConnectionMonitor(this),this.disconnected=!0}return t.reopenDelay=500,t.prototype.send=function(t){return!!this.isOpen()&&(this.webSocket.send(JSON.stringify(t)),!0)},t.prototype.open=function(){if(this.isActive())throw r.log("Attempted to open WebSocket, but existing socket is "+this.getState()),new Error("Existing connection must be closed before opening");return r.log("Opening WebSocket, current state is "+this.getState()+", subprotocols: "+i),null!=this.webSocket&&this.uninstallEventHandlers(),this.webSocket=new WebSocket(this.consumer.url,i),this.installEventHandlers(),this.monitor.start(),!0},t.prototype.close=function(t){var n,i;if(n=(null!=t?t:{allowReconnect:!0}).allowReconnect,n||this.monitor.stop(),this.isActive())return null!=(i=this.webSocket)?i.close():void 0},t.prototype.reopen=function(){var t;if(r.log("Reopening WebSocket, current state is "+this.getState()),!this.isActive())return this.open();try{return this.close()}catch(n){return t=n,r.log("Failed to reopen WebSocket",t)}finally{r.log("Reopening WebSocket in "+this.constructor.reopenDelay+"ms"),setTimeout(this.open,this.constructor.reopenDelay)}},t.prototype.getProtocol=function(){var t;return null!=(t=this.webSocket)?t.protocol:void 0},t.prototype.isOpen=function(){return this.isState("open")},t.prototype.isActive=function(){return this.isState("open","connecting")},t.prototype.isProtocolSupported=function(){var t;return t=this.getProtocol(),a.call(o,t)>=0},t.prototype.isState=function(){var t,n;return n=1<=arguments.length?c.call(arguments,0):[],t=this.getState(),a.call(n,t)>=0},t.prototype.getState=function(){var t,n,i;for(n in WebSocket)if(i=WebSocket[n],i===(null!=(t=this.webSocket)?t.readyState:void 0))return n.toLowerCase();return null},t.prototype.installEventHandlers=function(){var t,n;for(t in this.events)n=this.events[t].bind(this),this.webSocket["on"+t]=n},t.prototype.uninstallEventHandlers=function(){var t;for(t in this.events)this.webSocket["on"+t]=function(){}},t.prototype.events={message:function(t){var i,e,o,r;if(this.isProtocolSupported())switch(o=JSON.parse(t.data),i=o.identifier,e=o.message,r=o.type,r){case n.welcome:return this.monitor.recordConnect(),this.subscriptions.reload();case n.ping:return this.monitor.recordPing();case n.confirmation:return this.subscriptions.notify(i,"connected");case n.rejection:return this.subscriptions.reject(i);default:return this.subscriptions.notify(i,"received",e)}},open:function(){if(r.log("WebSocket onopen event, using '"+this.getProtocol()+"' subprotocol"),this.disconnected=!1,!this.isProtocolSupported())return r.log("Protocol is unsupported. Stopping monitor and disconnecting."),this.close({allowReconnect:!1})},close:function(t){if(r.log("WebSocket onclose event"),!this.disconnected)return this.disconnected=!0,this.monitor.recordDisconnect(),this.subscriptions.notifyAll("disconnected",{willAttemptReconnect:this.monitor.isRunning()})},error:function(){return r.log("WebSocket onerror event")}},t}()}.call(this),function(){var t=[].slice;r.Subscriptions=function(){function n(t){this.consumer=t,this.subscriptions=[]}return n.prototype.create=function(t,n){var i,e,o;return i=t,e="object"==typeof i?i:{channel:i},o=new r.Subscription(this.consumer,e,n),this.add(o)},n.prototype.add=function(t){return this.subscriptions.push(t),this.consumer.ensureActiveConnection(),this.notify(t,"initialized"),this.sendCommand(t,"subscribe"),t},n.prototype.remove=function(t){return this.forget(t),this.findAll(t.identifier).length||this.sendCommand(t,"unsubscribe"),t},n.prototype.reject=function(t){var n,i,e,o,r;for(e=this.findAll(t),o=[],n=0,i=e.length;n<i;n++)r=e[n],this.forget(r),this.notify(r,"rejected"),o.push(r);return o},n.prototype.forget=function(t){var n;return this.subscriptions=function(){var i,e,o,r;for(o=this.subscriptions,r=[],i=0,e=o.length;i<e;i++)n=o[i],n!==t&&r.push(n);return r}.call(this),t},n.prototype.findAll=function(t){var n,i,e,o,r;for(e=this.subscriptions,o=[],n=0,i=e.length;n<i;n++)r=e[n],r.identifier===t&&o.push(r);return o},n.prototype.reload=function(){var t,n,i,e,o;for(i=this.subscriptions,e=[],t=0,n=i.length;t<n;t++)o=i[t],e.push(this.sendCommand(o,"subscribe"));return e},n.prototype.notifyAll=function(){var n,i,e,o,r,s,c;for(i=arguments[0],n=2<=arguments.length?t.call(arguments,1):[],r=this.subscriptions,s=[],e=0,o=r.length;e<o;e++)c=r[e],s.push(this.notify.apply(this,[c,i].concat(t.call(n))));return s},n.prototype.notify=function(){var n,i,e,o,r,s,c;for(s=arguments[0],i=arguments[1],n=3<=arguments.length?t.call(arguments,2):[],c="string"==typeof s?this.findAll(s):[s],r=[],e=0,o=c.length;e<o;e++)s=c[e],r.push("function"==typeof s[i]?s[i].apply(s,n):void 0);return r},n.prototype.sendCommand=function(t,n){var i;return i=t.identifier,this.consumer.send({command:n,identifier:i})},n}()}.call(this),function(){r.Subscription=function(){function t(t,i,e){this.consumer=t,null==i&&(i={}),this.identifier=JSON.stringify(i),n(this,e)}var n;return t.prototype.perform=function(t,n){return null==n&&(n={}),n.action=t,this.send(n)},t.prototype.send=function(t){return this.consumer.send({command:"message",identifier:this.identifier,data:JSON.stringify(t)})},t.prototype.unsubscribe=function(){return this.consumer.subscriptions.remove(this)},n=function(t,n){var i,e;if(null!=n)for(i in n)e=n[i],t[i]=e;return t},t}()}.call(this),function(){r.Consumer=function(){function t(t){this.url=t,this.subscriptions=new r.Subscriptions(this),this.connection=new r.Connection(this)}return t.prototype.send=function(t){return this.connection.send(t)},t.prototype.connect=function(){return this.connection.open()},t.prototype.disconnect=function(){return this.connection.close({allowReconnect:!1})},t.prototype.ensureActiveConnection=function(){if(!this.connection.isActive())return this.connection.open()},t}()}.call(this)}).call(this),"object"==typeof t&&t.exports?t.exports=r:(e=r,o="function"==typeof e?e.call(n,i,n,t):e,!(void 0!==o&&(t.exports=o)))}).call(this)},function(t,n){"use strict";var i=function(){function t(t){this.instance=t||{};var n=this.instance.configuration.jQuery;if("undefined"==typeof n||"function"!=typeof n.ajax){var i="jQuery and jQuery.ajax are required to use the API";throw new Error(i)}}return t.prototype.findNotification=function(t,n){n=n||{};var i=this.url()+"/notifications/"+t+".json",e={access_id:this.instance.configuration.accessId,service_token:this.instance.configuration.serviceToken},o={url:i,data:e,type:"GET"};return this.jQuery().ajax(this.jQuery().extend(n,o)).always(function(){})},t.prototype.unreadUserNotifications=function(t){t=t||{};var n=this.instance.configuration.userId,i=this.url()+"/users/"+n+"/notifications/unread.json",e=t.since,o={access_id:this.instance.configuration.accessId,service_token:this.instance.configuration.serviceToken};e&&(o.since=e,delete t.since),e&&(o.since=e);var r={url:i,data:o,type:"GET"};return this.jQuery().ajax(this.jQuery().extend(t,r)).always(function(){})},t.prototype.userNotifications=function(t){t=t||{};var n=this.instance.configuration.userId,i=this.url()+"/users/"+n+"/notifications.json",e=t.since,o={access_id:this.instance.configuration.accessId,service_token:this.instance.configuration.serviceToken};e&&(o.since=e,delete t.since);var r={url:i,data:o,type:"GET"};return this.jQuery().ajax(this.jQuery().extend(t,r)).always(function(){})},t.prototype.jQuery=function(){return this.instance.configuration.jQuery},t.prototype.url=function(){return this.instance.configuration.apiEndpoint},t}();t.exports=i},function(t,n){"use strict";var i=function(){function t(t){this.instance=t,this.consumer=t._actionCableConsumer,this.subscriptions={},s=[],i.call(this)}function n(t){if(s.indexOf(t)===-1){s.push(t);var n=NotificationService.channelNames.length;if(s.length===n){this.instance.subscriptionsInitialized=!0,this.instance.subscriptionsInitializationsCount+=1;var i={action:"subscriptions_initialized",data:null};o.call(this,i)}}}function i(){NotificationService.channelNames.forEach(function(t){e.call(this,t)}.bind(this))}function e(t){var i=r.call(this,t),e=this.consumer.subscriptions.create(i,{connected:function(t){n.call(this,t)}.bind(this,t),received:function(t){o.call(this,t)}.bind(this),rejected:function(t){var n="Connection to channel `"+t+"` was rejected";throw new Error(n)}.bind(this,t)});this.subscriptions[t]=e}function o(t){this.instance.callbacks.forEach(function(t,n){n.call(this,t)}.bind(this,t))}function r(t){return{accessId:this.instance.configuration.accessId,userId:this.instance.configuration.userId,channel:t}}var s=null;return t.prototype.resubscribeToAllChannels=function(){this.unsubscribeAllChannels(),i.call(this)},t.prototype.unsubscribeAllChannels=function(){Object.keys(this.subscriptions).forEach(function(t){this.consumer.subscriptions.remove(this.subscriptions[t]),delete this.subscriptions[t],s.splice(s.indexOf(t),1)}.bind(this))},t}();t.exports=i}]);