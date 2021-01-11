<template>
  <div class="content-centered">
    <div
      class="q-my-lg row q-gutter-lg"
      style="width: 100%; margin: 1rem auto;"
    >
      <div class="col-md-3">
        <div class="bg-white card">
            <q-list bordered separator>
                <q-item clickable v-ripple>
                    <q-item-section @click="switchTab('general')">General</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section @click="switchTab('expense')">Expenses</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section @click="switchTab('income')">Income</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                    <q-item-section @click="switchTab('bal')">All Openning Balances</q-item-section>
                </q-item>
            </q-list>

        </div>
      </div>
      <div class="col-md-8">
        <q-card>
          <q-card-section>
            <!-- my custom table -->
            <div class="table wrapper">
              <div class="table-header">
                <p class="table-title text-primary medium-text">
                  Report
                </p>
                <div class="sort-table">
                  <q-input
                    dense
                    outlined
                    type="text"
                    v-model.trim="searchCustomers"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div class="table-data">
                <q-separator class="q-my-sm" />
                <!-- your main table data starts here -->
                <div class="main-data">
                    <q-form v-if="!generalMode" @submit.prevent="sortReport">
                        <div class="row q-gutter-md justify-center">
                            <div v-if="expenseMode" class="col-md-3">
                                <label for="startDate">Select Expense Category</label><br>
                                 <select v-model="sortFormData.expenseCateID" style="padding: 12px;" name="expenseCategory" id="" >
                                   <option v-for="category in categories" :key="category.id" :value="category.id">{{category.name}}</option>
                                 </select>
                            </div>
                             <div v-if="incomeMode" class="col-md-3">
                                <label for="startDate">Select Customer</label><br>
                                 <select v-model="sortFormData.customerName" style="padding: 12px;" name="expenseCategory" id="" >
                                   <option v-for="customer in customers" :key="customer.id" :value="customer.name">{{customer.name}}</option>
                                 </select>
                            </div>
                            <div class="col-md-3">
                                <label for="startDate">Start Date</label>
                                <q-input
                                    required
                                    outlined
                                    id="startDate"
                                    dense
                                    type="Date"
                                    v-model="sortFormData.sortFrom"
                                />
                            </div>
                            <div class="col-md-3">
                                <label for="endDate">End Date</label>
                                <q-input
                                    required
                                    outlined
                                    dense
                                    id="endDate"
                                    type="Date"
                                    v-model="sortFormData.sortTo"
                                />
                            </div>
                            <div class="col-md-2">
                                <q-btn
                                    icon="sort"
                                    label="Generate"
                                    type="submit"
                                    class="full-width bg-primary text-white q-mt-lg"
                                />
                            </div>
                        </div>
                    </q-form>
                    <br><br>
                    <p v-if="generalMode" class="text-h6 text-blue-12 text-center">GROSS TOTAL</p>
                    <hr>
                    <br>
                    <div class="justify-center" v-if=incomeMode>
                      <q-table
                        title="Expense Report"
                        :columns="incomeColumns"
                        :data="incomeSorted"
                        color="primary"
                        row-key="name"
                      >
                        <template v-slot:top-right>
                          <q-btn
                            color="primary"
                            icon-right="archive"
                            label="Export to csv"
                            no-caps
                            @click="exportIncomeTable"
                          />
                        </template>
                      </q-table>
                    </div>
                    <div class="justify-center" v-if="expenseMode">
                      <q-table
                        title="Expense Report"
                        :columns="expenseColumns"
                        :data="expenseSorted"
                        color="primary"
                        row-key="name"
                      >
                        <template v-slot:top-right>
                          <q-btn
                            color="primary"
                            icon-right="archive"
                            label="Export to csv"
                            no-caps
                            @click="exportExpenseTable"
                          />
                        </template>
                      </q-table>

                    </div>
                    <div class="row justify-center" v-if="openingBalMode">
                        <q-markup-table>
                            <thead>
                            <tr>
                                <th class="text-left text-weight-bolder">
                                    Date
                                </th>
                                <th class="text-center text-weight-bolder">
                                    Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in openingBal" :key="item.id">
                                    <td class="text-left">{{item.date_created}}</td>
                                    <td class="text-center">&#8358; {{item.amount}}</td>
                                </tr>
                                <tr></tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                    <div v-if="generalMode">
                      <q-form @submit.prevent="sortReport">
                        <div class="row q-gutter-md justify-center">
                            <div class="col-md-3">
                                <label for="startDate">Start Date</label>
                                <q-input
                                    required
                                    outlined
                                    id="startDate"
                                    dense
                                    type="Date"
                                    v-model="sortFormData.sortFrom"
                                />
                            </div>
                            <div class="col-md-3">
                                <label for="endDate">End Date</label>
                                <q-input
                                    required
                                    outlined
                                    dense
                                    id="endDate"
                                    type="Date"
                                    v-model="sortFormData.sortTo"
                                />
                            </div>
                            <div class="col-md-2">
                                <q-btn
                                    icon="sort"
                                    label="Generate"
                                    type="submit"
                                    class="full-width bg-primary text-white q-mt-lg"
                                />
                            </div>
                        </div>
                      </q-form>
                    <br><br>
                      <div class="row q-gutter-md justify-center">
                        <div class="col-md-3">
                            <q-card class="my-card">
                                <q-card-section class="bg-negative">
                                    <p class="text-white  text-bold">
                                        <i class="fas fa-chart-line fa-2x text-white"></i>
                                        <span class=""> Total Expenses</span>
                                    </p>
                                    <hr>
                                    <div class="text-subtitle1">
                                        <p>
                                            <span class="text-white naira-sign medium-text" v-html="nairaSign"></span>

                                            <span class="text-white text-h6"> {{formatNumber(Gxpenses)}}</span>
                                        </p>
                                    </div>
                                </q-card-section>

                            </q-card>
                        </div>
                        <div class="col-md-3">
                            <q-card class="my-card">
                                <q-card-section class="bg-blue-12">
                                    <p class="text-white  text-bold">
                                        <i class="fas fa-bolt fa-2x text-white"></i>
                                        <span class=""> Total Income</span>
                                    </p>
                                    <hr>
                                    <div class="text-subtitle1">
                                        <p>
                                            <span class="text-white naira-sign medium-text" v-html="nairaSign"></span>

                                            <span class="text-white text-h6">{{ formatNumber(Gincome)}}</span>
                                        </p>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                        <div class="col-md-3">
                            <q-card class="my-card">
                                <q-card-section class="bg-positive">
                                    <p class="text-white  text-bold">
                                        <i class="fas fa-chart-pie  fa-2x text-white"></i>
                                        <span class=""> Total Profit</span>
                                    </p>
                                    <hr>
                                    <div class="text-subtitle1">
                                        <p>
                                            <span class="text-white naira-sign medium-text" v-html="nairaSign"></span>

                                            <span class="text-white text-h6"> {{ formatNumber(Gprofit) }}</span>
                                        </p>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                      </div>
                    </div>
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
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  data() {
    return {
      expenseColumns: [
        { name: 'date_of_expense', align: 'left', label: 'Date', field: 'date_of_expense' },
        { name: 'title', label: 'Title',align: 'center', field: 'title' },
        { name: 'description', label: 'Description', align: 'center', field: 'description' },
        { name: 'made_by', label: 'Made By', align: 'center', field: 'made_by' },
        { name: 'amount', label: 'Amount', align: 'right', field: 'amount' },
      ],
      incomeColumns:  [
        { name: 'source', align: 'left', label: 'Income Source', field: 'source' },
        { name: 'description', label: 'Description', align: 'center', field: 'description' },
        { name: 'amount', label: 'Amount', align: 'right', field: 'amount' },
        { name: 'vat_percentage', label: 'Vat (%)', align: 'center', field: 'vat_percentage' },
        { name: 'mop', label: 'Method of Payment', align: 'center', field: 'mop' },
        { name: 'date_received', label: 'Date Receive', align: 'center', field: 'date_received' },
      ],
        expenseMode: false,
        incomeMode: false,
        openingBalMode: false,
        generalMode: true,
        Gxpenses: "",
        Gincome: "",
        Gprofit: "",
        nairaSign: "&#x20A6;",
        expenseSorted: "",
        incomeSorted: "",
        openingBal: "",
        sortFormData: {
            sortFrom: "",
            sortTo: "",
            expenseCateID: "",
            customerName: "",
        },
        searchCustomers: "",
        categories: "",
        customers: "",
        totalSearchExp: "",
        totalSearchIncome: ""
    };
  },
  methods: {
    exportExpenseTable () {
      // naive encoding to csv format
      const content = [ this.expenseColumns.map(col => wrapCsvValue(col.label)) ].concat(
        this.expenseSorted.map(row => this.expenseColumns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
     exportIncomeTable () {
      // naive encoding to csv format
      const content = [ this.incomeColumns.map(col => wrapCsvValue(col.label)) ].concat(
        this.incomeSorted.map(row => this.incomeColumns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    loadCategories() {
      this.axios
        .get("expense-category/all")
        .then(res => {
          console.log(res);
          this.categories = res.data.data;
          console.log(this.categories);
          this.$store.commit("storeExpenseCategory", res.data.data);
        })
        .catch(err => {
          //console.log(err.response);
          if(err.response.status == 404){
            console.log('No Category Found');
          }
        });
    },
    loadCustomers() {
      this.axios
        .get("customer/all")
        .then(res => {
          //console.log(res.data.data);
          this.$store.commit("storeCustomers", res.data.data);
          this.customers = this.$store.getters.customers;
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    switchTab(value){
        console.log(value)
        if(value == 'expense'){
            this.expenseMode = true;
            this.incomeMode = false;
            this.openingBalMode =  false;
            this.generalMode =  false;

        }
        if(value == 'general'){
            this.expenseMode = false;
            this.incomeMode = false;
            this.openingBalMode =  false;
            this.generalMode =  true;
        }
        if(value == 'income'){
            this.expenseMode = false;
            this.incomeMode = true;
            this.openingBalMode =  false;
            this.generalMode =  false;
        }
        if(value == 'bal'){
            this.expenseMode = false;
            this.incomeMode = false;
            this.openingBalMode =  true;
            this.generalMode =  false;
        }
    },
    sortReport(){
        console.log(this.sortFormData);
        this.axios
        .post("report/generate", this.sortFormData)
        .then(res => {
            //console.log(res)
            if(res.data.expenseData.length){
                this.expenseSorted = res.data.expenseData;
                this.incomeSorted = res.data.incomeData;
                this.openingBal = res.data.openingBal;
                this.totalSearchExp = res.data.totalSearchExp;
                this.totalSearchIncome = res.data.totalSearchIncome;
                console.log(this.incomeSorted );
            }else{
                this.$q.notify({
                    message: "There was no Transaction within this time frame, check your input",
                    position: "top",
                    type: "negative"
                });
            }

        })
        .catch(err => {
          console.log(err.status);
        });
    },
    getGrossReport(){
        this.axios
        .get("report/all")
        .then(res => {
            console.log(res);
            this.Gxpenses = res.data.totalExpenses;
            this.Gincome = res.data.totalIncome;
            this.Gprofit = res.data.grossProfit;
        })
        .catch(err => {
          console.log(err.status);
        });
    }
  },
  created() {
    this.loadCustomers();
    this.loadCategories();
    this.getGrossReport();
  },
  mounted() {
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
