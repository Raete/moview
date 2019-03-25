import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify'
import firebase from 'firebase/app'

Vue.config.productionTip = false;

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

firebase.auth().onAuthStateChanged(() => {
   
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

})

