<template>
  <div class="content-centered">
    <div class="banner gt-sm">
      <div class="banner-inner">
        <div class="date">
          <span class="day big-text q-pr-lg">{{ openingBal.day }}</span>
          <span class="month medium-text">{{ openingBal.month }}</span>
        </div>
        <div class="balance">
          <span class="naira-sign medium-text" v-html="nairaSign"></span>
          <span class="amount big-text">{{
            formatNumber(openingBal.amount)
          }}</span>
        </div>
        <div class="crudBtn q-gutter-md">
          <q-btn
            @click="responseDialog = true"
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
          <q-btn
            round
            color="red"
            icon="fas fa-trash"
            @click="deleteResponse = true"
          />
        </div>
      </div>
      <!-- Dialog for adding and editting Opening Balance -->
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px" v-if="!editMode">
          <q-card-section>
            <div class="text-h6">Add Opening Balance</div>
          </q-card-section>
          <q-form @submit.prevent="createOpeningBal">
            <q-card-section class="q-pt-none">
              <q-input
                dense
                type="number"
                v-model="balanceFormData.amount"
                autofocus
                placeholder="Amount"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                dense
                placeholder="Date"
                type="date"
                v-model="balanceFormData.date_created"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Add" type="submit" />
              <q-btn flat label="Cancle" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-card>
        <!-- if in Edit Mode -->
        <q-card style="min-width: 350px" v-if="editMode">
          <q-card-section>
            <div class="text-h6">Edit Opening Balance</div>
          </q-card-section>
          <q-form @submit.prevent="editOpeningBal">
            <q-card-section class="q-pt-none">
              <q-input
                dense
                placeholder="Amount"
                type="number"
                v-model.trim="openingBal.amount"
                autofocus
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Edit" type="submit" />
              <q-btn
                flat
                label="Cancle"
                @click="editMode = false"
                v-close-popup
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- Dialog to display option for balace brought down -->
      <q-dialog
        v-model="responseDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-blue-12 text-white" style="width: 430px">
          <q-card-section>
            <div class="text-h6">Before you Proceed</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Would you like to use this Remaining Balance...?
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-blue-12">
            <q-btn
              flat
              label="Yes, use balance"
              @click="
                dateReponseModal = true;
                responseDialog = false;
              "
            />
            <q-btn
              flat
              label="No, Add new balance"
              @click="
                prompt = true;
                responseDialog = false;
              "
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Dialog for deleting Opening balance -->
      <q-dialog
        v-model="deleteResponse"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-red-12 text-white" style="width: 430px">
          <q-card-section>
            <div class="text-h6 text-center">
              <i class="fas fa-exclamation-triangle"></i> Warning
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none text-center">
            Are you sure about this..?
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-blue-12">
            <q-btn flat label="Yes" @click="deleteBal(openingBal.id)" />
            <q-btn flat label="Cancle" @click="deleteResponse = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Date Response Modal Dialog -->
      <q-dialog
        v-model="dateReponseModal"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 430px">
          <q-card-section>
            <div class="text-weight-formatDateer">
              Please Enter the Date to be used for this opening balance
            </div>
          </q-card-section>
          <q-form @submit.prevent="balanceBroughtDown">
            <q-card-section class="q-pt-none">
              <q-input
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
                dense
                type="date"
                v-model="balanceFormData.date_created"
              />
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-blue-12">
              <q-btn flat label="submit" type="submit" />
              <q-btn
                flat
                label="cancle"
                @click="
                  closeAllModal();
                  dateReponseModal = false;
                "
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
    <div class="small-banner lt-md">
      <div class="small-banner-inner">
        <div class="date q-mr-lg">
          <span class="day small-medium-text q-pr-sm">{{ openingBal.day }}</span>
          <span class="month small-medium-text  q-pr-lg">{{ openingBal.month }}</span>
        </div>
        <div class="small-balance">
          <span class="naira-sign small-medium-text" v-html="nairaSign"></span>
          <span class="amount small-big-text">{{
            formatNumber(openingBal.amount)
          }}</span>
        </div>
        <br>
        <div class="crudBtn q-gutter-md">
          <q-btn
            @click="responseDialog = true"
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
          <q-btn
            round
            color="red"
            icon="fas fa-trash"
            @click="deleteResponse = true"
          />
        </div>
      </div>
      <!-- Dialog for adding and editting Opening Balance -->
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px" v-if="!editMode">
          <q-card-section>
            <div class="text-h6">Add Opening Balance</div>
          </q-card-section>
          <q-form @submit.prevent="createOpeningBal">
            <q-card-section class="q-pt-none">
              <q-input
                dense
                type="number"
                v-model="balanceFormData.amount"
                autofocus
                placeholder="Amount"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                dense
                placeholder="Date"
                type="date"
                v-model="balanceFormData.date_created"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Add" type="submit" />
              <q-btn flat label="Cancle" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-card>
        <!-- if in Edit Mode -->
        <q-card style="min-width: 350px" v-if="editMode">
          <q-card-section>
            <div class="text-h6">Edit Opening Balance</div>
          </q-card-section>
          <q-form @submit.prevent="editOpeningBal">
            <q-card-section class="q-pt-none">
              <q-input
                dense
                placeholder="Amount"
                type="number"
                v-model.trim="openingBal.amount"
                autofocus
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Edit" type="submit" />
              <q-btn
                flat
                label="Cancle"
                @click="editMode = false"
                v-close-popup
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- Dialog to display option for balace brought down -->
      <q-dialog
        v-model="responseDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-blue-12 text-white" style="width: 430px">
          <q-card-section>
            <div class="text-h6">Before you Proceed</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Would you like to use this Remaining Balance...?
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-blue-12">
            <q-btn
              flat
              label="Yes, use balance"
              @click="
                dateReponseModal = true;
                responseDialog = false;
              "
            />
            <q-btn
              flat
              label="No, Add new balance"
              @click="
                prompt = true;
                responseDialog = false;
              "
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Dialog for deleting Opening balance -->
      <q-dialog
        v-model="deleteResponse"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-red-12 text-white" style="width: 430px">
          <q-card-section>
            <div class="text-h6 text-center">
              <i class="fas fa-exclamation-triangle"></i> Warning
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none text-center">
            Are you sure about this..?
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-blue-12">
            <q-btn flat label="Yes" @click="deleteBal(openingBal.id)" />
            <q-btn flat label="Cancle" @click="deleteResponse = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Date Response Modal Dialog -->
      <q-dialog
        v-model="dateReponseModal"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="width: 430px">
          <q-card-section>
            <div class="text-weight-formatDateer">
              Please Enter the Date to be used for this opening balance
            </div>
          </q-card-section>
          <q-form @submit.prevent="balanceBroughtDown">
            <q-card-section class="q-pt-none">
              <q-input
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
                dense
                type="date"
                v-model="balanceFormData.date_created"
              />
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-blue-12">
              <q-btn flat label="submit" type="submit" />
              <q-btn
                flat
                label="cancle"
                @click="
                  closeAllModal();
                  dateReponseModal = false;
                "
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
    <div class="q-my-lg row q-gutter-lg" style="width: 100%; margin: 1rem auto; gt-sm">
      <div class="col-md-3 gt-sm">
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
      <div class="col-md-8 gt-sm">
        <q-card>
          <q-card-section>
            <!-- my custom table -->
            <div class="table wrapper">
              <div class="table-header">
                <p class="table-title text-primary medium-text">
                  Expense Record
                </p>

                <div class="sort-table row q-gutter-sm">
                     <q-btn-dropdown color="primary" glossy icon="sort">
                      <q-list>
                        <q-item clickable v-close-popup @click="searchByDate">
                          <q-item-section>
                            <q-item-label>Search by date</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item clickable v-close-popup @click="searchByTitle">
                          <q-item-section>
                            <q-item-label>Search by title</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                    <input
                      class="searchIn"
                      ref="searchInput"
                      v-on:blur="nuliffySearch"
                      dense
                      required
                      outlined
                      type="text"
                      v-model.trim="searchExpense"
                      placeholder="Search"
                    />
                    <q-btn
                      icon="fas fa-search"
                      color="blue-12"
                      @click="searchFilter"
                     />
                </div>
              </div>
              <div class="table-data">
                <q-separator class="q-my-sm" />
                <!-- your main table data starts here -->
                <div class="main-data">
                  <q-markup-table v-if="expenses.length || searchResults.length">
                    <thead>
                      <tr>
                        <th class="text-left text-weight-formatDateer">
                          Title
                        </th>
                        <th class="text-right text-weight-formatDateer">
                          Amount
                        </th>
                        <th class="text-center text-weight-formatDateer">
                          Description
                        </th>
                        <th class="text-center text-weight-formatDateer">
                          Date
                        </th>
                        <th class="text-center text-weight-formatDate">
                          Made by
                        </th>
                        <th class="text-center text-weight-formatDate">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="searchResults.length || searchMsg.length">
                      <tr v-for="result in searchResults" :key="result.id">
                        <td class="text-left">{{ result.title }}</td>

                        <td class="text-right">&#8358; {{ result.amount }}</td>
                        <td class="text-center">{{ result.description }}</td>
                        <td class="text-center">{{ result.date_of_expense }}</td>
                        <td class="text-center">{{ result.made_by }}</td>
                        <td class="text-right">
                          <span class="col-md-4 q-gutter-sm">
                            <!-- <q-btn
                              size="10px"
                              label="edit"
                              type="submit"
                              class="bg-primary text-white"
                            /> -->
                            <q-btn
                              @click="trigerDelete(result.id, result.amount)"
                              size="10px"
                              label="delete"
                              type="submit"
                              class="bg-red-10 text-white"
                            />
                          </span>
                        </td>
                      </tr>
                       <p v-if="searchMsg.length" class="text-center q-mt-md text-h6">
                        {{ searchMsg }}
                      </p>
                      <q-inner-loading :showing="visible">
                        <q-spinner size="50px" color="primary" />
                      </q-inner-loading>
                    </tbody>
                    <tbody v-else>
                      <tr v-for="expense in expenses" :key="expense.id">
                        <td class="text-left">{{ expense.title }}</td>

                        <td class="text-right">&#8358; {{ expense.amount }}</td>
                        <td class="text-center">{{ expense.description }}</td>
                        <td class="text-center">{{ expense.date_of_expense }}</td>
                        <td class="text-center">{{ expense.made_by }}</td>
                        <td class="text-right">
                          <span class="col-md-4 q-gutter-sm">
                            <!-- <q-btn
                              size="10px"
                              label="edit"
                              type="submit"
                              class="bg-primary text-white"
                            /> -->
                            <q-btn
                              @click="trigerDelete(expense.id, expense.amount)"
                              size="10px"
                              label="delete"
                              type="submit"
                              class="bg-red-10 text-white"
                            />
                          </span>
                        </td>
                      </tr>
                      <q-inner-loading :showing="visible">
                        <q-spinner size="50px" color="primary" />
                      </q-inner-loading>
                    </tbody>

                  </q-markup-table>
                  <div v-else class="q-pa-md bg-info">
                    <p class="text-center q-mt-md text-h6">
                      No Expenses recorded for today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!--- for mobile-->
    <div style="width: 80%; margin: 1rem auto;" class="lt-md">
      <div class="sort-table row q-gutter-sm">
        <q-btn-dropdown color="blue-12" glossy icon="sort">
        <q-list>
          <q-item clickable v-close-popup @click="searchByDate">
            <q-item-section>
              <q-item-label>Search by date</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="searchByTitle">
            <q-item-section>
              <q-item-label>Search by title</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        </q-btn-dropdown>
        <input
          class="searchIn"
          ref="searchInput"
          dense
          outlined
          required
          type="text"
          v-on:blur="nuliffySearch"
          v-model.trim="searchExpense"
          placeholder="Search"
        />
           <q-btn
            icon="fas fa-search"
            color="blue-12"
            @click="searchFilter"
            />
      </div>
      <br>
      <q-card>
        <div v-if="expenses.length || searchResults.length">
          <q-list v-if="searchResults.length || searchMsg.length"  bordered class="rounded-borders">
              <q-expansion-item
                v-for="result in searchResults"
                :key="result.id"
                expand-separator
                icon="fas fa-chart-line"
                :label="result.title"
                :caption="'Made by: '+ result.made_by"
              >
                <q-card>
                  <q-card-section>
                    <div>
                      <p class="q-mt-md text-h6">
                        Description
                      </p>
                      <hr>
                      <p>
                        {{ result.description }}
                      </p>
                      <hr>
                      <p class="q-mt-md text-h6">
                        Amount
                      </p>
                      <p class="text-bold">
                        &#8358; {{ result.amount }}
                      </p>
                      <hr>
                        <q-btn
                          @click="trigerDelete(resutl.id, result.amount)"
                          size="15px"
                          label="Delete"
                          class="bg-red-10 text-white text-center"
                        />
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            <q-card>
              <p v-if="searchMsg" class="text-center q-mt-md text-h6">
                No record found
              </p>
            </q-card>
          </q-list>
          <q-list v-else="expenses.length" bordered class="rounded-borders">
            <q-expansion-item
              v-for="expense in expenses"
              :key="expense.id"
              expand-separator
              icon="fas fa-chart-line"
              :label="expense.title"
              :caption="'Made by: '+ expense.made_by"
            >
              <q-card>
                <q-card-section>
                  <div>
                    <p class="q-mt-md text-h6">
                      Description
                    </p>
                    <hr>
                    <p>
                      {{ expense.description }}
                    </p>
                    <hr>
                    <p class="q-mt-md text-h6">
                      Amount
                    </p>
                    <p class="text-bold">
                      &#8358; {{ expense.amount }}
                    </p>
                    <hr>
                      <q-btn
                        @click="trigerDelete(expense.id, expense.amount)"
                        size="15px"
                        label="Delete"
                        class="bg-red-10 text-white text-center"
                      />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          <q-card>
            <p v-if="searchMsg" class="text-center q-mt-md text-h6">
              No record found
            </p>
          </q-card>
        </q-list>
        </div>
        <div v-else class="q-pa-md bg-info lt-md">
            <p class="text-center q-mt-md text-h6">
              No Expenses recorded for today
          </p>
        </div>
      </q-card>
      <q-page-sticky position="bottom-right" class="lt-md">
        <q-btn class="text-white" to="/add-expense" fab icon="mdi-pencil" color="blue-12" />
      </q-page-sticky>
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
      visible: false,
      isSearch: null,
      searchResults: "",
      searchMsg: "",
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
    searchByDate() {
      let getEl  = document.querySelector('.searchIn')
      getEl.setAttribute('type', 'date');
    },
    searchByTitle() {
      let getEl  = document.querySelector('.searchIn')
      getEl.setAttribute('type', 'text');
    },
    nuliffySearch(){
      this.searchMsg = "";
      this.searchResults = ""
      this.fetchExpenses();
    },
    searchFilter(){
      console.log(this.searchExpense);
       axios
        .post(
          this.baseUrl + "expenses/search", {searchdata: this.searchExpense},
          {
            headers: {
              Accept: "application/json",
              Authorization: "bearer" + Cookies.get("jwt_token")
            }
          }
        )
        .then(res => {
          console.log(res);
          let getEl  = document.querySelector('.searchIn')
          if(getEl.value == ""){
            this.expenses = "";
            this.searchMsg = "";
            this.fetchExpenses();
          }
          if(res.data.status == 200){
            this.searchResults = res.data.data;
          }
          if(res.data.status == 404){
            this.searchResults = "";
            this.searchMsg = res.data.message;
          }
        })
        .catch(err => {
          console.log(err)
        });
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    resetForm() {
      this.$refs.cate.resetValidation();
      this.$refs.by.resetValidation();
      this.$refs.amt.resetValidation();
      this.$refs.title.resetValidation();
      this.$refs.desc.resetValidation();
    },
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
    closeAllModal() {
      this.prompt = false;
      this.responseDialog = false;
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
          this.visible = true;
          if (res.data) {
            this.$store.commit("allExpenses", {
              expenses: res.data
            });
            this.expenses = res.data.data;
            this.visible = false
            //console.log(this.expenses);
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
    }
  },

  created() {
    this.fetchExpenses();
    this.fetchExpensesCategory();
    this.formatNumber();
  },

  mounted() {
    this.closeAllModal();
    this.getId();
    this.loadOpeningBal();
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
.small-banner {
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
  padding: 0.7rem 0.7rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.small-banner-inner {
  padding: 0.5rem 0.5rem;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}
.date {
  margin-right: -1.2rem;
}
.big-text {
  font-size: 2.6rem;
  font-family: Arial, Helvetica, sans-serif;
}
.small-big-text {
  font-size: 1.6rem;
  font-family: Arial, Helvetica, sans-serif;
}
.medium-text {
  font-size: 1.7rem;
  font-family: "Mitr", sans-serif;
  font-weight: 550;
}
.small-medium-text {
  font-size: 1rem;
  font-family: "Mitr", sans-serif;
  font-weight: 550;
}
.amount {
  color: #448aff;
}

.balance {
  border: 1px solid lightgrey;
  padding: 0.5rem 4rem;
  background: #f1f1f1;
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 10px #000000;
}

.small-balance {
  border: 1px solid lightgrey;
  padding: 0.2rem 1rem;
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
