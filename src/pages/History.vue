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
            label="Save Settings"
          >
            <template v-slot:loading>
              <q-spinner-radio />
            </template>
          </q-btn>
        </div>

        <div class="col-12 q-gutter-md">
          <q-card class="col col-12 col-sm-8">
            <q-card-section class="q-px-md" v-if="motor">
              <div class="row justify-around">
                <q-input class="col col-12" :value="motor['name']" label="Name" readonly />
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
          </q-card>
        </div>

        <div class="col-12 overline text-weight-bold block text-grey-5 mt-3">
          <p
            class="infoText"
          >Change any if the app settings. You have to save the settings to apply changes.</p>
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
      set: {}
    };
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
