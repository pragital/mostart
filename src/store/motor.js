import store from ".";
import { make } from "vuex-pathify";

import router from "../router";

const getDefaultState = () => {
  return {
    isChecking: false,
    motors: [],
    activeMotor: {}
  };
};

const state = getDefaultState();

export default {
  namespaced: true,
  name: "user",

  state: state,

  actions: {
    createUser({ commit, state }) {
      const createRecord = {
        username: state.activeUser["username"],
        email: state.activeUser["email"],
        mobile_phone: state.activeUser["mobile_phone"],
        start_date: state.activeUser["start_date"],
        end_date: state.activeUser["end_date"],
        account_status: state.activeUser["account_status"] || "Pending",
        role_cd: state.activeUser["role_cd"] || "User",
        account_id: state.activeUser["account_id"]
      };
    }
  },

  mutations: {
    ...make.mutations(state),
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    addMotor(state, motor) {
      state.motors.unshift(motor);
    },
    removeMotor(state, motor) {
      state.motors.splice(state.motors.indexOf(motor), 1);
    }
  }
};
