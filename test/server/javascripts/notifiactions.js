        var notifications = [];

        var callback = function (response) {
          if(typeof(response) !== "undefined" && response["action"]) {
            console.log(response);
          }
        };

        window.notifications = new BimaNotifications({
          url: "localhost:5000",
          accessId: "<%= @access_id %>",
          serviceToken: "<%= session[:service_token] %>",
          userId: "<%= session[:user_id] %>",
          useHttps: false,
          callbacks: [callback]
        });

