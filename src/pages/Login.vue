<template>
  <div id="login" class="row q-col-gutter-lg">
    <div class="banner-img col-xs-12 col-md-6">
      <div class="col-md col-12 mobile-hide	gt-sm q-mt-lg">
        <q-img src="~assets/login-img.svg" alt="" />
      </div>
    </div>
    <div class="login-form col-xs-12 col-md-6">
      <div class="logoAlt q-pa-md">
        <q-btn
          round
          size="25px"
          color="blue-12"
          icon="fas fa-chart-line"
          glossy
          to="/"
        />
        <h3 class="text-center text-weight-bold">Expensa</h3>
      </div>
      <p class="welcome-text" v-if="user.length > 0">
        Hi <span class="text-blue-12">{{ user }}</span
        >, kindly Login to your Dashboard
      </p>
      <p class="welcome-text" v-else>Welcome Back, Login to your Dashboard</p>
      <q-form @submit.prevent="login" class="q-mx-xl">
        <q-card>
          <q-card-section>
            <!-- email address goes here
              -->
            <q-input
              filled
              v-model.trim="loginDetails.email"
              type="email"
              autocomplete="on"
              label="Email Address"
              class="q-mb-md"
              lazy-rules
              :rules="[
                val => this.validEmail.test(val) || 'Please enter a valid email'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-envelope" />
              </template>
            </q-input>
            <!-- password goes here -->
            <q-input
              autocomplete
              v-model.trim="loginDetails.password"
              label="Password"
              class="q-mb-md"
              filled
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter password'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
        <div class="q-mt-md">
          <q-checkbox
            class="text-weight-light q-mb-sm text-grey-7"
            v-model="rememberMe"
            label="Remember me"
            @click="rememberMe = !rememberMe"
          ></q-checkbox>
        </div>
        <div class="loginBtn q-gutter-lg-x-lg">
          <q-btn
            glossy
            class="q-ma-md btn-blue"
            color="blue-14"
            type="submit"
            label="Login Now"
          >
            <template v-slot:loading>
              <q-spinner />
            </template>
          </q-btn>
          <span class="forgotPass text-grey-8" to="/password-recovery"
            ><router-link class="link" to="/password-recovery"
              >Forgot Password?</router-link
            ></span
          >
        </div>
        <div class="q-mt-md">
          <router-link to="/register" class="reglink link"
            >Don't have an account? Click here to sign up.</router-link
          >
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import store from "../store";
export default {
  data() {
    return {
      //submitting: this.$store.state.loadingBtn,
      rememberMe: false,
      user: "",
      loginDetails: {
        email: "user@user.com",
        password: "Admin@101"
        // rememberMe: false
      },

      isPwd: true,
      validEmail: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
  },
  methods: {
    login() {
      let formData = this.loginDetails;
      this.$store.dispatch("login", formData);
    },
    checkIfComingFromRegistra() {
      //console.log(this.$store.getters.newUser);
      if (
        this.$store.getters.newUser.username &&
        this.$store.getters.newUser.email
      ) {
        this.loginDetails.email = this.$store.getters.newUser.email;
        this.user = this.$store.getters.newUser.username;
      }
    }
  },
  created() {
    this.checkIfComingFromRegistra();
  }
};
</script>

<style scoped>
.logoAlt {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .login-form {
  margin-top: 1.3rem;
} */
.loginBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.link {
  text-decoration: none;
  text-align: center;
}
.reglink {
  font-size: 19px;
  color: blue;
  text-align: center;
}
.banner-img {
  padding-top: 6rem;
}
.welcome-text {
  font-size: 19px;
  font-weight: 400;
  text-align: center;
  padding-bottom: 1rem;
}
</style>
