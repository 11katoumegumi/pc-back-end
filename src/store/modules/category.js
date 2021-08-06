import {
  reqGetCategory1List,
  reqGetCategory2List,
  reqGetCategory3List
} from '../../api/product/category'
const state = {
  category1Id: '',
  category1List: [],
  category2Id: '',
  category2List: [],
  category3Id: '',
  category3List: []
}

const actions = {
  async getCategory1List({ commit }) {
    const res = await reqGetCategory1List()
    commit('GET_CATEGORY1_LIST', res)
  },
  async getCategory2List({ commit }, category1Id) {
    const res = await reqGetCategory2List(category1Id)
    commit('GET_CATEGORY2_LIST', { res, category1Id })
  },
  async getCategory3List({ commit }, category2Id) {
    const res = await reqGetCategory3List(category2Id)
    commit('GET_CATEGORY3_LIST', { res, category2Id })
  }
}
const mutations = {
  GET_CATEGORY1_LIST(state, res) {
    state.category1List = res
  },
  GET_CATEGORY2_LIST(state, { res, category1Id }) {
    state.category2List = res
    state.category1Id = category1Id
    //清空数据
    state.category3List = []
    state.category2Id = ''
    state.category3Id = ''
  },
  GET_CATEGORY3_LIST(state, { res, category2Id }) {
    state.category3List = res
    state.category2Id = category2Id
    state.category3Id = ''
  },
  SET_CATEGORY3_ID(state, category3Id) {
    state.category3Id = category3Id
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
