// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFirestore from 'vue-firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as VueGoogleMaps from 'vue2-google-maps';
import moment from 'moment';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueFirestore);

const firebaseApp = firebase.initializeApp({
  piKey: 'AIzaSyB_TsPdfnmO-sn84uancIRs1YpeBhkogj8',
  authDomain: 'cryptid-map.firebaseapp.com',
  databaseURL: 'https://cryptid-map.firebaseio.com',
  projectId: 'cryptid-map',
  storageBucket: 'cryptid-map.appspot.com',
  messagingSenderId: '191393106325',
});

// eslint-disable-next-line
export const db = firebaseApp.firestore();

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm');
  }

  return '';
});

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDChG3rMZdUbIbT1npuTAH72C7CLPPifjU',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
