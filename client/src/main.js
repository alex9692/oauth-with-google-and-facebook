import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "../node_modules/papercss/dist/paper.css";
import "../node_modules/papercss/dist/paper.min.css";
import "../node_modules/animate.css/animate.css";
import "../node_modules/animate.css/animate.min.css";
import Vuelidate from "vuelidate";
import FBSignInButton from "vue-facebook-signin-button";
import GSignInButton from "vue-google-signin-button";

Vue.use(GSignInButton);
Vue.use(FBSignInButton);
Vue.use(Vuelidate);
require("./helpers/initGoogle");
require("./helpers/initFb");
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
