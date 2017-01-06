/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function (global) {
	  "use strict";

	  /*
	   * @class
	   */
	  global.BimaNotifications = (function () {
	    /*
	     * Is the global object class for managing notifications in BImA
	     * applications
	     *
	     * @construtor
	     * @param {Object{}} options - object hash with the settings
	     * @param {string} options.url - Basic URL to the API endpoint of the
	     * Notification service
	     * IMPORTANT: Please use here without any protocol and extra paths
	     * @param {string} options.accessId - App access ID for the BImA
	     * notification service
	     * @param {string} options.serviceToken - Service Token for BImA Doorkeeper
	     * app to access the API
	     * @param {string} options.userId - User ID related with the given serviceToken
	     * @param {boolean} options.useHttps - Set true if API endpoint should be
	     * called with https [default: true]
	     * @param {Object[function ...]|function} options.callbacks - function or
	     * array of functions which should be executed when a notification was
	     * received
	     */
	    function BimaNotifications (options) {
	      options = options || {};

	      this.url = options.url;
	      this.accessId = options.accessId;
	      this.serviceToken = options.serviceToken;
	      this.userId = options.userId;
	      this.useHttps = options.useHttps;

	      if (typeof(this.useHttps) === "undefined") this.useHttps = true;

	      var callbacks = options.callbacks;

	      if (typeof(callbacks) !== "undefined" && typeof(callbacks) === "function") {
	        this.callbacks = [callbacks];
	      }
	      else if (typeof(callbacks) === "object") {
	        this.callbacks = callbacks;
	      }
	      else {
	        this.callbacks = [];
	      }

	      createFullSocketUrl.call(this);
	      createActionCableConsumer.call(this);
	      createSubscriptionManager.call(this);

	      this.subscriptionsInitialized = false;
	      this.jQuery = options.jQuery || jQuery || $;

	      var Api = __webpack_require__(2);
	      this.Api = new Api(this);
	    };

	    /*
	     * Names of the notification channels
	     *
	     * @function
	     * @name channelNames
	     * @access public
	     * @return {Array} - frozen array with the channel names
	     */
	    BimaNotifications.channelNames = function () {
	      return Object.freeze([
	        "GlobalNotificationsChannel",
	        "UserNotificationsChannel"
	      ]);
	    };

	    /*
	     * Adds a function to the callbacks
	     *
	     * @function
	     * @name addCallback
	     * @access public
	     * @param {function} fn - function to be added
	     */
	    BimaNotifications.prototype.addCallback = function (fn) {
	      if (typeof(fn) === "function" && typeof(this.callbacks) === "object") {
	        this.callbacks.push(fn);
	      }
	    };

	    /*
	     * Connect with the Websocket server under the specified address
	     *
	     * @function
	     * @name connect
	     * @access public
	     */
	    BimaNotifications.prototype.connect = function () {
	      this.actionCableConsumer.connect;
	      this.subscriptionManager.resubscribeToAllChannels();
	    };

	    /*
	     * Disconnect from the websocket
	     *
	     * @function
	     * @name disconnect
	     * @access public
	     */
	    BimaNotifications.prototype.disconnect = function () {
	      this.subscriptionManager.unsubscribeAllChannels();
	      this.actionCableConsumer.disconnect();
	    };

	    /*
	     * Mark a specific notification as read
	     *
	     * @function
	     * @name markNotificationAsRead
	     * @access public
	     * @param {string|number} id - Id of the notification
	     */
	    BimaNotifications.prototype.markNotificationAsRead = function (id) {
	      var subscription = this.subscriptionManager.subscriptions["UserNotificationsChannel"];

	      subscription.perform("mark_notification_as_read", { notification_id: id });
	    };

	    // private

	    function createActionCableConsumer () {
	      try {
	        var ActionCable = __webpack_require__(3);

	        this.actionCableConsumer = ActionCable.createConsumer(this.fullSocketUrl);
	        this.connection = this.actionCableConsumer.connection;
	        this.actionCableConsumer.connect();
	      }
	      catch (err) {
	        throw new Error(err);
	      }
	    };

	    function createFullSocketUrl () {
	      const url = this.url;
	      const accessId = this.accessId;
	      const serviceToken = this.serviceToken;

	      if (url && accessId && serviceToken) {
	        var socketUrl = "ws://" + url + "/socket";

	        if(socketUrl.match(/^ws:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/)) {
	          this.fullSocketUrl = socketUrl;
	          this.fullSocketUrl += "?access_id=" + accessId;
	          this.fullSocketUrl += "&service_token=" + serviceToken;
	          this.fullSocketUrl = encodeURI(this.fullSocketUrl);
	        }
	        else {
	          throw new Error("options.socketUrl has invalid format");
	        }
	      }
	      else {
	        throw new Error("Required option parameters are missing");
	      }
	    };

	    function createSubscriptionManager ()  {
	      var SubscriptionManager = __webpack_require__(4);
	      this.subscriptionManager = new SubscriptionManager(this);
	    };

	    return BimaNotifications;
	  })();

	  // In Node.JS base envs
	  if ((typeof(process) !== "undefined")) {
	   module.exports = BimaNotifications;
	  }
	}(window));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	/*
	 * @class
	 */
	var Api = (function () {
	  /*
	   * Management class to access the notifications REST API
	   *
	   * @construtor
	   * @param {BimaNotifications} instance
	   */
	  function Api (instance) {
	    this.instance = instance || {};

	    if (typeof(this.instance.jQuery) !== "undefined" && typeof(this.instance.jQuery.ajax) === "function") {
	    }
	    else {
	      var error = "jQuery and jQuery.ajax are required to use the API";
	      throw new Error(error);
	    }
	  };

	  /*
	   * API call to find a specific notification
	   *
	   * @function
	   * @name findNotification
	   * @param {Number|String} id - ID of the notification to be found
	   * @param {Object} ajaxOptions - extra options hash for jQuery.ajax
	   * @access public
	   * @return {Promise} - jQuery AJAX promise
	   */
	  Api.prototype.findNotification = function (id, ajaxOptions) {
	    ajaxOptions = ajaxOptions || {};

	    var reqUrl = this.url() + "/notifications/" + id + ".json";
	    var data = {
	      access_id: this.instance.accessId,
	      service_token: this.instance.serviceToken
	    };
	    var options = { url: reqUrl, data: data, type: "GET" };

	    return this.instance.jQuery.ajax(this.instance.jQuery.extend(ajaxOptions, options));
	  };

	  /*
	   * API call to get all unread notifications for the given user
	   *
	   * @function
	   * @name findNotification
	   * @param {Date} since - Date since when notifications should be fetched
	   * [default: 7 days ago]
	   * @param {Object} ajaxOptions - extra options hash for jQuery.ajax
	   * @access public
	   * @return {Promise} - jQuery AJAX promise
	   */
	  Api.prototype.unreadUserNotifications = function (since, ajaxOptions) {
	    ajaxOptions = ajaxOptions || {};

	    var userId = this.instance.userId;
	    var reqUrl = this.url() + "/users/" + userId + "/notifications/unread" + ".json";
	    var data = {
	      access_id: this.instance.accessId,
	      service_token: this.instance.serviceToken
	    };

	    if (since) data["since"] = since;
	    var options = { url: reqUrl, data: data, type: "GET" };

	    return this.instance.jQuery.ajax(this.instance.jQuery.extend(ajaxOptions, options));
	  };

	  /*
	   * API call to get all notifications for the given user
	   *
	   * @function
	   * @name findNotification
	   * @param {Date} since - Date since when notifications should be fetched
	   * [default: 7 days ago]
	   * @param {Object} ajaxOptions - extra options hash for jQuery.ajax
	   * @access public
	   * @return {Promise} - jQuery AJAX promise
	   */
	  Api.prototype.userNotifications = function (since, ajaxOptions) {
	    ajaxOptions = ajaxOptions || {};

	    var userId = this.instance.userId;
	    var reqUrl = this.url() + "/users/" + userId + "/notifications" + ".json";
	    var data = {
	      access_id: this.instance.accessId,
	      service_token: this.instance.serviceToken
	    };

	    if (since) data["since"] = since;
	    var options = { url: reqUrl, data: data, type: "GET" };

	    return this.instance.jQuery.ajax(this.instance.jQuery.extend(ajaxOptions, options));
	  };

	  /*
	   * URL to the HTTP(S) API endpoint
	   *
	   * @function
	   * @name url
	   * @access public
	   * @return String
	   */
	  Api.prototype.url = function () {
	    var url = "";

	    if (this.instance.useHttps === true) {
	      url += "https://";
	    }
	    else {
	      url += "http://";
	    }

	    // TODO: Make this version later dynamicly configureable
	    url += this.instance.url + "/api/v1";
	    return url;
	  };

	  return Api;
	})();

	module.exports = Api;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {
	  (function() {
	    (function() {
	      var slice = [].slice;

	      this.ActionCable = {
	        INTERNAL: {
	          "message_types": {
	            "welcome": "welcome",
	            "ping": "ping",
	            "confirmation": "confirm_subscription",
	            "rejection": "reject_subscription"
	          },
	          "default_mount_path": "/cable",
	          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
	        },
	        createConsumer: function(url) {
	          var ref;
	          if (url == null) {
	            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
	          }
	          return new ActionCable.Consumer(this.createWebSocketURL(url));
	        },
	        getConfig: function(name) {
	          var element;
	          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
	          return element != null ? element.getAttribute("content") : void 0;
	        },
	        createWebSocketURL: function(url) {
	          var a;
	          if (url && !/^wss?:/i.test(url)) {
	            a = document.createElement("a");
	            a.href = url;
	            a.href = a.href;
	            a.protocol = a.protocol.replace("http", "ws");
	            return a.href;
	          } else {
	            return url;
	          }
	        },
	        startDebugging: function() {
	          return this.debugging = true;
	        },
	        stopDebugging: function() {
	          return this.debugging = null;
	        },
	        log: function() {
	          var messages;
	          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          if (this.debugging) {
	            messages.push(Date.now());
	            return console.log.apply(console, ["[ActionCable]"].concat(slice.call(messages)));
	          }
	        }
	      };

	    }).call(this);
	  }).call(this);

	  var ActionCable = this.ActionCable;

	  (function() {
	    (function() {
	      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	      ActionCable.ConnectionMonitor = (function() {
	        var clamp, now, secondsSince;

	        ConnectionMonitor.pollInterval = {
	          min: 3,
	          max: 30
	        };

	        ConnectionMonitor.staleThreshold = 6;

	        function ConnectionMonitor(connection) {
	          this.connection = connection;
	          this.visibilityDidChange = bind(this.visibilityDidChange, this);
	          this.reconnectAttempts = 0;
	        }

	        ConnectionMonitor.prototype.start = function() {
	          if (!this.isRunning()) {
	            this.startedAt = now();
	            delete this.stoppedAt;
	            this.startPolling();
	            document.addEventListener("visibilitychange", this.visibilityDidChange);
	            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
	          }
	        };

	        ConnectionMonitor.prototype.stop = function() {
	          if (this.isRunning()) {
	            this.stoppedAt = now();
	            this.stopPolling();
	            document.removeEventListener("visibilitychange", this.visibilityDidChange);
	            return ActionCable.log("ConnectionMonitor stopped");
	          }
	        };

	        ConnectionMonitor.prototype.isRunning = function() {
	          return (this.startedAt != null) && (this.stoppedAt == null);
	        };

	        ConnectionMonitor.prototype.recordPing = function() {
	          return this.pingedAt = now();
	        };

	        ConnectionMonitor.prototype.recordConnect = function() {
	          this.reconnectAttempts = 0;
	          this.recordPing();
	          delete this.disconnectedAt;
	          return ActionCable.log("ConnectionMonitor recorded connect");
	        };

	        ConnectionMonitor.prototype.recordDisconnect = function() {
	          this.disconnectedAt = now();
	          return ActionCable.log("ConnectionMonitor recorded disconnect");
	        };

	        ConnectionMonitor.prototype.startPolling = function() {
	          this.stopPolling();
	          return this.poll();
	        };

	        ConnectionMonitor.prototype.stopPolling = function() {
	          return clearTimeout(this.pollTimeout);
	        };

	        ConnectionMonitor.prototype.poll = function() {
	          return this.pollTimeout = setTimeout((function(_this) {
	            return function() {
	              _this.reconnectIfStale();
	              return _this.poll();
	            };
	          })(this), this.getPollInterval());
	        };

	        ConnectionMonitor.prototype.getPollInterval = function() {
	          var interval, max, min, ref;
	          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
	          interval = 5 * Math.log(this.reconnectAttempts + 1);
	          return Math.round(clamp(interval, min, max) * 1000);
	        };

	        ConnectionMonitor.prototype.reconnectIfStale = function() {
	          if (this.connectionIsStale()) {
	            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
	            this.reconnectAttempts++;
	            if (this.disconnectedRecently()) {
	              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
	            } else {
	              ActionCable.log("ConnectionMonitor reopening");
	              return this.connection.reopen();
	            }
	          }
	        };

	        ConnectionMonitor.prototype.connectionIsStale = function() {
	          var ref;
	          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
	        };

	        ConnectionMonitor.prototype.disconnectedRecently = function() {
	          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
	        };

	        ConnectionMonitor.prototype.visibilityDidChange = function() {
	          if (document.visibilityState === "visible") {
	            return setTimeout((function(_this) {
	              return function() {
	                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
	                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
	                  return _this.connection.reopen();
	                }
	              };
	            })(this), 200);
	          }
	        };

	        now = function() {
	          return new Date().getTime();
	        };

	        secondsSince = function(time) {
	          return (now() - time) / 1000;
	        };

	        clamp = function(number, min, max) {
	          return Math.max(min, Math.min(max, number));
	        };

	        return ConnectionMonitor;

	      })();

	    }).call(this);
	    (function() {
	      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
	        slice = [].slice,
	        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

	      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

	      ActionCable.Connection = (function() {
	        Connection.reopenDelay = 500;

	        function Connection(consumer) {
	          this.consumer = consumer;
	          this.open = bind(this.open, this);
	          this.subscriptions = this.consumer.subscriptions;
	          this.monitor = new ActionCable.ConnectionMonitor(this);
	          this.disconnected = true;
	        }

	        Connection.prototype.send = function(data) {
	          if (this.isOpen()) {
	            this.webSocket.send(JSON.stringify(data));
	            return true;
	          } else {
	            return false;
	          }
	        };

	        Connection.prototype.open = function() {
	          if (this.isActive()) {
	            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
	            throw new Error("Existing connection must be closed before opening");
	          } else {
	            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
	            if (this.webSocket != null) {
	              this.uninstallEventHandlers();
	            }
	            this.webSocket = new WebSocket(this.consumer.url, protocols);
	            this.installEventHandlers();
	            this.monitor.start();
	            return true;
	          }
	        };

	        Connection.prototype.close = function(arg) {
	          var allowReconnect, ref1;
	          allowReconnect = (arg != null ? arg : {
	            allowReconnect: true
	          }).allowReconnect;
	          if (!allowReconnect) {
	            this.monitor.stop();
	          }
	          if (this.isActive()) {
	            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
	          }
	        };

	        Connection.prototype.reopen = function() {
	          var error, error1;
	          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
	          if (this.isActive()) {
	            try {
	              return this.close();
	            } catch (error1) {
	              error = error1;
	              return ActionCable.log("Failed to reopen WebSocket", error);
	            } finally {
	              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
	              setTimeout(this.open, this.constructor.reopenDelay);
	            }
	          } else {
	            return this.open();
	          }
	        };

	        Connection.prototype.getProtocol = function() {
	          var ref1;
	          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
	        };

	        Connection.prototype.isOpen = function() {
	          return this.isState("open");
	        };

	        Connection.prototype.isActive = function() {
	          return this.isState("open", "connecting");
	        };

	        Connection.prototype.isProtocolSupported = function() {
	          var ref1;
	          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
	        };

	        Connection.prototype.isState = function() {
	          var ref1, states;
	          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
	        };

	        Connection.prototype.getState = function() {
	          var ref1, state, value;
	          for (state in WebSocket) {
	            value = WebSocket[state];
	            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
	              return state.toLowerCase();
	            }
	          }
	          return null;
	        };

	        Connection.prototype.installEventHandlers = function() {
	          var eventName, handler;
	          for (eventName in this.events) {
	            handler = this.events[eventName].bind(this);
	            this.webSocket["on" + eventName] = handler;
	          }
	        };

	        Connection.prototype.uninstallEventHandlers = function() {
	          var eventName;
	          for (eventName in this.events) {
	            this.webSocket["on" + eventName] = function() {};
	          }
	        };

	        Connection.prototype.events = {
	          message: function(event) {
	            var identifier, message, ref1, type;
	            if (!this.isProtocolSupported()) {
	              return;
	            }
	            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
	            switch (type) {
	              case message_types.welcome:
	                this.monitor.recordConnect();
	                return this.subscriptions.reload();
	              case message_types.ping:
	                return this.monitor.recordPing();
	              case message_types.confirmation:
	                return this.subscriptions.notify(identifier, "connected");
	              case message_types.rejection:
	                return this.subscriptions.reject(identifier);
	              default:
	                return this.subscriptions.notify(identifier, "received", message);
	            }
	          },
	          open: function() {
	            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
	            this.disconnected = false;
	            if (!this.isProtocolSupported()) {
	              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
	              return this.close({
	                allowReconnect: false
	              });
	            }
	          },
	          close: function(event) {
	            ActionCable.log("WebSocket onclose event");
	            if (this.disconnected) {
	              return;
	            }
	            this.disconnected = true;
	            this.monitor.recordDisconnect();
	            return this.subscriptions.notifyAll("disconnected", {
	              willAttemptReconnect: this.monitor.isRunning()
	            });
	          },
	          error: function() {
	            return ActionCable.log("WebSocket onerror event");
	          }
	        };

	        return Connection;

	      })();

	    }).call(this);
	    (function() {
	      var slice = [].slice;

	      ActionCable.Subscriptions = (function() {
	        function Subscriptions(consumer) {
	          this.consumer = consumer;
	          this.subscriptions = [];
	        }

	        Subscriptions.prototype.create = function(channelName, mixin) {
	          var channel, params, subscription;
	          channel = channelName;
	          params = typeof channel === "object" ? channel : {
	            channel: channel
	          };
	          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
	          return this.add(subscription);
	        };

	        Subscriptions.prototype.add = function(subscription) {
	          this.subscriptions.push(subscription);
	          this.consumer.ensureActiveConnection();
	          this.notify(subscription, "initialized");
	          this.sendCommand(subscription, "subscribe");
	          return subscription;
	        };

	        Subscriptions.prototype.remove = function(subscription) {
	          this.forget(subscription);
	          if (!this.findAll(subscription.identifier).length) {
	            this.sendCommand(subscription, "unsubscribe");
	          }
	          return subscription;
	        };

	        Subscriptions.prototype.reject = function(identifier) {
	          var i, len, ref, results, subscription;
	          ref = this.findAll(identifier);
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            subscription = ref[i];
	            this.forget(subscription);
	            this.notify(subscription, "rejected");
	            results.push(subscription);
	          }
	          return results;
	        };

	        Subscriptions.prototype.forget = function(subscription) {
	          var s;
	          this.subscriptions = (function() {
	            var i, len, ref, results;
	            ref = this.subscriptions;
	            results = [];
	            for (i = 0, len = ref.length; i < len; i++) {
	              s = ref[i];
	              if (s !== subscription) {
	                results.push(s);
	              }
	            }
	            return results;
	          }).call(this);
	          return subscription;
	        };

	        Subscriptions.prototype.findAll = function(identifier) {
	          var i, len, ref, results, s;
	          ref = this.subscriptions;
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            s = ref[i];
	            if (s.identifier === identifier) {
	              results.push(s);
	            }
	          }
	          return results;
	        };

	        Subscriptions.prototype.reload = function() {
	          var i, len, ref, results, subscription;
	          ref = this.subscriptions;
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            subscription = ref[i];
	            results.push(this.sendCommand(subscription, "subscribe"));
	          }
	          return results;
	        };

	        Subscriptions.prototype.notifyAll = function() {
	          var args, callbackName, i, len, ref, results, subscription;
	          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	          ref = this.subscriptions;
	          results = [];
	          for (i = 0, len = ref.length; i < len; i++) {
	            subscription = ref[i];
	            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
	          }
	          return results;
	        };

	        Subscriptions.prototype.notify = function() {
	          var args, callbackName, i, len, results, subscription, subscriptions;
	          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
	          if (typeof subscription === "string") {
	            subscriptions = this.findAll(subscription);
	          } else {
	            subscriptions = [subscription];
	          }
	          results = [];
	          for (i = 0, len = subscriptions.length; i < len; i++) {
	            subscription = subscriptions[i];
	            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
	          }
	          return results;
	        };

	        Subscriptions.prototype.sendCommand = function(subscription, command) {
	          var identifier;
	          identifier = subscription.identifier;
	          return this.consumer.send({
	            command: command,
	            identifier: identifier
	          });
	        };

	        return Subscriptions;

	      })();

	    }).call(this);
	    (function() {
	      ActionCable.Subscription = (function() {
	        var extend;

	        function Subscription(consumer, params, mixin) {
	          this.consumer = consumer;
	          if (params == null) {
	            params = {};
	          }
	          this.identifier = JSON.stringify(params);
	          extend(this, mixin);
	        }

	        Subscription.prototype.perform = function(action, data) {
	          if (data == null) {
	            data = {};
	          }
	          data.action = action;
	          return this.send(data);
	        };

	        Subscription.prototype.send = function(data) {
	          return this.consumer.send({
	            command: "message",
	            identifier: this.identifier,
	            data: JSON.stringify(data)
	          });
	        };

	        Subscription.prototype.unsubscribe = function() {
	          return this.consumer.subscriptions.remove(this);
	        };

	        extend = function(object, properties) {
	          var key, value;
	          if (properties != null) {
	            for (key in properties) {
	              value = properties[key];
	              object[key] = value;
	            }
	          }
	          return object;
	        };

	        return Subscription;

	      })();

	    }).call(this);
	    (function() {
	      ActionCable.Consumer = (function() {
	        function Consumer(url) {
	          this.url = url;
	          this.subscriptions = new ActionCable.Subscriptions(this);
	          this.connection = new ActionCable.Connection(this);
	        }

	        Consumer.prototype.send = function(data) {
	          return this.connection.send(data);
	        };

	        Consumer.prototype.connect = function() {
	          return this.connection.open();
	        };

	        Consumer.prototype.disconnect = function() {
	          return this.connection.close({
	            allowReconnect: false
	          });
	        };

	        Consumer.prototype.ensureActiveConnection = function() {
	          if (!this.connection.isActive()) {
	            return this.connection.open();
	          }
	        };

	        return Consumer;

	      })();

	    }).call(this);
	  }).call(this);

	  if (typeof module === "object" && module.exports) {
	    module.exports = ActionCable;
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (ActionCable), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	/*
	 * @class
	 */
	var SubscriptionManager = (function () {
	  /*
	   * Management wrapper for ActionCable Websocket subscriptions
	   *
	   * @construtor
	   * @param {BimaNotifications} instance
	   */
	  function SubscriptionManager (instance) {
	    this.instance = instance;
	    this.consumer = instance.actionCableConsumer;
	    this.subscriptions = {};
	    this.connectedChannels = [];

	    createChannelSubscriptions.call(this);
	  };
	  /*
	   * Unsubscribe and resubscribe to all channels
	   *
	   * @function
	   * @name resubscribeToAllChannels
	   * @access public
	   */
	  SubscriptionManager.prototype.resubscribeToAllChannels = function () {
	    this.unsubscribeAllChannels();
	    createChannelSubscriptions.call(this);
	  };

	  /*
	   * Unsubscribe from all subscribed channels
	   *
	   * @function
	   * @name unsubscribeAllChannels
	   * @access public
	   */
	  SubscriptionManager.prototype.unsubscribeAllChannels = function () {
	    Object.keys(this.subscriptions).forEach(function (channelName) {
	      this.consumer.subscriptions.remove(this.subscriptions[channelName]);
	      delete(this.subscriptions[channelName]);
	      this.connectedChannels.splice(this.connectedChannels.indexOf(channelName), 1)
	    }.bind(this));
	  };

	  // private

	  function addConnectedChannel (channelName) {
	    if (this.connectedChannels.indexOf(channelName) === -1) {
	      this.connectedChannels.push(channelName);
	      var channelsCount = BimaNotifications.channelNames().length;

	      if (this.connectedChannels.length === channelsCount) {
	        this.instance.subscriptionsInitialized = true;

	        var data = { action: "subscriptions_initialized", data: null }
	        performCallbacks.call(this, data);
	      }
	    }
	  };

	  function createChannelSubscriptions () {
	    BimaNotifications.channelNames().forEach(function (channelName) {
	      createSingleChannelSubscription.call(this, channelName);
	    }.bind(this));
	  };

	  function createSingleChannelSubscription (channelName) {
	    var params = subscriptionParamsForChannel.call(this, channelName);
	    var subscription = this.consumer.subscriptions.create(params, {
	      connected: function (channelName) {
	        addConnectedChannel.call(this, channelName);
	      }.bind(this, channelName),

	      received: function (data) {
	        performCallbacks.call(this, data);
	      }.bind(this),

	      rejected: function (channelName) {
	        var error = "Connection to channel `" + channelName + "` was rejected";
	        throw new Error(error);
	      }.bind(this, channelName)
	    });

	    this.subscriptions[channelName] = subscription;
	  };

	  function performCallbacks (data) {
	    this.instance.callbacks.forEach(function (data, fn) {
	      fn.call(this, data);
	    }.bind(this, data));
	  };

	  function subscriptionParamsForChannel (channelName) {
	    return {
	      accessId: this.instance.accessId,
	      userId: this.instance.userId,
	      channel: channelName
	    };
	  };

	  return SubscriptionManager;
	})();

	module.exports = SubscriptionManager;


/***/ }
/******/ ]);