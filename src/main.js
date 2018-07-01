// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _ from 'lodash'
    import Vuetify from 'vuetify'
    import 'vuetify/dist/vuetify.min.css'



    Vue.use(_);
    Vue.use(Vuetify, {
        theme: {
        primary: '#111A21',
        secondary: '#ffbd08',

        }
    }),
   



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


 
