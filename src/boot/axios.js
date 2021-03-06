import Vue from "vue";
import axios from "axios";
import { Cookies } from "quasar";
import * as store from "../store/users";
import { Notify } from 'quasar';

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
        config.headers.common['Access-Control-Allow-Origin'] = '*';
        config.headers.common['Access-Control-Allow-Credentials'] = true;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  Vue.prototype.axios = instance;
  store.axios = instance;
};


