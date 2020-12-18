<template>
  <div class="content-centered">
    <div
      class="q-my-lg row q-gutter-lg"
      style="width: 100%; margin: 1rem auto;"
    >
      <div class="col-md-3 gt-sm">
        <q-form @submit.prevent="modeCheck">
          <q-card>
            <q-card-section>
              <q-select
                v-if="editSource == false"
                required
                outlined
                v-model="tempSource"
                :options="incomeSource"
                @input="getIncomeSourceType()"
                label="Income Source"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-input
                v-if="editSource"
                outlined
                type="text"
                v-model.trim="incomeFormData.source"
                label="Income Source"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-select
                v-if="tempSource == 'Customers'"
                transition-show="fade"
                transition-hide="fade"
                required
                outlined
                v-model="incomeFormData.source"
                :options="customers"
                @input="getIncomeSourceType()"
                label="Select customers"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                v-if="tempSource == 'Non Customers'"
                outlined
                type="text"
                v-model.trim="incomeFormData.source"
                label="Please Specify Customer Name"
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
                v-model="tempVat"
                :options="vat"
                @input="getVatType()"
                label="Value Added Tax (VAT)"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-input
                transition-show="fade"
                transition-hide="fade"
                v-if="tempVat == 'Yes'"
                outlined
                type="number"
                min="0" max="99" step="any"
                v-on:blur="calTotal"
                v-model.trim="incomeFormData.vat_percentage"
                label="Please specify Vat percentage"
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
                label="Method of payment"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                type="date"
                required
                outlined
                v-model="incomeFormData.date_received"
                label="Date Recieved"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <br />
              <span v-if="userRole == 1">
                <q-btn
                  v-if="editSource == false"
                  label="Add Income"
                  :loading="loading"
                  :disbaled="loading"
                  type="submit"
                  class="full-width bg-primary text-white"
                  >
                      <template v-slot:loading>
                        <q-spinner />
                      </template>
                  </q-btn>        
                <q-btn
                  v-else
                  label="Update Income"
                  :loading="loading"
                  :disbaled="loading"
                  type="submit"
                  class="full-width bg-primary text-white"
                >
                  <template v-slot:loading>
                    <q-spinner />
                  </template>
                </q-btn> 

              </span>
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
                         <th class="text-center text-weight-bolder">
                          VAT (%)
                        </th>
                        <th class="text-center text-weight-bold">
                          Method of payment
                        </th>
                        <th class="text-center text-weight-bold">
                          Date Received
                        </th>
                        <th v-if="userRole == 1" class="text-center text-weight-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in income" :key="item.id">
                        <td class="text-left">{{item.source}}</td>
                        <td class="text-center">{{item.description}}</td>
                        <td class="text-right">&#8358; {{ formatNumber(item.amount)}}</td>
                        <td class="text-center">{{item.vat_percentage}}</td>
                         <td class="text-center">{{item.mop}}</td>
                        <td class="text-center">{{item.date_received}}</td>
                        <td class="text-right" v-if="userRole == 1">
                          <span class="col-md-4 q-gutter-sm">
                            <q-btn
                            v-if="userRole == 1"
                              @click="trigerEdit(item.id); editMode = true;"
                              size="10px"
                              label="Edit"
                              class="bg-primary text-white"
                            />
                            <!-- <q-btn
                              @click="trigerDelete()"
                              size="10px"
                              label="Delete"
                              class="bg-red-10 text-white"
                            /> -->
                          </span>
                        </td>
                      </tr>
                       <q-inner-loading :showing="visible">
                        <q-spinner size="50px" color="primary" />
                      </q-inner-loading>
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
// import axios from "axios";
import { date } from "quasar";

