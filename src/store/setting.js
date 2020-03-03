import store from ".";
import { make } from "vuex-pathify";

import router from "../router";

const getDefaultState = () => {
  return {
    settings: {
      name: "Awesome User",
      msg_await_response: "true", // decorative, improves UX perhaps? We collect but don't use
      msg_response_timeout: "60",
      msg_req_on: "motoron {{serial_number}}",
      msg_req_off: "motoroff {{serial_number}}",
      msg_req_status: "s {{serial_number}}",
      msg_resp_ok: "ok",
      msg_resp_err: "error" // not used
    }
  };
};

const state = getDefaultState();

export default {
  namespaced: true,
  name: "setting",

  state: state,

  actions: {
    createSetting({ commit, state }) {
      // this is the future!
    }
  },

  mutations: {
    ...make.mutations(state),
    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  }
};
