const state = {
  userId: '',
  roleName: ''
}
const actions = {}
const mutations = {
  SET_USER_ID(state, userId) {
    state.userId = userId
  },
  SET_USER_NAME(state, roleName) {
    state.roleName = roleName
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
