<template>
  <q-page class="flex">
    <div class="q-pa-lg q-gutter-md">
      <div class="row full-height">
        <div class="col-12">
          <div class="title text-weight-bold text-subtitle text-grey mt-3 mb-5">Change app settings.</div>
          <div class="title text-weight-bold text-h5 mt-3 mb-5">Settings</div>
        </div>

        <div class="col col-12 text-right q-mt-md q-pr-md">
          <q-btn
            color="primary"
            size="md"
            @click="saveRecord"
            icon="save"
            class="q-mb-md"
            label="Save"
          >
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
          </q-btn>
        </div>

        <div class="col-12 q-gutter-md">
          <q-form ref="editSettingsForm" class="q-ma-md">
            <div class="row q-gutter-md">
              <q-card flat bordered class="col col-12">
                <q-toolbar class="text-subtitle2 bg-grey-3">General</q-toolbar>
                <q-card-section class="q-px-md">
                  <q-input
                    class="col col-12"
                    v-model="settingInstance['name']"
                    label="Name"
                    placeholder="Enter your name"
                  />
                </q-card-section>
              </q-card>
              <q-card flat bordered class="col col-12">
                <q-toolbar class="text-subtitle2 bg-grey-3">Messages</q-toolbar>
                <q-card-section class="q-px-md">
                  <div class="row justify-around q-gutter-md">
                    <q-checkbox
                      class="col col-5"
                      v-model="awaitResponse"
                      label="Await Response"
                      placeholder="Wait for response SMS until timeout?"
                    />
                    <q-input
                      class="col col-5"
                      v-model="settingInstance['msgResponseTimeout']"
                      label="Timeout (seconds)"
                      :disable="!awaitResponse"
                    />

                    <q-input
                      class="col col-12"
                      v-model="settingInstance['msg_req_on']"
                      label="On Message Format"
                      :hint="hintMsgFormat"
                    />

                    <q-input
                      class="col col-12"
                      v-model="settingInstance['msg_req_off']"
                      label="Off Message Format"
                    />
                    <q-input
                      class="col col-12"
                      v-model="settingInstance['msg_req_status']"
                      label="Status Message Format"
                    />
                    <q-input
                      class="col col-12"
                      v-model="settingInstance['msg_resp_ok']"
                      label="Success Response Includes"
                      :disable="!awaitResponse"
                      hint="Consider operation successful if response SMS includes this phrase."
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-form>
        </div>

        <div class="col-12 overline text-weight-bold block text-grey-5 mt-3">
          <p class="infoText">&nbsp;Change app settings here. Save the settings to apply changes.</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { sync, get } from "vuex-pathify";

export default {
  name: "Settings",
  data() {
    return {
      hintMsgFormat: "Phrase with optional fields. E.g. - turnon {{name}}",

      settingInstance: {}
    };
  },
  computed: {
    ...get("user", ["userName"]),
    ...sync("setting", ["settings"]),
    awaitResponse: {
      get() {
        return this.settingInstance["msgAwaitResponse"] == "true";
      },
      set: function(val) {
        // this is string since we want to store settings values to pref at some point
        // and pref will only support strings
        this.$set(
          this.settingInstance,
          "msgAwaitResponse",
          val ? "true" : "false"
        );
      }
    },
    responseTimeout() {
      return this.settings["msgResponseTimeout"];
    }
  },
  components: {},
  methods: {
    saveRecord() {
      console.log(
        "this.$refs.editSettingsForm.validate()",
        this.$refs.editSettingsForm.validate()
      );
      if (this.$refs.editSettingsForm.validate()) {
        if (!this.settingInstance["msgReqOn"])
          this.settings["msgReqOn"] = "motoron {{serial_number}}";
        if (!this.settingInstance["msgReqOff"])
          this.settings["msgReqOff"] = "motoroff {{serial_number}}";
        if (!this.settingInstance["msg_resp_ok"])
          this.settings["msg_resp_ok"] = "ok";

        this.settings = { ...this.settingInstance };

        this.$q.notify({
          type: "success",
          message: `Settings saved!`
        });
        this.closeDialog();
      }
      this.$q.notify({
        type: "info",
        message: `I am here!`
      });
    },

    closeDialog() {
      this.showDialog = false;
    }
  },
  mounted() {
    this.settingInstance = { ...this.settings };
  },

  watch: {}
};
</script>
