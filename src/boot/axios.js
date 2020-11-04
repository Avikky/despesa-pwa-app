import Vue from 'vue'
import axios from 'axios'
import { Cookies } from 'quasar';
import { Notify } from 'quasar';

Vue.prototype.$axios = axios


  axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

 
