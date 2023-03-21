
const getDefaultState = () => {
  return {
    proId: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_CUR_PROJECT: (state, data) => {
    state.proId = data
  }
}

const actions = {

  // 设置当前所选项目的id
  setCurProject({ commit }, proId) {
    commit('SET_CUR_PROJECT', proId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

