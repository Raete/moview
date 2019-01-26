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
        primary: '#263238',
        secondary: '#FFAB00',
        back_1: '#FFFFFF',
        back_2: '#F5F5F5',
        back_3: '#E0E0E0',
        back_4: '#BDBDBD',
    
        back: '#9b9b9b',
        backLight: '#dbdcde',
        background: '#F0F0F0',
        background_2: '#e6e6e6',
        background_3: '#cccccc'
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
