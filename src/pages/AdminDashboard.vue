<template>
  <div class="content-centered">
    <div class="banner">
      <div class="banner-inner">
        <div class="date">
          <span class="day big-text q-pr-lg">09</span>
          <span class="month medium-text">July</span>
        </div>
        <div class="balance">
          <span class="naira-sign medium-text" v-html="nairaSign"></span>
          <span class="amount big-text">{{ profit }}</span>
        </div>
        <div class="crudBtn q-gutter-md">
          <q-btn
            @click="prompt = true"
            round
            color="primary"
            icon="fas fa-plus-circle"
          />
          <q-btn
            round
            color="primary"
            icon="fas fa-pen-square"
            @click="
              editMode = true;
              prompt = true;
            "
          />
        </div>
      </div>

      <!-- Dialop for to display response from first dialog -->
      <q-dialog
        v-model="responseDialog"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-teal text-white" style="width: 300px">
          <q-card-section>
            <div class="text-h6">Persistent</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Response will be here
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      nairaSign: "&#x20A6;",
      editMode: false,
      searchExpense: "",
      profit: "",
      responseDialog: false,
      date: {
        day: "",
        month: ""
      }
    };
  },
  methods: {
    checkAdminAuth() {
      let isAdmin = this.$store.getters.getAdmin;
      if (!isAdmin) {
        this.$router.push("/error");
      }
    }
  },
  created() {
    this.checkAdminAuth();
  }
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
