import Vue from "vue";
import axios from "axios";
import { Cookies } from "quasar";
import * as store from "../store/users";

export default ({ store, urlPath }) => {
  const instance = axios.create({
    baseURL: process.env.BASEURL
    // withCredentials: true
  });


  instance.interceptors.request.use(
    config => {
      let AUTH_TOKEN = Cookies.get("jwt_token");
      if (AUTH_TOKEN) {
        config.headers.Authorization = "Bearer " + AUTH_TOKEN;
        config.headers.post["Content-Type"] = "application/json";
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

    function logoutAlert() {
      alert('Session expired loggin out in 1sec');
    }

    setTimeout(logoutAlert, 7000000);

    function logout() {
      console.log('logout triggered')
      store.dispatch('logout', store.getters.getAuthUser);
    }

    setTimeout(logout, 8000000);

  Vue.prototype.axios = instance;
  store.axios = instance;
};


