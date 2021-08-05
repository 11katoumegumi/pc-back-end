const state = {
  spuId: "",
  isUpdate: false
};
const actions = {};
const mutations = {
  SET_SPU_ID(state, spuId) {
    state.spuId = spuId;
  },
  SET_ISUPDATE(state, isUpdate) {
    state.isUpdate = isUpdate;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
