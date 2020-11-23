<template>
  <div class="content-centered q-mx-xl">
    <q-card class="my-card q-mt-lg">
      <q-card-section>
        <div class="row justify-center">
          <q-avatar size="100px" font-size="52px" color="blue-12" text-color="white" icon="fas fa-user" />
        </div>
      </q-card-section>
      <hr>
      <q-card-section>

        <q-card>
          <q-card-section>
            <q-form @submit.prevent="basicInfoUpdate" class="q-mx-xl">
              <div class="row q-gutter-md justify-center">
                <div class="col-md-3">
                  <q-input
                  outlined
                  type="text"
                  v-model.trim="user.name"
                  label="Name"
                  :rules="[
                    val => (val && val.length > 0) || 'This field is required'
                  ]"
                />
                </div>
                <div class="col-md-3">
                  <q-input
                  outlined
                  type="text"
                  v-model.trim="user.email"
                  label="Email"
                  :rules="[
                    val => (val && val.length > 0) || 'This field is required'
                  ]"
                />
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-md-6">
                  <q-input
                  outlined
                  type="tel"
                  v-model.trim="user.phone"
                  label="Phone"
                  :rules="[
                    val => (val && val.length > 0) || 'This field is required'
                  ]"
                  />
                </div>
              </div>
              <div class="row justify-center">
                <q-btn
                  size="19px"
                  glossy
                  class="q-mt-md btn-blue"
                  color="blue-14"
                  type="submit"
                  label="Update"
                />
              </div>
            </q-form>
          </q-card-section>
          <hr>
          <br>
          <br>
          <q-card-section>
            <p class="text-h5 text-center q-pb-xl"> <span class="text-blue-12"> <i class="fas fa-lock"></i></span> Change Password</p>
            <br>
            <q-form @submit.prevent="changePassword" class="q-mx-xl">
              <div class="row q-gutter-md justify-center">
                <div class="col-md-6">
                  <q-input
                    outlined
                    type="password"
                    hint=""
                    v-model.trim="newpassword"
                    label="New Password"
                    :rules="[
                      val => (val && val.length > 0) || 'This field is required'
                    ]"
                  />
                </div>
              </div>
              <div class="row q-gutter-md justify-center">
                <div class="col-md-6">
                  <q-input
                    outlined
                    type="password"
                    v-on:keyup="matchPassword"
                    v-model.trim="confirmPwd"
                    label="Confirm Password"
                    :rules="[
                      val => (val && val.length > 0) || 'This field is required'
                    ]"
                  />
                  <transition
                    appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
                  >
                  <span v-bind:class="{'text-positive': msgState, 'text-negative': !msgState}">{{msg}}</span>
                  </transition>
                </div>
              </div>
              <div class="row justify-center">
                <q-btn
                  size="19px"
                  glossy
                  class="q-mt-md btn-blue"
                  color="blue-14"
                  type="submit"
                  label="Change"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import * as store from "../store/users";
import axios from "axios";
import { Cookies } from "quasar";
import { date } from "quasar";
import { Notify } from "quasar";
export default {
  name: "home",
  data() {
    return {
       user_id: "",
      user: {
        name: "",
        email: "",
        phone: "",
      },
      msg: "",
      msgState: null,
      newpassword: "",
      confirmPwd: ""
    };
  },
  methods: {
    getUserInfo(){
      console.log(this.$store.getters.getAuthUser);
      this.user.id = this.$store.getters.getAuthUser.id;
      this.user.name = this.$store.getters.getAuthUser.username;
      this.user.email = this.$store.getters.getAuthUser.email;
      this.user.phone = this.$store.getters.getAuthUser.phone;
      this.user.gender = this.$store.getters.getAuthUser.gender;
    },
    basicInfoUpdate(){
        this.axios
        .put("settings/update-profile", this.user)
        .then(res => {
            console.log(res)
            if(res.status == 200){
              this.$q.notify({
                message: "Info updated",
                position: "top",
                type: "positive"
              });
            }else{
                this.$q.notify({
                    message: "opps something went wrong",
                    position: "top",
                    type: "negative"
                });
            }
        })
        .catch(err => {
          console.log(err.status);
        });
    },
    changePassword(){
        this.axios
        .put("settings/reset-password", this.newpassword)
        .then(res => {
            console.log(res)
            if(res.status == 200){
              this.$q.notify({
                message: "Password updated",
                position: "top",
                type: "positive"
              });
              this.newpassword =  "";
              this.msg = "";
              this.msgState = null;
            }else{
              this.$q.notify({
                  message: "opps something went wrong",
                  position: "top",
                  type: "negative"
              });
            }
        })
        .catch(err => {
          console.log(err.status);
        });
    },
    matchPassword(){
      if(this.newpassword.length && this.confirmPwd.length){
        if(this.newpassword === this.confirmPwd){
          this.msg = "Password matched";
          this.msgState =  true;
        }else{
          this.msg = 'Password does not match';
          this.msgState =  false;
        }
      }else {
        this.msg = "";
        this.msgState = null;
      }
    
    }
  },
  created() {
    this.getUserInfo();
  },

};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Courgette&family=Mitr&display=swap");
.banner {
  background: #fff;
  width: 80%;
  margin: 1.3rem auto;
  height: auto;
  border-radius: 5px;

  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086);
}
.banner-inner {
  padding: 0.7rem 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.date {
  margin-right: -20px;
}
.big-text {
  font-size: 80px;
  font-family: Arial, Helvetica, sans-serif;
}
.medium-text {
  font-size: 40px;
  font-family: "Mitr", sans-serif;
  font-weight: 550;
}
.amount {
  color: #448aff;
}

.balance {
  border: 1px solid lightgrey;
  padding: 8px 130px;
  background: #f1f1f1;
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 10px #000000;
}
</style>
