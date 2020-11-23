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
                    <hr>
                    <br>
                    <div class="justify-center" v-if=incomeMode>
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
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in incomeSorted" :key="item.id">
                                <td class="text-left">{{item.source}}</td>
                                <td class="text-center">{{item.description}}</td>
                                <td class="text-right">&#8358; {{item.amount}}</td>
                                <td class="text-center">{{item.vat_percentage}}</td>
                                <td class="text-center">{{item.mop}}</td>
                                <td class="text-center">{{item.date_received}}</td>
                            </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                    <div class="justify-center" v-if="expenseMode">
                        <q-markup-table>
                            <thead>
                            <tr>
                                <th class="text-left text-weight-bolder">Date</th>
                                <th class="text-center text-weight-bolder">Title</th>
                                <th class="text-center text-weight-bolder">Description</th> 
                                <th class="text-center text-weight-bolder">Made By</th>
                                <th class="text-right text-weight-bolder">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in expenseSorted" :key="item.id">
                                <td class="text-left">{{item.date_of_expense}}</td>
                                <td class="text-center">{{item.title}}</td>
                                <td class="text-center">{{item.description}}</td>
                                <td class="text-center">{{item.made_by}}</td>
                                <td class="text-right">&#8358; {{item.amount}}</td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                            </tbody>
                        </q-markup-table>  
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
                        <p class="text-h6 text-blue-12 text-center">GROSS TOTAL</p>
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

                                                <span class="text-white text-h6"> {{Gxpenses}}</span>
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

                                                <span class="text-white text-h6">{{Gincome}}</span>
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

                                                <span class="text-white text-h6"> {{ Gprofit }}</span>
                                            </p> 
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>

                        <br><br>
                        <hr>
                        <div class="row justify-center main-data q-gutter-md">
                            <div class="col-md-5">
                                <p class="text-h6 text-blue-12 row justify-center">Income</p>
                                <q-markup-table>
                                    <thead>
                                    <tr>
                                        <th class="text-left text-weight-bolder">
                                            Date
                                        </th>
                                        <th class="text-right text-weight-bolder">
                                            Description
                                        </th>
                                        <th class="text-right text-weight-bolder">
                                            Income
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="item in incomeSorted" :key="item.id">
                                        <td class="text-left">{{item.date_received}}</td>
                                        <td class="text-center">{{item.description}}</td>
                                        <td class="text-right">&#8358; {{item.amount}}</td>
                                    </tr>
                                    </tbody>
                                </q-markup-table>
                            </div>
                            <div class="col-md-5">
                                <p class="text-h6 text-blue-12 row justify-center">Expenses</p>
                                <q-markup-table>
                                    <thead>
                                    <tr>
                                        <th class="text-left text-weight-bolder">
                                            Date
                                        </th>
                                        <th class="text-center text-weight-bolder">
                                            Description
                                        </th>
                                        <th class="text-right text-weight-bolder">
                                            Expenses
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="item in expenseSorted" :key="item.id">
                                        <td class="text-left">{{item.date_of_expense}}</td>
                                        <td class="text-center">{{item.title}}</td>
                                        <td class="text-right">&#8358; {{item.amount}}</td>
                                    </tr>
                                    </tbody>
                                </q-markup-table>
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
export default {
  data() {
    return {
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
        },
        searchCustomers: "",
    };
  },
  methods: {
    // generateYear(){
    //     var i;
    //     var dat = new Date()
    //     var year = dat.getFullYear();
    //     var generated;
    //     for (i = 1990; i <= year; i++) {
    //        this.years.push(i)
    //     }
    // },
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
            console.log(res)
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
