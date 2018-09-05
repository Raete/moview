// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import VueAnalytics from 'vue-analytics'
import _ from 'lodash'
import { store } from './store/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import firebase from 'firebase/app'

    Vue.use(_);
    Vue.use(Vuetify, {
        theme: {
        primary: '#111A21',
        secondary: '#ffbd08',
        back: '#9b9b9b',
        backLight: '#dbdcde',
        background: '#F0F0F0',

        },
    }),

    Vue.use(VueAnalytics, {
        id: 'UA-122724615-1',
        router
      })
   
    Vue.config.productionTip = false

let app = null;

// wait for firebase auth to init before creating the app
firebase.auth().onAuthStateChanged(() => {

  // init app if not already created
  if(!app){
    app = new Vue({
        store: store,
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }

})
