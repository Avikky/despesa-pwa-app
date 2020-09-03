export function newUser(state) {
  let loginDetail = {
    username: state.auth.username,
    email: state.auth.email
  }
  return loginDetail;
}
export function getAdmin(state) {

  return state.auth.authorizeGenAdmin;

}
