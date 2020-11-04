export function register( /* state */ ) {

}
export function login( /* state */ ) {}

export function logout(state, params) {
  state.auth.isLogin = false,
  state.auth.id =  null,
  state.auth.username = null,
  state.auth.email = null,
  state.auth.phone = null,
  state.auth.role = null,
  state.auth.gender = null
}

/* Auth **/
export function authenticateUser(state, userData) {
  state.auth.isLogin = userData.isLogin,
  state.auth.id =  userData.id,
  state.auth.username = userData.username,
  state.auth.email = userData.email,
  state.auth.phone = userData.phone,
  state.auth.role = userData.role,
  state.auth.gender = userData.gender
}


export function checkIfAdmin(state, context) {
  if (context.role === 3) {
    state.auth.authorizeUser = true;
  }
  if (context.role === 2) {
    state.auth.authorizeAdmin2 = true;
  }
  if (context.role === 1) {
    state.auth.authorizeGenAdmin = true;
  }
}

export function checkError(state, data) {
  if (data.type == 'expenseCategory') {
    state.expenses.errorMsg = true;
  }
}

export function allExpenses(state, data) {
  state.expenses.expensesData = data.expenses;
}

export function allExpensesCategory(state, data) {
  state.expenses.expenseCategories = data.expense_category
}

export function openingBalance(state, data) {
  state.opening_bal.id = data.id;
  state.opening_bal.amount = data.amount;
  state.opening_bal.date_created = data.date_created;
}

export function storeCustomers(state, data) {
  state.customers.customerArr = data;
}

export function storeIncome(state, data) {
  console.log(data)
  state.income.data = data;
}
