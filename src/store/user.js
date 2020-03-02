import store from ".";
import { make } from "vuex-pathify";

import router from "../router";

const getDefaultState = () => {
  return {
    isSetup: false
  };
};

const state = getDefaultState();

export default {
  namespaced: true,
  name: "user",

  state: state,

  actions: {
    createUser({ commit, state }) {}
  },

  mutations: {
    ...make.mutations(state),
    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  }
};
