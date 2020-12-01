export default function () {

  return {

    auth: {
      isLogin: false,
      id: null,
      username: null,
      email: null,
      role: null,
      gender: null,
    },

    expenses: {
      expenseCategories: null,
      expensesData: null,
      errorMsg: false
    },

    expenseCategory: {
      data: ""
    },

    // income: {
    //   incomeData: "",
    //   Customers: "",
    //   errorMsg: false
    // },

    opening_bal: {
      id: null,
      amount: null,
      date_created: null,
    },

    customers: {
      customerArr: "",
    },

    income: {
      data: ""
    }



  }
}
