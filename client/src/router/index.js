/* es-lint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/isAuth"] === true) {
        next("/");
      } else {
        next();
      }
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "@/views/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/isAuth"] === true) {
        next("/");
      } else {
        next();
      }
    },
    component: () => import("@/views/Register.vue")
  },
  {
    path: "/forgot",
    name: "ForgotPassword",
    component: () => import("@/views/ForgotPassword.vue")
  },
  {
    path: "/reset/:token",
    name: "ResetPassword",
    component: () => import("@/views/ResetPassword.vue")
  },
  {
    path: "/verifyaccount/:token",
    name: "VerifyAccount",
    component: () => import("@/views/VerifyAccount.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
