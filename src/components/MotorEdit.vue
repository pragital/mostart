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
        <q-toolbar-title class="text-body1 text-weight-bold"
          ><span
            v-text="activeMotor && activeMotor['new'] ? 'New' : 'Edit'"
          ></span>
          Motor</q-toolbar-title
        >
      </q-toolbar>
      <q-separator />

      <q-form ref="editMotorForm" class="q-ma-md">
        <q-card-section v-if="activeMotor">
          <div class="row q-gutter-xs">
            <q-input
              v-model="activeMotor['name']"
              label="Name"
              placeholder="Enter any unique name for your reference"
              class="col col-12"
            />
            <q-input
              v-model="activeMotor['phone']"
              label="Phone"
              placeholder="Enter phone number for motor"
              class="col col-12 "
            />

            <q-input
              v-model="activeMotor['location']"
              label="Location"
              placeholder="Enter location where motor is installed"
              class="col col-12 "
            />
            <q-input
              v-model="activeMotor['serial_num']"
              label="Serial No."
              placeholder="Enter serial number of motor"
              class="col col-12 "
            />
          </div>
        </q-card-section>
      </q-form>
      <q-card-actions class="q-mb-md">
        <div class="col col-12 flex justify-around q-gutter-sm">
          <q-btn icon="delete" flat label="Delete" @click="deleteRecord" />
          <q-btn color="primary" icon="save" label="Save" @click="saveRecord" />
          <!-- <q-btn label="Close" flat icon="close" @click="closeDialog" /> -->
        </div>
      </q-card-actions>
    </q-card>
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
      localMotor: {}
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
    }
  },
  methods: {
    ...mapMutations("motor", ["addMotor", "removeMotor"]),
    saveRecord() {
      if (this.$refs.editMotorForm.validate()) {
        this.activeMotor["new"] = "n";
        if (this.activeMotor["new"]) this.addMotor(this.activeMotor);
      }
      this.closeDialog();
    },

    closeDialog() {
      this.showDialog = false;
    },

    deleteRecord() {
      if (
        confirm(
          "Are you sure you want to delete this record? This cannot be undone."
        )
      ) {
        this.removeMotor(this.activeMotor);
        this.closeDialog();
      }
    }
  },
  mounted() {
    // this.localMotor = this.activeMotor;
    // console.log("active", this.activeMotor);
  }
};
</script>
