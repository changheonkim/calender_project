import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  moment,
  VueMomentJS,
  render: h => h(App)
}).$mount('#app')
