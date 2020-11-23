// import axios from 'axios';
import { Cookies } from 'quasar';
import { Notify } from 'quasar';

// const baseUrl = 'http://127.0.0.1:8000/api/';
export function register({
  commit
}, userData) {
  this.axios
    .post('auth/register', userData)
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
export function login({ commit }, userData) {
  this.axios
    .post('auth-user/login', userData)
    .then((res) => {
      console.log(res)
      if (res.data.errors || res.data.error) {
        Notify.create({
          type: 'negative',
          message: 'Email or Password incorrect'
        })
      }
      console.log(res);
      let expiringTime = res.data.expires_in + new Date().getTime()
      Cookies.set('jwt_token', res.data.access_token);
      Cookies.set('token_expireAt', expiringTime);
      if (res.data) {
        commit('authenticateUser', {
          isLogin: true,
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone,
          role: res.data.role,
          gender: res.data.gender
        });
      }
      this.$router.push({
        path: '/home'
      });
      // if (res.data.user_role == 3) {
      //   commit('checkIfAdmin', {
      //     role: res.data.user_role
      //   });
      //   this.$router.push({
      //     path: '/home'
      //   });
      // }
      // if (res.data.user_role == 2) {
      //   commit('checkIfAdmin', {
      //     role: res.data.user_role
      //   });
      //   this.$router.push({
      //     path: '/home'
      //   });
      // }
      // if (res.data.user_role == 1) {
      //   commit('checkIfAdmin', {
      //     role: res.data.user_role
      //   });
      //   this.$router.push({
      //     path: '/admin'
      //   });
      // }

      //Still have some logic to process here using the cookies

    })
    .catch((error) => {
      console.log(error);
      Notify.create({
        type: 'negative',
        message: 'Something Went Wrong'
      })
    });
}


export function logout({commit}, userData) {
  this.axios
     .post("auth/logout", {userData}, {
       headers: {
         Accept: "application/json",
         Authorization: "bearer" + Cookies.get("jwt_token")
       }
     })
     .then(res => {
       console.log(res)
       if (res.status == 200) {
        commit('logout');
         Cookies.remove('jwt_token')
         Cookies.remove('token_expireAt')
         this.$router.push('/login');
       } else {
         this.$q.notify({
           message: "opps something went wrong",
           position: "top",
           type: "negative"
         });
       }
     })
     .catch(err => {
       console.log(err);
     });

}

export function fetchExpenses({
  commit
}, userData) {
  this.axios
    .get(baseUrl + 'expenses/all', {
      headers: {
        Accept: 'application/json',
        Authorization: 'bearer' + Cookies.get('jwt_token'),
      }
    })
    .then(res => {
      //console.log(res)
      if (res.data) {
        commit('allExpenses', {
          expenses: res.data
        });
      }
    })
    .catch(err => {
      console.log(err.status)
    });
}

export function fetchExpenseCategory({
  commit
}) {
  this.axios
    .get(baseUrl + "expense-category/all", {
      headers: {
        Accept: 'application/json',
        Authorization: 'bearer' + Cookies.get('jwt_token'),
      }
    })
    .then(res => {
      if (res.data.status == 401) {
        commit('checkError', {
          type: "expenseCategory",
        });
      } else {
        commit('allExpensesCategory', {
          expense_category: res.data
        });
        //console.log(res.data)
      }

    })
    .catch(err => {
      console.log(err)
    });
}
