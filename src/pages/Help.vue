<template>
  <q-page class="flex">
    <div class="q-pa-lg q-gutter-md">
      <div class="row full-height">
        <div class="col-12">
          <div class="title text-weight-bold text-subtitle text-grey mt-3 mb-5">
            Get help
          </div>
          <div class="title text-weight-bold text-h5 mt-3 mb-5">Help</div>
          <p class="text-subtitle1 q-mt-md">
            Control your remote devices using a friendly interface and SMS!
          </p>
        </div>

        <q-card flat bordered class="col col-12">
          <q-toolbar class="text-subtitle2 bg-grey-3" id="#about">
            About
          </q-toolbar>
          <q-card-section class="q-px-md">
            <p>
              Mostart is a rather simple app to send/receive SMS to/from your
              remote device.
            </p>
            <p>Features -</p>
            <ol>
              <li>Configurable messages to start / stop remote device.</li>
              <li>SMS messages can include pre-defined fields</li>
              <li>Check status of device using SMS</li>
              <li>
                Receive SMS messages from remote device to confirm requested
                operation
              </li>
            </ol>
            <p>
              All operations should be supported by a suitable controller
              installed on the remote device. Mostart just provides a
              user-friendly frontend :)
            </p>
            <p>
              A few features are deliberately avoided for the sake of
              simplicity, to maintain low costs, and keeping in mind the target
              audience -
            </p>
            <ul>
              <li>
                No background service for timing out operations or schedule
                operations
              </li>
              <li>No push/pull notifications</li>
            </ul>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="col col-12 q-mt-lg" id="#settings">
          <q-toolbar class="text-subtitle2 bg-grey-3" id="#about">
            Settings
          </q-toolbar>
          <q-card-section class="q-px-md"></q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { sync, get } from "vuex-pathify";

export default {
  name: "Help",
  data() {
    return {};
  },
  computed: {
    ...get("user", ["userName"]),
    ...sync("setting", ["settings"])
  },
  components: {},
  methods: {
    saveRecord() {
      if (this.$refs.editMotorForm.validate()) {
        this.addMotor(this.activeMotor);
      }
      this.closeDialog();
    },

    closeDialog() {
      this.showDialog = false;
    }
  },
  mounted() {
    this.set = this.settings;
  }
};
</script>
