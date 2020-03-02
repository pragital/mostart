<template>
  <q-page class="flex">
    <div class="q-pa-lg q-gutter-md">
      <div class="row full-height">
        <div class="col-12">
          <div
            class="title text-weight-bold text-subtitle text-grey mt-3 mb-5"
          >Welcome, {{ userName }}</div>
          <div class="title text-weight-bold text-h5 mt-3 mb-5">Device Remote Control</div>
        </div>

        <div class="col-12" v-if="!motors || motors.length == 0">
          <q-btn color="primary" size="lg" label="Add Device" @click="createRecord" icon="add">
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
          </q-btn>
        </div>

        <div class="col col-12 text-right q-mt-md q-pr-md" v-if="motors && motors.length > 0">
          <q-btn
            color="primary"
            size="md"
            @click="createRecord"
            icon="add"
            class="q-mb-md"
            label="Add Device"
          >
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
          </q-btn>
        </div>

        <div class="col-12 q-gutter-md">
          <div v-for="(item, x) in motors" :key="x">
            <MotorCard :motor="item" />
          </div>
        </div>

        <div class="col-12 overline text-weight-bold block text-grey-5 mt-3">
          <p class="infoText">
            Control your device by pushing on/off buttons. Add a device by
            clicking on the 'Add Device' button.
          </p>
        </div>
      </div>
    </div>
    <MotorEdit v-if="motorDialog" v-model="motorDialog"></MotorEdit>
  </q-page>
</template>

<script>
import { sync, get } from "vuex-pathify";

export default {
  name: "PageIndex",
  data() {
    return {
      btnAction: "off",
      motorDialog: false
    };
  },
  computed: {
    ...sync("setting", ["settings"]),
    ...sync("motor", ["motors", "activeMotor", "defaultDevice"]),
    userName() {
      return this.settings["name"] ? this.settings["name"] : "User";
    }
  },
  components: {
    MotorCard: () => import("../components/MotorCard"),
    MotorEdit: () => import("../components/MotorEdit")
  },
  methods: {
    createRecord() {
      this.activeMotor = { ...this.defaultDevice };
      this.$set(this.activeMotor, "new", "y");
      this.$set(this.activeMotor, "msg_req_on", this.settings["msg_req_on"]);
      this.$set(this.activeMotor, "msg_req_off", this.settings["msg_req_off"]);

      this.$set(
        this.activeMotor,
        "msg_req_status",
        this.settings["msg_req_status"]
      );
      this.$set(this.activeMotor, "msg_resp_ok", this.settings["msg_resp_ok"]);
      this.motorDialog = true;
    }
  }
};
</script>
