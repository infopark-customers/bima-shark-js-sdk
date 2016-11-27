(function (global) {
  "use strict";

  /*
   * @class
   */
  global.BimaNotificationManager = (function () {
    /*
     * Is the global object class for managing notifications in BImA
     * applications
     *
     * @construtor
     * @param {Object{}} options - object hash with the settings
     * @param {string} options.webSocketUrl - URL for the TCP Websocket to connect
     * @param {string} options.accessId - App access ID for the BImA
     * notification service
     * @param {string} options.userId - User ID for the current app which is
     * using the notification service
     * @param {Object[function ...]|function} options.callbacks - function or
     * array of functions which should be executed when a notification was
     * received
     * @param {boolean} options.initUnreadNotificationsFetch - Set true if all
     * unread notifications for the given user should be fetched [default: true]
     */
    function BimaNotificationManager (options) {
      options = options || {};

      this.webSocketUrl = options.webSocketUrl;
      this.accessId = options.accessId;
      this.userId = options.userId;
      this.initUnreadNotificationsFetch = options.initUnreadNotificationsFetch;

      if (typeof(this.initUnreadNotificationsFetch) === "undefined") {
        this.initUnreadNotificationsFetch = true;
      }

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

      createActionCableConsumer.call(this);
      createSubscriptionManager.call(this);
    };

    /*
     * Names of the notification channels
     *
     * @function
     * @name channelNames
     * @access public
     * @return {Array} - frozen array with the channel names
     */
    BimaNotificationManager.channelNames = function () {
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
    BimaNotificationManager.prototype.addCallback = function (fn) {
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
    BimaNotificationManager.prototype.connect = function () {
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
    BimaNotificationManager.prototype.disconnect = function () {
      this.subscriptionManager.unsubscribeAllChannels();
      this.actionCableConsumer.disconnect();
    };

    /*
     * Get all unread notifications for specified user
     *
     * @function
     * @name getAllUnreadNotifications
     * @access public
     */
    BimaNotificationManager.prototype.getAllUnreadNotifications = function () {
      var subscription = this.subscriptionManager.subscriptions["UserNotificationsChannel"];

      subscription.perform("get_all_unread_notifications");
    };

    /*
     * Mark a specific notification as read
     *
     * @function
     * @name markNotificationAsRead
     * @access public
     * @param {string|number} id - Id of the notification
     */
    BimaNotificationManager.prototype.markNotificationAsRead = function (id) {
      var subscription = this.subscriptionManager.subscriptions["UserNotificationsChannel"];

      subscription.perform("mark_notification_as_read", { notificationId: id });
    };

    // private

    function createActionCableConsumer () {
      try {
        var ActionCable = require("actioncable");

        this.actionCableConsumer = ActionCable.createConsumer(this.webSocketUrl);
        this.actionCableConsumer.connect();
      }
      catch (err) {
        throw new Error(err);
      }
    };

    function createSubscriptionManager ()  {
      var SubscriptionManager = require("./subscription_manager.js");
      this.subscriptionManager = new SubscriptionManager(this);
    };

    return BimaNotificationManager;
  })();
}(window));
