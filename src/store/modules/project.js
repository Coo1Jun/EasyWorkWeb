
const getDefaultState = () => {
  return {
    projectInfo: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_CUR_PROJECT: (state, data) => {
    state.projectInfo = data
  }
}

const actions = {

  // 设置当前所选项目的id
  setCurProject({ commit }, projectInfo) {
    commit('SET_CUR_PROJECT', projectInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

