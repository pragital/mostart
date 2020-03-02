<template>
  <q-dialog
    v-model="showDialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="outlined pa-1">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-toolbar dense class="bg-grey-3 accent">
        <q-toolbar-title class="text-body1 text-weight-bold">
          <span
            v-text="activeMotor && activeMotor['new'] ? 'New' : 'Edit'"
          ></span>
          Device
        </q-toolbar-title>
      </q-toolbar>
      <q-separator />

      <q-form ref="editDeviceForm" class="q-ma-md">
        <q-card-section v-if="activeMotor">
          <div class="row q-gutter-xs">
            <q-input
              v-model="activeMotor['name']"
              label="Name"
              placeholder="Enter unique name for your reference"
              class="col col-12"
            />
            <q-input
              v-model="activeMotor['phone']"
              label="Phone"
              placeholder="Enter phone no. of device to send SMS"
              class="col col-12"
            />

            <q-input
              v-model="activeMotor['location']"
              label="Location"
              placeholder="Enter location where device is installed"
              class="col col-12"
            />
            <q-input
              v-model="activeMotor['serial_number']"
              label="Serial Number"
              placeholder="Enter serial number of device"
              class="col col-12"
            />
            <div class="col col-12">
              <q-btn
                class="full-width q-mt-md"
                align="center"
                dense
                flat
                bordered
                @click="expandSection = !expandSection"
              >
                <q-icon
                  :name="
                    expandSection
                      ? 'keyboard_arrow_down'
                      : 'keyboard_arrow_right'
                  "
                  class="text-grey-5"
                >
                </q-icon>
                <span class="text-grey-5">More Details</span>
                <q-icon
                  :name="
                    expandSection
                      ? 'keyboard_arrow_down'
                      : 'keyboard_arrow_left'
                  "
                  class="text-grey-5"
                >
                </q-icon>
              </q-btn>
            </div>

            <q-input
              v-model="activeMotor['msg_req_on']"
              label="Serial Number"
              class="col col-12"
              v-if="expandSection"
            />
            <q-input
              v-model="activeMotor['msg_req_off']"
              label="Off Message Format"
              class="col col-12"
              v-if="expandSection"
            />
            <q-input
              v-model="activeMotor['msg_req_status']"
              label="Status Message Format"
              class="col col-12"
              v-if="expandSection"
            />
            <q-checkbox
              class="col col-12"
              v-model="awaitResponse"
              label="Await Response"
              v-if="expandSection"
            />
            <q-input
              v-model="activeMotor['msg_resp_ok']"
              label="Success Response Includes"
              class="col col-12"
              v-if="expandSection"
            />
          </div>
        </q-card-section>
      </q-form>
      <q-card-actions class="q-mb-md">
        <div class="col col-12 flex justify-end q-gutter-xs">
          <q-btn
            dense
            icon="delete"
            flat
            label="Delete"
            @click="confirmDelete = true"
          />
          <q-btn
            dense
            label="Close"
            flat
            icon="close"
            @click="closeDialog"
            outline
          />
          <q-btn
            dense
            color="primary"
            flat
            icon="save"
            label="Save"
            @click="saveRecord"
          />
        </div>
      </q-card-actions>
    </q-card>

    <!-- DELETE DIALOG -->
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-toolbar dense class="bg-grey-3">
          <q-avatar icon="report" color="warn" />
          <span class="text-subtitle2">Confirm</span>
        </q-toolbar>

        <q-card-section class="row items-center">
          <span class="q-mt-sm"
            >Are you sure you want to delete this record? This cannot be
            undone.</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Ok"
            color="error"
            @click="deleteRecord"
            v-close-popup
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { sync } from "vuex-pathify";

export default {
  name: "MotorEdit",
  data() {
    return {
      validInput: true,
      rules: {
        required: value => !!value || "Required."
      },
      localMotor: {},
      confirmDelete: false,
      expandSection: false
    };
  },
  props: {
    value: Boolean
  },
  computed: {
    ...sync("motor", ["activeMotor"]),

    showDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    awaitResponse: {
      get() {
        return this.activeMotor["msgAwaitResponse"] == "true";
      },
      set: function(val) {
        // this is string since we want to store settings values to pref at some point
        // and pref will only support strings
        this.$set(this.activeMotor, "msgAwaitResponse", val ? "true" : "false");
      }
    }
  },
  methods: {
    ...mapMutations("motor", ["addMotor", "removeMotor"]),
    saveRecord() {
      if (this.$refs.editDeviceForm.validate()) {
        if (this.activeMotor["new"]) {
          delete this.activeMotor["new"];
          this.addMotor(this.activeMotor);
        }
        this.closeDialog();
      }
    },

    closeDialog() {
      this.showDialog = false;
    },

    deleteRecord() {
      this.removeMotor(this.activeMotor);
      this.closeDialog();
    }
  }
};
</script>
