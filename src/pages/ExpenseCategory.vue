<template>
  <div class="content-centered">
    <div
      class="q-my-lg row q-gutter-lg"
      style="width: 100%; margin: 1rem auto;"
    >
      <div class="col-md-3">
        <q-form @submit.prevent="modeCheck">
          <q-card>
            <q-card-section>
              <q-input
                outlined
                type="text"
                v-model.trim="category.name"
                label="Category Name"
                :rules="[
                  val => (val && val.length > 0) || 'This field is required'
                ]"
              />
              <q-input
                outlined
                type="text"
                v-model="category.description"
                label="Description"
              />

              <br />
              <q-btn
                v-if="editMode"
                label="Edit Category"
                type="submit"
                class="full-width bg-primary text-white"
              />
              <q-btn
                v-else
                label="Create New Category"
                type="submit"
                class="full-width bg-primary text-white"
              />
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <div class="col-md-6">
        <q-card>
          <q-card-section>
            <!-- my custom table -->
            <div class="table wrapper">
              <div class="table-header">
                <p class="table-title text-primary medium-text">
                  Expense Category
                </p>
                <div class="sort-table">
                  <q-input
                    dense
                    outlined
                    type="text"
                    v-model.trim="searchCategory"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div class="table-data">
                <q-separator class="q-my-sm" />
                <!-- your main table data starts here -->
                <div class="main-data">
                  <q-markup-table v-if="categories.length">
                    <thead>
                      <tr>
                        <th class="text-left text-weight-bold">
                          Category Name
                        </th>
                        <th class="text-center text-weight-bold">
                          Description
                        </th>
                        <th class="text-right text-weight-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="category in categories" :key="category.id">
                        <td class="text-left">{{ category.name }}</td>
                        <td class="text-center">{{ category.description }}</td>
                        <td class="text-right">
                          <span class="col-md-4 q-gutter-sm">
                            <q-btn
                              @click="
                                trigerEdit(category.id);
                                editCategory = true;
                              "
                              size="10px"
                              label="Edit"
                              class="bg-primary text-white"
                            />
                            <q-btn
                              @click="trigerDelete(category.id)"
                              size="10px"
                              label="Delete"
                              class="bg-red-10 text-white"
                            />
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
      </div>
    </div>
  </div>
</template>
<script>
import * as store from "../store/users";
// import axios from "axios";
import { Cookies } from "quasar";
import { date } from "quasar";
import { Notify } from "quasar";
export default {
  data() {
    return {
      isVisible: false,
      editMode: false,
      categories: "",
      editCategory: false,
      searchCategory: "",
      singleCategory: "",
      category: {
        id: "",
        name: "",
        description: ""
      }
    };
  },
  methods: {
    loadCategories() {
      this.axios
        .get("expense-category/all")
        .then(res => {
          console.log(res.data.data);
          this.categories = res.data.data;
          this.$store.commit("storeExpenseCategory", res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },

    loadSingleCategoryFromStore(id) {
      let categoryArr = this.$store.getters.ExCategories;
      let oneCategory = categoryArr.find(function(params, index) {
        if (params.id == id) {
          return true;
        }
      });
      this.singleCategory = oneCategory;
      console.log(oneCategory);
    },

    modeCheck() {
      if (this.editMode) {
        this.updateCategory();
      }
      if (!this.editMode) {
        this.createCategory();
      }
    },
    trigerEdit(id) {
      this.loadSingleCategoryFromStore(id);
      this.category.id = id;
      this.category.name = this.singleCategory.name;
      this.category.description = this.singleCategory.description;
      this.editMode = true;
    },
    updateCategory() {
      this.axios
        .put(
          "expense-category/update/" + this.category.id,this.category)
        .then(res => {
          if (res.status == 200) {
            console.log(res.data);
            this.loadCategories();
            this.$q.notify({
              message: "Category Edited Successfullyy",
              position: "top",
              type: "positive"
            });
            this.editMode = false;
            this.category.name = null;
            this.category.description = null;
          }
        })
        .catch(err => {
          console.log(err.response);
             this.$q.notify({
              message: "Opps.. something went wrong!",
              position: "top",
              type: "negative"
            });
        });
    },
    trigerDelete(id) {
      this.axios
        .delete("expense-category/delete/" + id)
        .then(res => {
          //console.log(res);
          if (res.data.success) {
            this.loadCategories()
            this.$q.notify({
              message: "Record deleted successfully",
              position: "top",
              type: "positive"
            });

          }
        })
        .catch(err => {
          console.log(err);
          this.$q.notify({
            message: "Opps something went wrong!! ",
            position: "top",
            type: "negative"
          });
        });
    },
    createCategory() {
      //console.log("hello form create new customers");
      this.axios
        .post("expense-category/store", this.category)
        .then(res => {
          if (res.error) {
            this.$q.notify({
              message: "Opps something went wrong",
              position: "top",
              type: "negative"
            });
          }
          if (res.status) {
              this.editMode = false;
              this.category.name = null;
              this.category.description = null;
              this.$q.notify({
                message: "Category Created Successfully",
                position: "top",
                type: "positive"
              });
            this.loadCategories();
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
  },
  created() {
    this.loadCategories();
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

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 1rem;
}
</style>
