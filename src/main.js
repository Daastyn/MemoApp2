// src/main.js

import Vue from 'vue';
import App from './App.vue';
//import router from './router'; // Assicurati che il percorso sia corretto

Vue.config.productionTip = false;

new Vue({
 // router, // Assicurati di passare il router Vue all'istanza Vue principale
  render: h => h(App)
}).$mount('#app');
