import store from ".";
import { make } from "vuex-pathify";

import router from "../router";

const getDefaultState = () => {
  return {
    isChecking: false,
    motors: [],
    activeMotor: {},

    defaultDevice: {
      name: "",
      phone: "",
      location: "",
      serial_number: "",
      status: "off",
      isChecking: false,
      new: "y",
      response_status: "",
      response_status_msg: ""
    }
  };
};

const state = getDefaultState();

export default {
  namespaced: true,
  name: "user",

  state: state,

  actions: {
    createUser({ commit, state }) {
      // this is the future!
    }
  },

  mutations: {
    ...make.mutations(state),
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    addMotor(state, motor) {
      state.motors.push(motor);
    },
    removeMotor(state, motor) {
      state.motors.splice(state.motors.indexOf(motor), 1);
    }
  }
};
