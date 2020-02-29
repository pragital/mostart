<template>
  <q-page class="flex">
    <div class="q-pa-lg q-gutter-md">
      <div class="row full-height">
        <div class="col-12 ">
          <div class="title text-weight-bold text-subtitle text-grey mt-3 mb-5">
            Welcome to Mostart, {{ userName }}
          </div>
          <div class="title text-weight-bold text-h5 mt-3 mb-5">
            Start or stop motor.
          </div>
        </div>

        <div class="col-12" v-if="!motors || motors.length == 0">
          <q-btn
            color="primary"
            size="lg"
            label="Add Motor"
            @click="createRecord"
            icon="add"
          >
            <template v-slot:loading> <q-spinner-radio /> </template>
          </q-btn>
        </div>

        <div
          class="col col-12 text-right q-mt-md q-pr-md"
          v-if="motors && motors.length > 0"
        >
          <q-btn
            color="primary"
            size="md"
            @click="createRecord"
            icon="add"
            class="q-mb-md"
            label="Add Motor"
          >
            <template v-slot:loading> <q-spinner-radio /> </template>
          </q-btn>
        </div>

        <div class="col-12 q-gutter-md">
          <div v-for="(item, x) in motors" :key="x">
            <MotorCard :motor="item" />
          </div>
        </div>

        <div class="col-12 overline text-weight-bold block text-grey-5 mt-3">
          <p class="infoText">
            Turn your motor off or on by pushing these buttons. Add a motor by
            clicking on the 'Add Motor' button if you are not seeing anything
            here.
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
    ...get("user", ["userName"]),
    ...sync("motor", ["motors", "activeMotor"])
  },
  components: {
    MotorCard: () => import("../components/MotorCard"),
    MotorEdit: () => import("../components/MotorEdit")
  },
  methods: {
    createRecord() {
      this.activeMotor = {
        name: "",
        phone: "",
        location: "",
        serial_num: "",
        status: "off",
        isChecking: false,
        new: "y"
      };
      this.motorDialog = true;
    }
  }
};
</script>
