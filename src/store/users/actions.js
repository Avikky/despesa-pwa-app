import router from 'src/router';
import axios from 'axios';
import {
  Cookies
} from 'quasar';
import {
  Notify
} from 'quasar'

export function register({
  commit
}, userData) {
  let url = 'http://127.0.0.1:8000/api/auth/register';
  axios
    .post(url, userData)
    .then((res) => {
      console.log(res);
      commit('authenticateUser', {
        username: res.data.user.name,
        email: res.data.user.email,
      });

      this.$router.push({
        path: '/login'
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
export function login({
  commit
}, userData) {
  let url = 'http://127.0.0.1:8000/api/auth/login';
  axios
    .post(url, userData, {
      headers: {
        Accept: 'application/json',
        Authorization: 'bearer'
      }
    })
    .then((res) => {
      console.log(res);
      Cookies.set('jwt_token', res.data.access_token);
      if (res.data) {
        commit('authenticateUser', {
          username: res.data.username,
          email: res.data.email
        });
      }
      if (res.data.user_role == 3) {
        commit('checkIfAdmin', {
          role: res.data.user_role
        });
        this.$router.push({
          path: '/home'
        });
      }
      if (res.data.user_role == 2) {
        commit('checkIfAdmin', {
          role: res.data.user_role
        });
        this.$router.push({
          path: '/home'
        });
      }
      if (res.data.user_role == 1) {
        commit('checkIfAdmin', {
          role: res.data.user_role
        });
        this.$router.push({
          path: '/admin'
        });
      }

      //Still have some logic to process here using the cookies

    })
    .catch((error) => {
      if (error) {
        Notify.create({
          type: 'negative',
          message: 'Email or Password incorrect'
        })
      }
      console.log(error);
    });
}

export function logout({
  commit
}, userData) {}
