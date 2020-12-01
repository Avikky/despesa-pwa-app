<template>
  <div id="register" class="row q-col-gutter-lg">
    <div class="banner-img col-xs-12 col-md-6">
      <div class="logoAlt q-pa-none">
        <q-btn
          round
          size="18px"
          color="blue-12"
          icon="fas fa-chart-line"
          glossy
          to="/"
        />
        <h5 class="text-center text-weight-bold">Expensa</h5>
      </div>
      <div class="col-md col-12 mobile-hide	gt-sm">
        <q-img src="~assets/register-img.svg" alt="" />
      </div>
    </div>
    <div class="login-form col-xs-12 col-md-6">
      <p
        class="text-weight-bold"
        style="font-size: 22px; text-align: center; padding-top: 1rem;"
      >
        Sign up to
        <span class="q-pl-md">
          <q-btn
            round
            size="10px"
            color="blue-12"
            icon="fas fa-chart-line"
            glossy
            to="/"/></span
        >Expensa
      </p>
      <p class="welcome-text">
        Hello Dear, Kindly Sign up let's get to know you
      </p>
      <q-form @submit.prevent="register" class="q-mx-xl">
        <q-card>
          <q-card-section>
            <!-- Name goes here
              -->
            <q-input
              filled
              v-model.trim="userDetails.name"
              type="text"
              label="Full Name"
              class="q-mb-md"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter Your Name'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-user" />
              </template>
            </q-input>
            <!-- email address goes here
              -->
            <q-input
              filled
              v-model.trim="userDetails.email"
              type="email"
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
              v-model.trim="userDetails.password"
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
            <!-- Phone number goes here
              -->
            <q-input
              filled
              v-model.trim="userDetails.phone"
              type="tel"
              label="Phone number"
              class="q-mb-md"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) || 'Please enter your phone number'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-phone-square" />
              </template>
            </q-input>
            <div class="q-gutter-sm content-center q-pl-md">
              <span
                class="text-weight-bold text-grey"
                style="margin-top: 4px; font-size: 16px;"
              >
                Gender:</span
              >
              <q-radio v-model="userDetails.gender" val="Male" label="Male" />
              <q-radio
                v-model="userDetails.gender"
                val="Female"
                label="Female"
              />
            </div>
          </q-card-section>
        </q-card>
        <div class="loginBtn q-gutter-lg-x-lg">
          <q-btn
            size="19px"
            glossy
            :loading="submitting"
            :disabled="submitting"
            class="q-ma-md btn-blue"
            color="blue-14"
            type="submit"
            label="Sign Up"
          />
          <span class="forgotPass text-grey-8">
            <router-link to="/login" class="reglink link">
              Already have an account? Click here to login up.
            </router-link>
          </span>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      submitting: false,
      userDetails: {
        name: "",
        email: "",
        password: "",
        phone: "",
        gender: "Female",
        rememberMe: false
      },

      isPwd: true,
      validEmail: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
  },
  methods: {
    register() {
      this.submitting = true;
      const formData = this.userDetails;
      this.$store.dispatch("register", formData).then(res=>{
        this.submitting = false;
        this.$router.push({
          path: '/login'
        });
      }).catch(err => {
          this.submitting = false;
          console.log(err.response)
      });
    }
  }
};
</script>

<style scoped>
.logoAlt {
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 3rem;
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
  padding-top: 1rem;
}
.welcome-text {
  font-size: 19px;
  font-weight: 400;
  text-align: center;
  padding-bottom: 1rem;
}
</style>
