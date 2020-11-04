<template>
  <div class="content-centered lt-md">
       <div style="width: 80%; margin: 1rem auto;">
        <q-form @submit.prevent="addExpenses">
          <q-card>
            <q-card-section>
              <q-select
                ref="cate"
                required
                outlined
                v-model="tempCategory"
                value=""
                :options="categories"
                @input="getId()"
                label="Expense Category"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <br />
              <q-input
                ref="title"
                outlined
                type="text"
                v-model.trim="expenseFormData.title"
                label="Title"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <br />
              <q-input
                ref="desc"
                outlined
                type="text"
                v-model.trim="expenseFormData.description"
                label="Description"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <br />
              <q-input
                ref="amt"
                outlined
                type="number"
                v-model.trim="expenseFormData.amount"
                label="Amount"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <br />
              <q-input
                ref="by"
                outlined
                type="text"
                v-model.trim="expenseFormData.made_by"
                label="Made By"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
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
  </div>
</template>
<script>
import * as store from "../store/users";
import axios from "axios";
import { Cookies } from "quasar";
import { date } from "quasar";
import { openingBalance } from "../store/users/mutations";
import { Notify } from "quasar";
export default {
  name: "home",
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/api/",
      nairaSign: "&#x20A6;",
      tab: 'title',
      dateReponseModal: false,
      deleteResponse: false,
      editMode: false,
      searchExpense: "",
      responseDialog: false,
      prompt: false,
      reduceBal: "",
      expenses: [],
      openingBal: {
        id: "",
        amount: "000000",
        day: "",
        month: "",
        date: ""
      },
      categories: [],
      rawCategory: "",
      tempCategory: "",
      expenseFormData: {
        category_id: "",
        title: "",
        description: "",
        amount: "",
        made_by: "",
      },
      balanceFormData: {
        amount: "",
        date_created: ""
      },
    };
  },
  methods: {
        deleteBal(id) {
      console.log("delete btn triggered");
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
            this.fetchExpenses();
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
    debitBal(id) {
      let newBalance = this.openingBal.amount - this.reduceBal;
      this.openingBal.amount = newBalance;
      axios
        .put(
          this.baseUrl + "opening-balance/reuse-bal/" + id,
          { amount: newBalance },
          {
            headers: {
              Accept: "application/json",
              Authorization: "bearer" + Cookies.get("jwt_token")
            }
          }
        )
        .then(res => {})
        .catch(err => {
          console.log(err.status);
        });
    },
    balanceBroughtDown() {
      this.balanceFormData.amount = this.openingBal.amount;
      this.balanceFormData.date_created;

      axios
        .post(this.baseUrl + "opening-balance/add", this.balanceFormData, {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          console.log(res.data.status);
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
            this.fetchExpenses();
            this.dateReponseModal = false;
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
    loadOpeningBal() {
      axios
        .get(this.baseUrl + "opening-balance/last", {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          let balDate = new Date(res.data.date_created);
          console.log(balDate.getDate());
          let day;
          if (balDate.getDate() <= 9) {
            day = "0" + balDate.getDate();
          } else {
            day = balDate.getDate();
          }
          this.openingBal.id = res.data.id;
          this.openingBal.amount = res.data.amount;
          this.openingBal.day = day;
          this.openingBal.month = date.formatDate(balDate, "MMM");
          this.openingBal.date = res.data.date_created;
          //console.log(this.openingBal);

        })
        .catch(err => {
          console.log(err.status);
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
    editOpeningBal() {
      console.log("edit balance");
      axios
        .put(
          this.baseUrl + "opening-balance/edit/" + this.openingBal.id,
          {
            amount: this.openingBal.amount
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: "bearer" + Cookies.get("jwt_token")
            }
          }
        )
        .then(res => {
          console.log(res);
          if (res.data.status == "success") {
            this.$q.notify({
              message: "Editted Successfully",
              position: "top",
              type: "positive"
            });
            this.loadOpeningBal();
            this.closeAllModal();
          } else {
            this.$q.notify({
              message: "Opps Something went wrong",
              position: "top",
              type: "negative"
            });
          }
        })
        .catch(err => {
          console.log(err.status);
        });
    },
    getId() {
      if (this.tempCategory) {
        console.log(this.tempCategory);
        /*     this is the data parameter used for the search */
        let cateVal = this.tempCategory;
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
        this.expenseFormData.category_id = cateId.id;
      } else {
        console.log("data not set");
      }
    },
    addExpenses() {
      this.expenseFormData.date_of_expense = this.openingBal.date;
      this.expenseFormData.opening_bal_id = this.openingBal.id;
      let balId = this.openingBal.id;
      console.log(this.expenseFormData);
      axios
        .post(this.baseUrl + "expenses/store", this.expenseFormData, {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(() => {
          this.reduceBal = this.expenseFormData.amount;
          console.log("Expense Added Successfully.");
          this.tempCategory = null;
          this.expenseFormData.category_id = null;
          this.expenseFormData.title = null;
          this.expenseFormData.description = null;
          this.expenseFormData.amount = null;
          this.expenseFormData.made_by = null;
          this.expenseFormData.date_of_expense = null;
          this.expenseFormData.opening_bal_id = null;
          this.resetForm();
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
        .get(this.baseUrl + "expenses/all", {
          headers: {
            Accept: "application/json",
            Authorization: "bearer" + Cookies.get("jwt_token")
          }
        })
        .then(res => {
          //console.log(res)
          if (res.data) {
            this.$store.commit("allExpenses", {
              expenses: res.data
            });
            this.expenses = res.data.data;
            console.log(this.expenses);
          }
        })
        .catch(err => {
          console.log(err.status);
        });
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
      let categoriesByName = rawCategory.map(item => {
        let name = item.name;
        return name;
      });
      this.categories = categoriesByName;
    },
    trigerDelete(expenseId, expenseAmt) {
      axios
        .delete(this.baseUrl + "expenses/delete/" + expenseId, {
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
    },

    created() {
    this.fetchExpenses();
    this.fetchExpensesCategory();
    this.formatNumber();
  },
  }
}

</script>
