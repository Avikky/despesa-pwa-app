import Vue from 'vue'
import axios from 'axios'
import { Cookies } from 'quasar';

Vue.prototype.$axios = axios


axios.defaults.baseURL = process.env.BASEURL;

const AUTH_TOKEN = Cookies.get("jwt_token");


axios.interceptors.request.use( config => {
   if (AUTH_TOKEN) {
    config.headers.common["Authorization"] = "Bearer " + AUTH_TOKEN;
    config.headers.post["Content-Type"] = "application/json";
  } else {
    axios.defaults.headers.common["Authorization"] = null;
  }
  return config;
}, (error) =>{

});