export default {
  name: "home",
  data() {
    return {
      visible: false,
      nairaSign: "&#x20A6;",
      editMode: false,
      editSource: false,
      searchIncome: "",
      incomeSource: ["Customers", "Non Customers"],
      mop: ["Cash", "Bank Transfer", "Cheque"],
      vat: ['Yes', 'No'],
      sourceSelected: false,
      income: "",
      customers: [],
      tempSource: "",
      tempVat: "",
      singleIncome: "",
      incomeFormData: {
        source: "",
        vat_percentage: "",
        description: "",
        amount: "",
        date_received: "",
        mop: ""
      },
      loading: false,
      userRole: "",
    };
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    getIncomeSourceType(){
      let rawCustomers = this.$store.getters.customers;
      if(this.tempSource == 'Customers') {
        let customerNames =
        rawCustomers.map(item => {
          let name = item.name;
          return name;
        });
        console.log(customerNames);
        this.customers = customerNames;
      }
    },
    getVatType(){
      if(this.tempVat == 'No'){
        this.incomeFormData.vat_percentage = 'Nill';
      }
    },
    calTotal(){
      if(this.incomeFormData.vat_percentage !== 'Nill'){
        let vatValue = parseInt(this.incomeFormData.vat_percentage) ;
        let vatDecimal = vatValue / 100;
        let percentageVal = vatDecimal * this.incomeFormData.amount;
        let amnt = this.incomeFormData.amount - percentageVal;
        console.log(amnt);
      }

    },
    loadCustomers() {
      this.axios
        .get("customer/all")
        .then( res => {
          console.log(res.data.data);
          this.$store.commit("storeCustomers", res.data.data);
        })
        .catch(err => {
          console.log(err);
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
    loadIncomeFromStore(id){
      let incomeArr = this.$store.getters.income;
      let oneIncome = incomeArr.find(function(params, index) {
        if (params.id == id) {
          return true;
        }
      });

      this.singleIncome = oneIncome;
    },
    loadIncome(){
      this.axios
        .get("income/all")
        .then( res => {
          if(res.status == 200){
            console.log(res.data.data);
            this.$store.commit("storeIncome", res.data.data);
            this.income = res.data.data;
            console.log(this.income);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    addIncome(){
      this.loading = true;
      console.log(this.incomeFormData)
       this.axios
        .post("income/store", this.incomeFormData)
        .then(res => {
          console.log(res)
          
          if (res.status == 200) {
            (this.incomeFormData.source = null),
              (this.incomeFormData.vat = null),
              (this.tempVat = null),
              (this.tempSource = null),
              (this.incomeFormData.description = null),
              (this.incomeFormData.date_received = null),
              (this.incomeFormData.mop = null),
              (this.incomeFormData.amount = null),
              this.$q.notify({
                message: "Income Added Successfullyy",
                position: "top",
                type: "positive"
              });
            this.loadIncome();
            this.loading = false;
          }
        })
        .catch(res => {
          this.loading = false;
          if(res.response.status == 505){
            this.$q.notify({
              message: "Opps something went wrong",
              position: "top",
              type: "negative"
            });
          }
        });
    },

    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },

    modeCheck() {
      if (this.editMode) {
        this.updateIncome();
      }
      if (!this.editMode) {
        this.addIncome();
      }
    },

    updateIncome(){
      this.loading = true;
      this.axios
        .put(
          "income/update/" + this.singleIncome.id,
          this.incomeFormData)
        .then(res => {
          if (res.errors) {
            this.$q.notify({
              message: "Opps something went wrong",
              position: "top",
              type: "negative"
            });
          }
          if (res.data.status.success) {
            this.loadIncome();
            this.$q.notify({
              message: "Income Edited Successfullyy",
              position: "top",
              type: "positive"
            });
              this.editMode = false;
              (this.incomeFormData.source = null);
              (this.incomeFormData.vat = null);
              (this.tempVat = null);
              (this.tempSource = null);
              (this.incomeFormData.description = null);
              (this.incomeFormData.date_received = null);
              (this.incomeFormData.mop = null);
              (this.incomeFormData.amount = null);

          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },

    trigerEdit(id){
      this.loadIncomeFromStore(id)
      this.editSource = true;
      this.editMode = true;
      this.incomeFormData.source  = this.singleIncome.source;
      this.incomeFormData.description  = this.singleIncome.description;
      this.incomeFormData.amount  = this.singleIncome.amount;
      this.incomeFormData.date_received  = this.singleIncome.date_received;
      this.incomeFormData.mop  = this.singleIncome.mop;

      if(this.singleIncome.vat_percentage == 'Nill' ){
        this.tempVat  = 'No';
        this.getVatType();
      }else{
        this.tempVat  = 'Yes';
        this.incomeFormData.vat_percentage = this.singleIncome.vat_percentage
      }

      console.log('hello from edit')

    },

    getAuthUserRole(){
      this.userRole = this.$q.cookies.get('role');
      console.log(this.userRole);
    }
    

  },

  created() {
    this.getAuthUserRole()
    this.loadCustomers();
    this.loadIncome();
  },


  mounted() {
    this.getAuthUserRole();
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
