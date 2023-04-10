import { allColumnList } from '@/utils/map.js'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
  userInfo: state => state.user.userInfo,
  curProject: state => state.project.projectInfo,
  defaultStates: state => state.project.defaultStates,
  TaskStates: state => state.project.TaskStates,
  BugStates: state => state.project.BugStates,
  // 表格显示列
  selectedColumnList: (state) =>
    state.fileList.selectedColumnList === null
      ? allColumnList
      : state.fileList.selectedColumnList.split(','),
  // 文件查看模式
  fileModel: (state) =>
    state.fileList.fileModel === null ? 0 : Number(state.fileList.fileModel)
}
export default getters
