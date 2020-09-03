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
