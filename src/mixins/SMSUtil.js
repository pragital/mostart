import Vue from "vue";
export default {
  data() {
    return {
      hasSMSPermission: false,
      doReqSMSPermission: false,
      smsError: "",
      smsStatus: "",
      smsResponse: "",
      smsTimeoutFunc: null
    };
  },
  computed: {},
  methods: {
    sendSMS({ phone, msg, opt }) {
      this.updateResponse("", "");
      this.smsStatus = "start";
      this.smsError = "";

      let success = () => {
        this.smsStatus = "sent-success";
      };
      let error = e => {
        this.smsStatus = "sent-error";
        this.smsError = e;
      };

      if (typeof sms === "undefined")
        this.updateResponse(
          "error",
          "SMS facility not available on this device."
        );
      else {
        this.checkSMSPermission();
        sms.send(phone, msg, opt, success, error);

        console.log("SMS sent!");

        if (this.responseTimeout > 0) {
          // wait for response if timeout > 0

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

          SMSReceive.startWatch(successResponseSent, errorResponse);
          console.log("Awaiting response..");

          const msgOk = this.msgOk;

          document.addEventListener("onSMSArrive", e => {
            var IncomingSMS = e.data;

            /* Debug received SMS content (JSON) */
            console.log(JSON.stringify(IncomingSMS));

            if (IncomingSMS.address && IncomingSMS.address.includes(phone)) {
              console.log("Looking for success or error - ", msgOk);

              if (
                IncomingSMS.body &&
                IncomingSMS.body.toLowerCase().includes(msgOk)
              )
                this.updateResponse("ok", IncomingSMS.body);
              else this.updateResponse("error", IncomingSMS.body);

              console.log("Stopping response listener..");
              SMSReceive.stopWatch(successResponseReceived, errorResponse);

              if (this.smsTimeoutFunc) {
                clearTimeout(this.smsTimeoutFunc);
                this.smsTimeoutFunc = null;
              }
            }
          });

          this.smsTimeoutFunc = setTimeout(() => {
            console.log("Timing out..!", this.smsStatus);
            if (
              this.smsStatus == "response-start" ||
              this.smsStatus == "sent-success"
            ) {
              this.updateResponse(
                "error",
                "Response from device not received in time."
              );
              SMSReceive.stopWatch(timeoutResponse, errorResponse);
            }
          }, this.responseTimeout);
        } else {
          // not waiting for response
          // this will not trigger updates if we don't wait for next tick
          setTimeout(() => {
            this.updateResponse("ok", "Done.");
          }, 500);
        }
      }
    },

    updateResponse(status, statusMsg) {
      console.log("updating response", status);
      this.responseMsg = statusMsg;
      this.responseStatus = status;
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
        this.smsError = e;
      };

      sms.hasPermission(success, error);
    },

    requestSMSPermission() {
      let success = function(hasPermission) {
        console.log("SMS hasPermission: ", hasPermission);
        if (!hasPermission) {
          console.log("Requesting SMS permission..");
          sms.requestPermission(
            function() {
              console.log("SMS permission accepted.");
            },
            function(error) {
              console.warn("SMS permission not accepted.");
              console.error("error", error);
              // Handle permission not accepted
            }
          );
        }
      };
      let error = function(e) {
        console.error("error", e);
        this.smsError = e;
      };

      sms.hasPermission(success, error);
    }
  }
};
