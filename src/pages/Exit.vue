<template>
  <q-page class="flex"></q-page>
</template>

<script>
import { sync, get } from "vuex-pathify";

export default {
  name: "Exit",
  data() {
    return {
      set: {}
    };
  },

  mounted() {
    console.log(navigator);
    if (navigator.app) navigator.app.exitApp();
    else if (navigator.device) navigator.device.exitApp();
    else {
      this.$q.dialog({
        title: "Unrecognized device",
        message: "Just close the window to exit."
      });
    }
  }
};
</script>
