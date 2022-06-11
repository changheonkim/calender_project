import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

import calendar_data from '@/store/calendar.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    calendar_data: calendar_data,
  },
  plugins: [createPersistedState({
    paths: ["calendar_data"],
})]
})

export default store