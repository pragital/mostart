<template>
  <q-card class="q-mb-lg">
    <div class="row">
      <q-card class="col col-12 col-sm-8" v-if="motor">
        <q-card-actions class="dense justify-end q-px-md q-mb-md bg-grey-2">
          <q-btn
            flat
            color="grey-6"
            icon="edit"
            @click="editRecord(motor)"
            :disabled="motor['isChecking']"
          >
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
            <q-tooltip content-class="bg-blue-5">
              Edit device details incl. phone number, name or serial
              number.
            </q-tooltip>
          </q-btn>
          <!-- <q-btn
            flat
            color="grey-6"
            icon="view_headline"
            @click="showHistory(motor)"
          >
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
            <q-tooltip content-class="bg-blue-5"
              >Check request history for the device.</q-tooltip
            >
          </q-btn>-->

          <q-btn
            flat
            color="grey-6"
            icon="refresh"
            @click="refreshStatus(motor)"
            :disabled="motor['isChecking']"
          >
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
            <q-tooltip content-class="bg-blue-5">Refresh status by sending another SMS to device.</q-tooltip>
          </q-btn>
        </q-card-actions>
        <q-card-section class="q-px-md">
          <div class="row justify-around">
            <q-input class="col col-6" :value="motor['name']" label="Name" readonly />
            <q-input class="col col-6" :value="motor['location']" label="Location" readonly />
            <q-input
              class="col col-12 col-md-6"
              :value="motor['phone']"
              label="Device Phone"
              readonly
            />
          </div>
        </q-card-section>

        <div class="col flex col-12 col-sm-4 bg-grey-2 q-mt-md">
          <q-btn-toggle
            v-model="motorStatus"
            push
            rounded
            :toggle-color="controlColor"
            stretch
            stack
            spread
            size="lg"
            class="full-width"
            :options="[
              { value: 'off', slot: 'off' },
              { value: 'on', slot: 'on' }
            ]"
            :readonly="motor['isChecking']"
          >
            <template v-slot:off>
              <q-icon name="stop" />OFF
              <q-tooltip content-class="bg-blue-5">Turn device off.</q-tooltip>
            </template>

            <template v-slot:on>
              <q-icon name="highlight" />
              <div class="row items-center no-wrap">
                <div class="text-center">ON</div>
              </div>
              <q-tooltip content-class="bg-blue-5">Turn device on.</q-tooltip>
            </template>
          </q-btn-toggle>
          <q-btn
            class="full-width"
            flat
            color="primary"
            v-if="motor['isChecking']"
            @click="cancelRequest"
          >
            Cancel
            <q-spinner-facebook color="primary" size="1em" class="q-ml-md" />
            <q-tooltip content-class="bg-blue-5">
              Cancel operation. This will not cancel any requests already being
              processed.
            </q-tooltip>
          </q-btn>
        </div>
      </q-card>
    </div>
    <MotorEdit v-model="motorDialog"></MotorEdit>
  </q-card>
</template>

<script>
import Vue from "vue";
import { sync } from "vuex-pathify";

import SMSUtil from "../mixins/SMSUtil";

