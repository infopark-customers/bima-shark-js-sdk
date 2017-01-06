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
