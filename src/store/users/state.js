export default function () {

  return {

    auth: {
      isLogin: false,
      authorizeUser: false,
      loadingBtn: true,
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
