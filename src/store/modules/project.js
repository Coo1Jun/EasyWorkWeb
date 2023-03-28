
const getDefaultState = () => {
  return {
    projectInfo: null,
    defaultStates: ['新建', '开发中', '已完成', '关闭'],
    TaskStates: ['新建', '开发中', '已完成', '已取消'],
    BugStates: ['新建', '复现中', '进行中', '已完成', '未复现']
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