export default {
  name: "MotorCard",
  data() {
    return {
      btnAction: "off",
      motorDialog: false,
      undoStatus: false,
      responseStatus: "",
      smsOptions: {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          // intent: "INTENT" // send SMS with the native android SMS messaging
          intent: "" // send SMS without opening any other app
        }
      }
    };
  },
  computed: {
    ...sync("motor", ["activeMotor"]),
    ...sync("setting", ["settings"]),

    responseTimeout() {
      if (
        this.settings["msgResponseTimeout"] &&
        this.motor["msgAwaitResponse"] == "true"
      )
        return this.settings["msgResponseTimeout"] * 1000;
      // this is the only 'setting' that stands brave and alone
      else return -1;
    },

    motorStatus: {
      get: function() {
        return this.motor &&
          this.motor["status"] &&
          this.motor["status"] == "on"
          ? "on"
          : "off";
      },
      set: function(val) {
        this.activeMotor = this.motor;
        this.motor["status"] = val;

        if (!this.undoStatus) {
          this.$set(this.motor, "isChecking", true);

          if (val == "on") {
            console.log("Switching device on -", this.msgOn);
            this.sendSMS({
              phone: this.activeMotor["phone"],
              msg: this.msgOn,
              opt: this.smsOptions
            });
          } else {
            console.log("Switching off device - ", this.msgOff);
            this.sendSMS({
              phone: this.activeMotor["phone"],
              msg: this.msgOff,
              opt: this.smsOptions
            });
          }
        }
      }
    },

    // responseStatus: {
    //   get: function() {
    //     return this.motor["response_status"];
    //   },
    //   set: function(val) {
    //     console.log("response being changed", val);

    //     this.$set(this.motor, "response_status", val);
    //   }
    // },
    responseMsg: {
      get: function() {
        return this.motor["response_status_msg"];
      },
      set: function(val) {
        this.$set(this.motor, "response_status_msg", val);
      }
    },
    controlColor: function() {
      let color = "grey-5";

      if (!this.motor["isChecking"]) {
        if (this.motor["status"] && this.motor["status"] == "on")
          color = "orange-5";
        else color = "green-5";
      }

      return color;
    },

    msgOn() {
      let msg = this.motor["msg_req_on"];
      // replace double bracketed strings with values
      if (msg.includes("{{")) {
        msg = msg.replace(/{{(\w+)}}/g, (m, m1) => {
          return this.motor[m1] || m;
        });
      }

      return msg;
    },

    msgOff() {
      let msg = this.motor["msg_req_off"];
      // replace double bracketed strings with values
      if (msg.includes("{{")) {
        msg = msg.replace(/{{(\w+)}}/g, (m, m1) => {
          return this.motor[m1] || m;
        });
      }

      return msg;
    },

    msgStatus() {
      let msg = this.motor["msg_req_status"];
      // replace double bracketed strings with values
      if (msg.includes("{{")) {
        msg = msg.replace(/{{(\w+)}}/g, (m, m1) => {
          return this.motor[m1] || m;
        });
      }

      return msg;
    },

    msgOk() {
      let msg = this.motor["msg_resp_ok"];
      return msg;
    }
  },
  props: {
    motor: {}
  },
  components: {
    MotorEdit: () => import("./MotorEdit")
  },
  mixins: [SMSUtil],
  methods: {
    editRecord(motor) {
      this.activeMotor = motor;
      this.motorDialog = true;
    },
    showHistory(motor) {
      this.$q.notify({
        type: "info",
        message: `Yet to be implemented!`
      });
    },
    refreshStatus(motor) {
      this.activeMotor = motor;
      console.log("Fetching device status -", this.msgStatus);
      this.sendSMS({
        phone: this.activeMotor["phone"],
        msg: this.msgStatus,
        opt: this.smsOptions
      });
    },
    cancelRequest() {
      this.undoStatus = true;
      this.$set(this.motor, "status", !this.motor["status"]);
      this.undoStatus = false; //backup
      this.$set(this.motor, "isChecking", false);
    }
  },
  watch: {
    responseStatus(val) {
      console.log("val changing: ", val);
      // we have computed and watch for responseStatus.
      // this is stupidity.
      // Decide how responseStatus should be stored and change logic
      if (val == "ok") {
        this.$set(this.motor, "isChecking", false);
        this.$q.notify({
          type: "positive",
          message: `Request processed for device '${this.motor["name"]}'`
        });
      } else if (val == "error") {
        this.$set(this.motor, "isChecking", false);

        this.undoStatus = true;
        this.$set(this.motor, "status", !this.motor["status"]);
        this.undoStatus = false; // backup
        this.$q.dialog({
          title: "Device error",
          message: `Device '${this.motor["name"]}' did not process the request. ${this.responseMsg} Try later or seek support. `
        });
      }
    },

    doReqSMSPermission: function(val) {
      if (val) {
        this.$q
          .dialog({
            title: "Provide SMS Permissions",
            message:
              "Provide permissions to the app to send SMS. This is required to communicate with the remote device."
          })
          .onOk(() => {
            this.requestSMSPermission();
          })
          .onCancel(() => {
            console.log("Cancelled permission request");
          });
      }
    }
  }
};
</script>
