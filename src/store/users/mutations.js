export function register( /* state */ ) {

}
export function login( /* state */ ) {}

export function logout( /* state */ ) {}

/* Auth **/
export function authenticateUser(state, userData) {
  state.auth.username = userData.username,
    state.auth.email = userData.email
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
  console.log(data)
  state.customers.customerArr = data;
}
