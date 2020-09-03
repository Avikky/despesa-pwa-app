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
          <span class="amount big-text">{{ availableIncome }}</span>
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
    <div class="q-my-lg row q-gutter-lg" style="width: 80%; margin: 1rem auto;">
      <div class="col-md-3">
        <q-form @submit.prevent="createIncome">
          <q-card>
            <q-card-section>
              <q-select
                outlined
                v-model="income.customer"
                :options="customers"
                label="Expense Category"
              />
              <br />
              <q-input
                outlined
                type="text"
                v-model.trim="income.title"
                label="Title"
              />
              <br />
              <q-input
                outlined
                type="text"
                v-model.trim="income.description"
                label="Description"
              />
              <br />
              <q-input
                outlined
                type="number"
                v-model.trim="income.amount"
                label="Amount"
              />
              <br />
              <q-input
                outlined
                type="text"
                v-model.trim="income.made_by"
                label="Made By"
              />
              <br />
              <q-btn
                label="Add Expenses"
                type="submit"
                class="full-width bg-primary text-white"
              />
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <div class="col-md-8">
        <q-card>
          <q-card-section>
            <!-- my custom table -->
            <div class="table wrapper">
              <div class="table-header">
                <p class="table-title text-primary medium-text">
                  Expense Record
                </p>
                <div class="sort-table">
                  <q-input
                    dense
                    outlined
                    type="text"
                    v-model.trim="searchExpense"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div class="table-data">
                <div class="data-header row">
                  <p class="col-md-4 text-bold">Expenses</p>
                  <p class="col-md-4 text-bold">
                    (<span v-html="nairaSign" class="q-pr-sm"></span>) Amount
                  </p>
                  <p class="col-md-4 text-bold">Action</p>
                </div>
                <q-separator class="q-my-sm" />
                <!-- your main table data starts here -->
                <div class="main-data">
                  <template>
                    <div class="row">
                      <p class="col-md-4">Transport to Nsukka</p>
                      <p class="col-md-4">1000</p>
                      <p class="col-md-4 q-gutter-sm">
                        <q-btn
                          size="10px"
                          label="edit"
                          type="submit"
                          class="bg-primary text-white"
                        />
                        <q-btn
                          size="10px"
                          label="delete"
                          type="submit"
                          class="bg-red-10 text-white"
                        />
                      </p>
                    </div>
                    <q-separator class="q-my-sm" />
                  </template>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
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
      responseDialog: false,
      date: {
        day: "",
        month: ""
      },
      availableIncome: "100,000",
      customers: ["Fuel", "Transport", "Photocopy"],
      income: {
        source: "customer",
        customer_id: "",
        type: "",
        description: "",
        amount: "",
        mop: ""
      }
    };
  },
  methods: {},
  mounted() {
    this.closeAllModal();
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

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 1rem;
}
</style>
