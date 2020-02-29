export default {
  data() {
    return {
      hasSMSPermission: false,
      doReqSMSPermission: false,
      smsError: "",
      smsStatus: "",
      smsResponse: "",
      awaitResponse: true,
      awaitTimeout: 30000,
      responseStatus: "",
      responseMsg: ""
    };
  },
  computed: {},
  methods: {
    sendSMS({ phone, msg, opt }) {
      this.smsStatus = "start";
      this.smsError = "";
      this.responseStatus = "";
      this.responseMsg = "";

      let success = () => {
        this.smsStatus = "sent-success";
      };
      let error = e => {
        this.smsStatus = "sent-error";
        this.smsError = e;
      };

      if (typeof sms === "undefined") {
        this.smsError = "SMS facility not available on this device.";
        console.error(this.smsError);
      } else {
        this.checkSMSPermission();
        sms.send(phone, msg, opt, success, error);

        if (this.awaitResponse) {
          const successResponseSent = () => {
            this.smsStatus = "response-start";
          };
          const errorResponse = e => {
            this.smsStatus = "response-error";
            this.smsError = e;
          };
          const successResponseReceived = () => {
            this.smsStatus = "response-received";
          };
          const timeoutResponse = () => {
            this.smsStatus = "response-timeout";
          };
          console.log("Waiting for response");
          SMSReceive.startWatch(successResponseSent, errorResponse);

          document.addEventListener("onSMSArrive", function(e) {
            var IncomingSMS = e.data;

            /* Debug received SMS content (JSON) */
            console.log(JSON.stringify(IncomingSMS));

            if (IncomingSMS.address && IncomingSMS.address.includes(phone)) {
              if (IncomingSMS.body && IncomingSMS.body.includes("ok")) {
                this.responseStatus = "ok";
                this.responseMsg = "done";
                console.log("set: ", this.responseStatus, this.responseMsg);
              } else {
                this.responseStatus = "error";
                this.responseMsg = IncomingSMS.body;
                console.log("set: ", this.responseStatus, this.responseMsg);
              }
              console.log("Stopping response listener..");
              SMSReceive.stopWatch(successResponseReceived, errorResponse);
            }
          });

          setTimeout(() => {
            console.log("Timing out..!", this.smsStatus);
            if (
              this.smsStatus == "response-start" ||
              this.smsStatus == "sent-success"
            ) {
              console.log("Timed-out response listener");
              this.responseStatus = "error";
              this.responseMsg = "Response from motor not received in time.";
              SMSReceive.stopWatch(timeoutResponse, errorResponse);
            }
          }, this.awaitTimeout);
        }
      }
    },

    checkSMSPermission() {
      let success = hasPermission => {
        if (hasPermission) {
          this.hasSMSPermission = true;
        } else {
          // monitor this prop in UI
          // show message and call requestSMSPermission if required
          this.doReqSMSPermission = true;
          // show a helpful message to explain why you need to require the permission to send a SMS
          // read http://developer.android.com/training/permissions/requesting.html#explain for more best practices
        }
      };

      let error = e => {
        console.log("error", e);
        this.smsError = e;
      };

      sms.hasPermission(success, error);
    },

    requestSMSPermission() {
      let success = function(hasPermission) {
        console.log("hasPermission: ", hasPermission);
        if (!hasPermission) {
          console.log("Requesting SMS permission..");
          sms.requestPermission(
            function() {
              console.log("SMS permission accepted.");
            },
            function(error) {
              console.warn("SMS permission not accepted.");
              console.log("error", error);
              // Handle permission not accepted
            }
          );
        }
      };
      let error = function(e) {
        console.log("error", e);
        this.smsError = e;
      };

      sms.hasPermission(success, error);
      console.log();
    }
  }
};
