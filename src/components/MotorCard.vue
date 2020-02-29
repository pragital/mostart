<template>
  <q-card class="q-mb-lg">
    <div class="row">
      <q-card class="col col-12 col-sm-8">
        <q-card-section class="q-px-md" v-if="motor">
          <div class="row  justify-around">
            <q-input
              class="col col-12 "
              :value="motor['name']"
              label="Name"
              readonly
            />
            <q-input
              class="col col-12 col-md-6"
              :value="motor['phone']"
              label="Motor Phone"
              readonly
            />

            <q-input
              class="col col-12 col-md-6"
              :value="motor['location']"
              label="Location"
              readonly
            />
          </div>
        </q-card-section>
        <q-card-actions class="justify-around q-px-md q-mt-lg bg-grey-2">
          <q-btn
            flat
            round
            color="grey-6"
            icon="edit"
            @click="editRecord(motor)"
          >
            <template v-slot:loading> <q-spinner-radio /> </template>
            <q-tooltip content-class="bg-blue-5">
              Edit motor details incl. phone number, name or serial number.
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="grey-6"
            icon="view_headline"
            @click="showHistory(motor)"
          >
            <template v-slot:loading> <q-spinner-radio /> </template>
            <q-tooltip content-class="bg-blue-5">
              Check history for the motor.
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            color="grey-6"
            icon="refresh"
            @click="refreshStatus(motor)"
          >
            <template v-slot:loading> <q-spinner-radio /> </template>
            <q-tooltip content-class="bg-blue-5">
              Refresh status by sending another SMS to motor.
            </q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
      <div class="col flex col-12 col-sm-4 bg-grey-2">
        <q-btn-toggle
          v-model="motorStatus"
          push
          rounded
          :toggle-color="controlColor"
          stretch
          stack
          spread
          size="lg"
          class="full-width "
          :options="[
            { value: 'off', slot: 'off' },
            { value: 'on', slot: 'on' }
          ]"
          :readonly="motor['isChecking']"
        >
          <template v-slot:off>
            <q-icon name="stop" />
            OFF
          </template>

          <template v-slot:on>
            <q-icon name="highlight" />
            <div class="row items-center no-wrap">
              <div class="text-center">ON</div>
            </div>
            <q-tooltip content-class="bg-blue-5">
              Turn motor on.
            </q-tooltip>
          </template>
        </q-btn-toggle>
        <q-btn
          class="full-width"
          v-if="motor['isChecking']"
          @click="cancelRequest"
        >
          Cancel
        </q-btn>
      </div>
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

    onMsg() {
      return `on ${this.motor["serial_num"]}`;
    },
    offMsg() {
      return `off ${this.motor["serial_num"]}`;
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
        this.motor["status"] = val;
      }
    },
    controlColor: function() {
      let color = "grey-5";
      console.log('this.motor["isChecking"]', this.motor["isChecking"]);
      console.log('this.motor["isChecking"]', this.motor["status"]);
      if (!this.motor["isChecking"]) {
        if (this.motor["status"] && this.motor["status"] == "on")
          color = "orange-5";
        else color = "green-5";
      }

      return color;
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
      this.$q.notify({
        type: "info",
        message: `Yet to be implemented!`
      });
    },
    cancelRequest() {
      this.undoStatus = true;
      this.$set(this.motor, "status", !this.motor["status"]);
      this.$set(this.motor, "isChecking", false);
    }
  },
  watch: {
    motorStatus: function(val) {
      console.log("status", this.motor["isChecking"]);
      if (!this.undoStatus) {
        this.$set(this.motor, "isChecking", true);
        if (val == "on") {
          console.log("Switching on motor -", this.onMsg);
          this.sendSMS({
            phone: this.activeMotor["phone"],
            msg: this.onMsg,
            opt: this.smsOptions
          });
        } else {
          console.log("Switching off motor - ", this.offMsg);
          this.sendSMS({
            phone: this.activeMotor["phone"],
            msg: this.offMsg,
            opt: this.smsOptions
          });
        }
      } else this.undoStatus = false;
    },

    doReqSMSPermission: function(val) {
      if (val) {
        this.$q
          .dialog({
            title: "Provide SMS Permissions",
            message:
              "Provide permissions to the app to send SMS. This is required to communicate with the motor."
          })
          .onOk(() => {
            this.requestSMSPermission();
          })
          .onCancel(() => {
            console.log("Cancelled permission request");
          });
      }
    },

    responseStatus: function(val) {
      // this is a wrong way of binding mixin behaviour
      if (this.responseStatus == "ok") {
        this.$set(this.motor, "isChecking", false);
        this.$q.notify({
          type: "positive",
          message: `Request processed for motor '${this.motor["name"]}'`
        });
      } else if (this.responseStatus == "error") {
        this.$set(this.motor, "isChecking", false);

        this.undoStatus = true;
        this.$set(this.motor, "status", !this.motor["status"]);

        this.$q.dialog({
          title: "Motor error",
          message: `Motor '${this.motor["name"]}' did not process the request. Try later or get support. Technical Msg: ${this.responseMsg}`
        });
      }
    }
  }
};
</script>
