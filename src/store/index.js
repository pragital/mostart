import pathify from "./pathify";
import VuexPersist from "vuex-persist";

import Vue from "vue";
import Vuex from "vuex";

import user from "./user";
import motor from "./motor";

// import example from './module-example'

Vue.use(Vuex);

const vuexLocal = new VuexPersist({
  key: "mostartLocalStore", // The key to store the state on in the storage provider.
  storage: localStorage, // or window.sessionStorage or localForage
  modules: ["user", "motor"]
});

import { make } from "vuex-pathify";

const getDefaultState = () => {
  return {
    baseURL: "/",

    loading: false,
    appKey: ""
  };
};

const state = getDefaultState();

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    namespaced: true,
    name: "global",
    state: state,
    modules: {
      // example
      user,
      motor
    },
    plugins: [pathify.plugin, vuexLocal.plugin]

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
  });

  return Store;
}
