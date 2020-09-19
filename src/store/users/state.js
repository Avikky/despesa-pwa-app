export default function () {
  return {
    auth: {
      authorizeUser: false,
      authorizeGenAdmin: false,
      authorizeAdmin2: false,
      loadingBtn: true,
      username: null,
      email: null,
    },
    expenses: {
      expenseCategories: null,
      expensesData: null,
      errorMsg: false
    },
    income: {
      incomeData: "",
      Customers: "",
      errorMsg: false
    },
    opening_bal: {
      id: null,
      amount: null,
      date_created: null,
    },
    customers: {
      customerArr: "",
    }
  }
}
