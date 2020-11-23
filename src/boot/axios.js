import Vue from 'vue'
import axios from 'axios'
import { Cookies } from 'quasar';


axios.defaults.baseURL = process.env.BASEURL;

const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;

const AUTH_TOKEN = cookies.get("jwt_token");


axios.interceptors.request.use( config => {
   if (AUTH_TOKEN) {
    config.headers.common["Authorization"] = "Bearer " + AUTH_TOKEN;
    config.headers.post["Content-Type"] = "application/json";
  } else {
    axios.defaults.headers.common["Authorization"] = null;
  }
  return config;
}, (error) =>{
   return Promise.reject(error);
});

Vue.prototype.$axios = axios