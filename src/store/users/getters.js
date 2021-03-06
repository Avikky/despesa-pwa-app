export function newUser(state) {
	let loginDetail = {
		username: state.auth.username,
		email: state.auth.email
	};
	return loginDetail;
}

export function getAuthUser(state) {
	let userDetails = {
		id: state.auth.id,
		username: state.auth.username,
		email: state.auth.email,
		phone: state.auth.phone,
		gender: state.auth.gender,
		role: state.auth.role
	};
	return userDetails;
}

export function getAdmin(state) {
	return state.auth.authorizeGenAdmin;
}

export function expenses(state) {
	return state.expenses.expensesData;
	// if (state.expenses.expenseData) {
	//   return state.expense.expenseData;
	// }else{
	//   return 'no expense data'
	// }
}

export function expenseCategory(state) {
	if (state.expenses.errorMsg == false) {
		return state.expenses.expenseCategories;
	} else {
		return state.expense.errorMsg;
	}
}

export function customers(state) {
	//console.log(state.customers);
	return state.customers.customerArr;
}

export function ExCategories(state) {

  return state.expenseCategory.data;
}


export function income(state) {
	//console.log(state.income.data);
	return state.income.data;
}
