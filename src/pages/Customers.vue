<template>
  <div class="content-centered">
    <div
      class="q-my-lg row q-gutter-lg"
      style="width: 100%; margin: 1rem auto;"
    >
      <div class="col-xs-12 col-md-3">
        <q-form @submit.prevent="modeCheck">
          <q-card>
            <q-card-section>
              <q-input
                outlined
                type="text"
                v-model.trim="customersFormData.name"
                label="Customer Name"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-select
                required
                outlined
                v-model.trim="tempCate"
                :options="category"
                @input="getOthers"
                label="Customer Category"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                autofocus
                v-if="customerType"
                outlined
                type="text"
                v-model="specifyType"
                v-on:blur="mergeVal"
                label="Specify what type of customer"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                outlined
                type="text"
                v-model.trim="customersFormData.service_provided"
                label="Service Provided"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-select
                required
                outlined
                v-model="customersFormData.payment_interval"
                :options="paymentInterval"
                label="Payment Interval"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />

              <q-input
                outlined
                type="date"
                v-model.trim="customersFormData.current_billing_date"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              >
                <template v-slot:hint>
                  Current Billing Date
                </template>
              </q-input>
              <br />
              <span v-if="userRole == 1">
                  <q-btn
                  v-if="editMode"
                  label="Edit Customer"
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
                  class="full-width bg-primary text-white"
                >
                <template v-slot:loading>
                  <q-spinner />
                </template>
              </q-btn>
              <q-btn
                v-else
                :disabled="loading"
                :loading="loading"
                label="Create New Customer"
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
      <div class="col-xs-12 col-md-8">
        <q-card>
          <q-card-section>
            <!-- my custom table -->
            <div class="table wrapper">
              <div class="table-header">
                <p class="table-title text-primary medium-text">
                  Customers
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
                  <q-markup-table v-if="customers.length">
                    <thead>
                      <tr>
                        <th class="text-right text-weight-bold">
                          Customer Name
                        </th>
                        <th class="text-center text-weight-bold">
                          Category
                        </th>
                        <th class="text-center text-weight-bold">
                          Service Provided
                        </th>
                        <th class="text-center text-weight-bold" v-if="userRole == 1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="customer in customers" :key="customer.id">
                        <td class="text-left">{{ customer.name }}</td>
                        <td class="text-center">{{ customer.category }}</td>
                        <td class="text-right">
                          {{ customer.service_provided }}
                        </td>
                        <td class="text-right" v-if="userRole == 1">
                          <span class="col-md-4 q-gutter-sm">
                            <q-btn
                              @click="
                                trigerView(customer.id);
                                viewCustomer = true;
                                isVisible = true;
                              "
                              size="10px"
                              label="View"
                              class="bg-green text-white"
                            />
                            <q-btn
                              @click="
                                trigerEdit(customer.id);
                                editCustomer = true;
                              "
                              size="10px"
                              label="Edit"
                              class="bg-primary text-white"
                            />
                            <q-btn
                              @click="trigerDelete(customer.id)"
                              size="10px"
                              label="Delete"
                              :disabled="deleteBtnLoading"
                              class="bg-red-10 text-white"
                            >
                             
                            </q-btn>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                  <div v-else class="q-pa-md bg-info">
                    <p class="text-center q-mt-md text-h6">
                      No data available yet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-dialog
          v-model="viewCustomer"
          style="width: 580px; max-height: 50vh;"
        >
          <q-card>
            <q-toolbar>
              <q-toolbar-title
                ><span class="text-weight-bold"
                  >Customer Details</span
                ></q-toolbar-title
              >
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-list style="width: 500px;">
                <q-expansion-item
                  popup
                  icon="fas fa-users"
                  label="Customer Name"
                  class="text-weight-bold"
                >
                  <q-separator />
                  <q-card>
                    <q-card-section>
                      <p class="text-h6 text-center">
                        {{ singleCustomer.name }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item
                  popup
                  color="primary"
                  icon="fas fa-chalkboard-teacher"
                  label="Customer Category"
                  class="text-weight-bold"
                  caption="Description"
                >
                  <q-separator />
                  <q-card>
                    <q-card-section>
                      <p class="text-h6 text-center">
                        {{ singleCustomer.category }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item
                  class="text-weight-bold"
                  popup
                  icon="fas fa-arrow-circle-right"
                  label="Service Provided"
                >
                  <q-separator />
                  <q-card>
                    <q-card-section>
                      <p class="text-h6 text-center">
                        {{ singleCustomer.service_provided }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item
                  class="text-weight-bold"
                  popup
                  icon="fas fa-arrow-circle-right"
                  label="Payment Interval"
                >
                  <q-separator />
                  <q-card>
                    <q-card-section>
                      <p class="text-h6 text-center">
                        {{ singleCustomer.payment_interval }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item
                  popup
                  class="text-weight-bold"
                  icon="fas fa-arrow-circle-right"
                  label="Current Billing Date"
                >
                  <q-separator />
                  <q-card>
                    <q-card-section>
                      <p class="text-h6 text-center">
                        {{ billingDate }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item
                  popup
                  class="text-weight-bold"
                  icon="fas fa-arrow-circle-right"
                  label="Payment Status"
                >
                  <q-separator />
                  <q-card>
                    <q-card-section>
                      <p class="text-h6">
                        {{ singleCustomer.payment_status }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-card-section>
            <q-inner-loading :showing="isVisible">
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </q-card>
        </q-dialog>
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
      visible: false,
      deleteBtnLoading: false,
      tempCate: "",
      isVisible: false,
      editMode: false,
      category: ["Corporate Institution", "others"],
      customerType: false,
      viewCustomer: false,
      billingDate: "",
      editCustomer: false,
      paymentInterval: [
        "Daily",
        "Weekly",
        "1 Month",
        "2 Months",
        "3 Months",
        "4 Months",
        "5 Months",
        "6 Months",
        "7 Months",
        "8 Months",
        "9 Months",
        "10 Months",
        "11 Months",
        "12 Months"
      ],
      tempPayment: "",
      specifyType: "",
      searchCustomers: "",
      customers: "",
      singleCustomer: "",
      customersFormData: {
        id: "",
        name: "",
        category: "",
        service_provided: "",
        payment_interval: "",
        current_billing_date: ""
      },
      loading: false,
    };
  },
  methods: {
    loadCustomers() {
      this.axios
        .get("customer/all")
        .then(res => {
          //console.log(res.data.data);
          this.$store.commit("storeCustomers", res.data.data);
          this.customers = this.$store.getters.customers;
        })
        .catch(err => {
          console.log(err);
        });
    },
    mergeVal() {
      this.customersFormData.category = this.specifyType;
    },
    loadSingleCustomerFromStore(id) {
      let customersArr = this.$store.getters.customers;
      let oneCustomer = customersArr.find(function(params, index) {
        if (params.id == id) {
          return true;
        }
      });
      this.singleCustomer = oneCustomer;
      console.log(oneCustomer);
    },
    loadSingleCustomerFromServer(id) {
      this.axios
        .get("customer/single/" + id)
        .then(res => {
          this.singleCustomer = res.data.data;
          console.log(this.singleCustomer);
        })
        .catch(err => {
          console.log(err);
        });
    },
    modeCheck() {
      if (this.editMode) {
        this.updateCustomer();
      }
      if (!this.editMode) {
        this.createCustomer();
      }
    },
    trigerView(id) {
      this.axios
        .get("customer/single/" + id)
        .then(res => {
          console.log(res.data.status);
          if (res.data.status.success) {
            this.singleCustomer = res.data.data;
            this.billingDate = date.formatDate(
              this.singleCustomer.current_billing_date,
              "DD MMM YYYY"
            );
            if (this.singleCustomer) {
              this.isVisible = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    trigerEdit(id) {
      this.loadSingleCustomerFromStore(id);
      this.customersFormData.id = id;
      if (this.singleCustomer.category === "Corporate Institution") {
        this.tempCate = this.singleCustomer.category;
        this.customerType = false;
        this.customersFormData.category = this.tempCate;
      } else {
        this.tempCate = "others";
        this.customerType = true;
        this.specifyType = this.singleCustomer.category;
        this.customersFormData.category = this.specifyType;
      }
      this.customersFormData.name = this.singleCustomer.name;
      this.customersFormData.service_provided = this.singleCustomer.service_provided;
      this.customersFormData.payment_interval = this.singleCustomer.payment_interval;
      this.customersFormData.current_billing_date = this.singleCustomer.current_billing_date;

      this.editMode = true;
    },
    updateCustomer() {
      this.loading = true;
      this.axios
        .put("customer/update/" + this.customersFormData.id,
          this.customersFormData
        )
        .then(res => {
          this.loading = false;
          if (res.data.status.success) {
            console.log(res.data);
            this.loadCustomers();
            this.$q.notify({
              message: "Customers Edited Successfullyy",
              position: "top",
              type: "positive"
            });
            this.editMode = false;
            this.customersFormData.name = null;
            this.customersFormData.category = null;
            this.tempCate = null;
            this.customersFormData.service_provided = null;
            this.customersFormData.payment_interval = null;
            this.customersFormData.name = null;
            this.customersFormData.current_billing_date = null;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },

    trigerDelete(id) {
      this.deleteBtnLoading = true;
      this.axios
        .delete("customer/delete/" + id)
        .then(res => {
          this.deleteBtnLoading = false;

          //console.log(res);
          if (res.data.success) {
            this.$q.notify({
              message: "Record deleted successfully",
              position: "top",
              type: "positive"
            });

          }
          this.loadCustomers();
        })
        .catch(err => {
          console.log(err);
          this.deleteBtnLoading = false;

          if(err.response.status == 410){
            document.location.reload(true);
          }
        });
    },
    createCustomer() {
      this.loading =  true;
      //console.log("hello form create new customers");
      this.axios
        .post("customer/store", this.customersFormData)
        .then(res => {
          this.loading = false;
          if (res.error) {
            this.$q.notify({
              message: "Opps something went wrong",
              position: "top",
              type: "negative"
            });
          }
          if (res.status) {
            (this.customersFormData.name = null),
              (this.customersFormData.category = null),
              (this.tempCate = null),
              (this.customersFormData.service_provided = null),
              (this.customersFormData.payment_interval = null),
              (this.customersFormData.name = null),
              (this.customersFormData.current_billing_date = null),
              this.$q.notify({
                message: "Customer Created Successfullyy",
                position: "top",
                type: "positive"
              });
            this.loadCustomers();
          }
        })
        .catch(res => {
          this.$q.notify({
            message: "Opps something went wrong",
            position: "top",
            type: "negative"
          });
        });
    },
    getOthers() {
      console.log("hello get cate");
      if (this.tempCate === "Corporate Institution") {
        this.customerType = false;
        this.customersFormData.category = this.tempCate;
        console.log(this.customersFormData.category);
      }
      if (this.tempCate === "others") {
          this.customerType = true;
      }
    }
  },
  created() {
    this.loadCustomers();
  },
  mounted() {
    this.getOthers();
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
