import Vue from "vue";
export default {
  data() {
    return {
      hasSMSPermission: false,
      doReqSMSPermission: false,
      smsError: "",
      smsStatus: "",
      smsResponse: ""
    };
  },
  computed: {
    awaitResponseTimeout() {
      return this.responseTimeout;
    },
    awaitResponse() {
      return this.awaitResponseTimeout > 0 ? true : false;
    }
  },
  methods: {
    async sendSMS({ phone, msg, opt }) {
      this.smsStatus = "start";
      this.smsError = "";
      this.responseMsg = "";
      this.responseStatus = "";

      let success = () => {
        this.smsStatus = "sent-success";
      };
      let error = e => {
        this.smsStatus = "sent-error";
        this.smsError = e;
      };

      if (typeof sms === "undefined") {
        this.responseMsg = "SMS facility not available on this device.";
        this.responseStatus = "error";
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

          SMSReceive.startWatch(successResponseSent, errorResponse);
          console.log("Awaiting response..");

          const msgOk = this.msgOk;

          document.addEventListener("onSMSArrive", e => {
            var IncomingSMS = e.data;

            /* Debug received SMS content (JSON) */
            console.log(JSON.stringify(IncomingSMS));

            if (IncomingSMS.address && IncomingSMS.address.includes(phone)) {
              console.log("Looking for success or error - ", msgOk);
              console.log(
                IncomingSMS.body &&
                  IncomingSMS.body.toLowerCase().includes(msgOk)
              );
              if (
                IncomingSMS.body &&
                IncomingSMS.body.toLowerCase().includes(msgOk)
              ) {
                this.updateResponse("ok", "done");
                // this.responseMsg = "done";
                // this.responseStatus = "ok";
              } else {
                // this.responseMsg = IncomingSMS.body;
                // this.responseStatus = "error";
                this.updateResponse("error", IncomingSMS.body);
              }
              console.log("Stopping response listener..");
              SMSReceive.stopWatch(successResponseReceived, errorResponse);

              if (smsTimeout) clearTimeout(smsTimeout);
            }
          });

          var smsTimeout = setTimeout(() => {
            console.log("Timing out..!", this.smsStatus);
            if (
              this.smsStatus == "response-start" ||
              this.smsStatus == "sent-success"
            ) {
              this.responseMsg = "Response from device not received in time.";
              this.responseStatus = "error";
              SMSReceive.stopWatch(timeoutResponse, errorResponse);
            }
          }, this.awaitResponseTimeout);
        } else {
          // not waiting for response
          this.responseMsg = "done";
          this.responseStatus = "ok";
        }
      }
    },

    updateResponse(status, statusMsg) {
      console.log("updating them statuses", status, statusMsg);
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
