<template>
  <div class="content-centered">
    <div
      class="q-my-lg row q-gutter-lg"
      style="width: 100%; margin: 1rem auto;"
    >
      <div class="col-md-3">
        <q-form @submit.prevent="addIncome">
          <q-card>
            <q-card-section>
              <q-select
                required
                outlined
                value=""
                :options="incomeSource"
                @input="getIncomeSourceType()"
                label="Income Source"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-select
                v-if="sourceSelected != null"
                required
                outlined
                v-model="tempSource"
                value=""
                :options="customers"
                @input="getId()"
                label="Customers"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-input
                v-if="sourceSelected != null"
                outlined
                type="text"
                v-model.trim="incomeFormData.source"
                label="Please Specify income source"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-input
                outlined
                type="text"
                v-model.trim="incomeFormData.description"
                label="Description"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-input
                outlined
                type="number"
                v-model.trim="incomeFormData.amount"
                label="Amount"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-select
                required
                outlined
                v-model="incomeFormData.mop"
                value=""
                :options="mop"
                @input="getId()"
                label="Method of payment"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                type="date"
                required
                outlined
                v-model="incomeFormData.date_of_payment"
                label="Date Recieved"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <br />
              <q-btn
                label="Add Income"
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
                  Income Record
                </p>
                <div class="sort-table">
                  <q-input
                    dense
                    outlined
                    type="text"
                    v-model.trim="searchIncome"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div class="table-data">
                <q-separator class="q-my-sm" />
                <!-- your main table data starts here -->
                <div class="main-data">
                  <q-markup-table>
                    <thead>
                      <tr>
                        <th class="text-left text-weight-bolder">
                          Income Source
                        </th>
                        <th class="text-right text-weight-bolder">
                          Description
                        </th>
                        <th class="text-center text-weight-bolder">
                          Amount
                        </th>
                        <th class="text-center text-weight-bold">
                          Method of payment
                        </th>
                        <th class="text-center text-weight-bold">
                          Date Received
                        </th>
                        <th class="text-center text-weight-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in income" :key="item.id">
                        <td class="text-left">customer name/source</td>
                        <td class="text-center">little description</td>
                        <td class="text-right">&#8358; 2344</td>

                        <td class="text-center">by cash</td>
                        <td class="text-center">date received</td>
                        <td class="text-right">
                          <span class="col-md-4 q-gutter-sm">
                            <q-btn
                              @click="trigerEdit()"
                              size="10px"
                              label="Edit"
                              class="bg-primary text-white"
                            />
                            <q-btn
                              @click="trigerDelete()"
                              size="10px"
                              label="Delete"
                              class="bg-red-10 text-white"
                            />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
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
import * as store from "../store/users";
import axios from "axios";
import { Cookies } from "quasar";
import { date } from "quasar";
import { Notify } from "quasar";
export default {
  name: "home",
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/api/",
      nairaSign: "&#x20A6;",
      editMode: false,
      searchIncome: "",
      incomeSource: ["Customers", "Non Customers"],
      mop: ["Cash", "Bank Transfer", "Cheque"],
      sourceSelected: null,
      income: [],
      customers: [],
      tempSource: "",
      incomeFormData: {
        source: "",
        type: "",
        customer_id: "",
        description: "",
        amount: "",
        date_received: "",
        mop: ""
      }
    };
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    deleteBal(id) {
      console.log("delte btn triggered");
      axios
        .delete(this.baseUrl + "opening-balance/delete/" + id, {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          //console.log(res.data);
          if (res.data.error) {
            this.$q.notify({
              message: res.data.error,
              position: "top",
              type: "negative"
            });
          }
          if (res.data.success) {
            this.$q.notify({
              message: res.data.success,
              position: "top",
              type: "positive"
            });
            this.loadOpeningBal();
            this.deleteResponse = false;
          }
        })
        .catch(err => {
          this.$q.notify({
            message: "opps something went wrong",
            position: "top",
            type: "negative"
          });
        });
    },

    createOpeningBal() {
      console.log("create balance");
      axios
        .post(this.baseUrl + "opening-balance/add", this.balanceFormData, {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          console.log(res.data);
          if (res.data.errors) {
            this.$q.notify({
              message: "This Date Already Exist",
              position: "top",
              type: "negative"
            });
          }
          if (res.data.status == "success") {
            this.balanceFormData.amount = null;
            this.balanceFormData.date_created = null;
            this.$q.notify({
              message: "Opening Balance Added Successfully",
              position: "top",
              type: "positive"
            });
            this.loadOpeningBal();
            this.closeAllModal();
          }
        })
        .catch(err => {
          console.log(err);
          this.$q.notify({
            message: "Opps Something went wrong",
            position: "top",
            type: "negative"
          });
        });
    },

    getId() {
      if (this.tempSource) {
        console.log(this.tempSource);
        /*     this is the data parameter used for the search */
        let cateVal = this.tempSource;
        /* end */

        /* this is the array to be searched through */
        let cateArr = this.$store.getters.expenseCategory.data;
        /* end */
        /*         important function used to search through an array in js */
        let cateId = cateArr.find(function(category, index) {
          if (category.name == cateVal) {
            return true;
          }
        });
        /* end */
        /* Result of the search */
        /* console.log(cateId.id); */
        this.incomeFormData.category_id = cateId.id;
      } else {
        console.log("data not set");
      }
    },
    closeAllModal() {
      this.prompt = false;
      this.responseDialog = false;
    },
    addExpenses() {
      this.incomeFormData.date_of_expense = this.openingBal.date;
      this.incomeFormData.opening_bal_id = this.openingBal.id;
      let balId = this.openingBal.id;
      console.log(this.incomeFormData);
      axios
        .post(this.baseUrl + "income/store", this.incomeFormData, {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(() => {
          this.reduceBal = this.incomeFormData.amount;
          console.log("Expense Added Successfully.");
          this.tempSource = null;
          this.incomeFormData.category_id = null;
          this.incomeFormData.title = null;
          this.incomeFormData.description = null;
          this.incomeFormData.amount = null;
          this.incomeFormData.made_by = null;
          this.incomeFormData.date_of_expense = null;
          this.incomeFormData.opening_bal_id = null;
          this.fetchExpenses();
          this.$q.notify({
            message: "Expense Added Successfully",
            position: "bottom-left",
            type: "positive"
          });
          this.debitBal(balId);
        })

        .catch(err => {
          console.log(err);
          this.$q.notify({
            message: "Opps Something went wrong",
            position: "bottom-left",
            type: "negative"
          });
        });
    },
    fetchExpenses() {
      axios
        .get(this.baseUrl + "income/all", {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          //console.log(res)
          if (res.data) {
            this.$store.commit("allExpenses", {
              income: res.data
            });
            this.income = res.data.data;
            console.log(this.income);
          }
        })
        .catch(err => {
          console.log(err.status);
        });
    },
    fetchExpensesCategory() {
      axios
        .get(this.baseUrl + "expense-category/all", {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          if (res.data.status == 401) {
            this.$store.commit("checkError", {
              type: "expenseCategory"
            });
          } else {
            this.$store.commit("allExpensesCategory", {
              expense_category: res.data
            });
            this.getCategories();
            //console.log(res.data)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getCategories() {
      await this.$store.getters.expenseCategory.data;
      let rawCategory = this.$store.getters.expenseCategory.data;
      let customersByName = rawCategory.map(item => {
        let name = item.name;
        return name;
      });
      this.customers = customersByName;
    },
    trigerDelete(expenseId, expenseAmt) {
      axios
        .delete(this.baseUrl + "income/delete/" + expenseId, {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          },
          data: {
            balId: this.openingBal.id,
            amount: expenseAmt
          }
        })
        .then(res => {
          console.log(res.data.success);
          if (res.data.success) {
            this.loadOpeningBal();
            this.fetchExpenses();
            this.$q.notify({
              message: "Expense Deleted Successfully",
              position: "top",
              type: "positive"
            });
          } else {
            this.$q.notify({
              message: "Opps Something went wrong",
              position: "top",
              type: "negative"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$q.notify({
            message: "Opps Something went wrong",
            position: "top",
            type: "negative"
          });
        });
    }
  },
  created() {
    this.formatNumber();
  },

  mounted() {}
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
