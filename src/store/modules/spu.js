const state = {
  spuId: ""
};
const actions = {};
const mutations = {
  SET_SPU_ID(state, spuId) {
    state.spuId = spuId;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
