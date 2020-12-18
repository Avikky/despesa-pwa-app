// import axios from 'axios';
import { Cookies } from 'quasar';
import { Notify } from 'quasar';

export function refreshToken() {

  this.axios
    .post('auth/refresh')
    .then(res => {
      console.log(res);
      console.log('Token Refreshed');
       Cookies.set('jwt_token', res.data.access_token);
      Cookies.set('token_expireAt', res.data.expires_in);
    })
    .catch((error) => {
      console.log(error);
    });
}

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
    })
    .catch((error) => {
      console.log(error);
    });
}
export function login({ commit }, userData) {
  return new Promise((resolve, reject) => {
    this.axios
      .post('auth/login', userData)
      .then((res) => {
        console.log(res)

        Cookies.set('jwt_token', res.data.access_token);
        Cookies.set('token_expireAt', res.data.expires_in);
        if (res.data) {
          // console.log(res.data.user_role);
          // console.log(res.data.email);
          // console.log(res.data.username);
          Cookies.set('name', res.data.username);
          Cookies.set('email', res.data.email);
          Cookies.set('role', res.data.user_role);

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


      // Let the calling function know that http is done. You may send some data back
        resolve(res);
      })
      .catch((error) => {
         console.log(error);
        // http failed, let the calling function know that action did not work out
        reject(error);
      });
  });
}


export function logout({commit}, userData) {
  this.axios
     .post("auth/logout", {userData})
     .then(res => {
       console.log(res)
       if (res.status == 200) {
        commit('logout');
         Cookies.remove('jwt_token')
         Cookies.remove('token_expireAt')
          Cookies.remove('name', res.data.username);
          Cookies.remove('email', res.data.email);
          Cookies.remove('role', res.data.role);
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
