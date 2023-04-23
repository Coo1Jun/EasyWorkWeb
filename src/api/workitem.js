import request from '@/utils/request'

/**
 * 添加工作项
 * @param {*} data
 * @returns
 */
export function addWorkItemApi(data) {
  return request({
    url: '/api/ew-project/workitem',
    method: 'post',
    data
  })
}

/**
 * 添加计划集
 * @param {*} data
 * @returns
 */
export function addPlansApi(data) {
  return request({
    url: '/api/ew-project/workitem/plans',
    method: 'post',
    data
  })
}

/**
 * 根据项目id查询所有计划集
 * @param {*} params
 * @returns
 */
export function getPlansApi(params) {
  return request({
    url: '/api/ew-project/workitem/plans/list',
    method: 'get',
    params
  })
}

/**
 * 根据项目id和Epic的id查询所有工作项
 * @param {*} params
 * @returns
 */
export function getWorkItemListApi(params) {
  return request({
    url: '/api/ew-project/workitem/list',
    method: 'get',
    params
  })
}

/**
 * 根据项目id和Epic的id查询所有工作项的树形结构数据
 * @param {*} params
 * @returns
 */
export function getWorkItemTreeApi(params) {
  return request({
    url: '/api/ew-project/workitem/tree',
    method: 'get',
    params
  })
}

/**
 * 根据项目id和EpicId获取参与项目工作的用户基本信息
 * @param {*} params
 * @returns
 */
export function getWorkItemUserListApi(params) {
  return request({
    url: '/api/ew-project/workitem/user/list',
    method: 'get',
    params
  })
}

/**
 * 根据项目id和EpicId，计算工作项统计信息
 * @param {*} params
 * @returns
 */
export function getWorkItemStatisticsApi(params) {
  return request({
    url: '/api/ew-project/workitem/statistics',
    method: 'get',
    params
  })
}

/**
 * 修改工作项信息
 * @param {*} params
 * @returns
 */
export function editWorkItemApi(data) {
  return request({
    url: '/api/ew-project/workitem',
    method: 'put',
    data
  })
}

/**
 * 根据id获取工作项信息
 * @param {*} params
 * @returns
 */
export function getWorkItemByIdApi(params) {
  return request({
    url: `/api/ew-project/workitem/one`,
    method: 'get',
    params
  })
}

/**
 * 根据id删除工作项信息
 * @param {*} params
 * @returns
 */
export function deleteWorkItemByIdApi(id) {
  return request({
    url: `/api/ew-project/workitem/fstb/${id}`,
    method: 'delete'
  })
}

/**
 * 根据id删除工作项信息
 * @param {*} params
 * @returns
 */
export function deletePlanByIdApi(id) {
  return request({
    url: `/api/ew-project/workitem/pe/${id}`,
    method: 'delete'
  })
}

/**
 * 根据工作项id获取子工作项
 * @returns
 */
export function getSubWorkItemApi(parentId) {
  return request({
    url: `/api/ew-project/workitem/sub/${parentId}`,
    method: 'get'
  })
}

/**
 * 获取用户已经延期的工作项
 * @returns
 */
export function getDelayedWorkItemApi() {
  return request({
    url: `/api/ew-project/workitem/delayed`,
    method: 'get'
  })
}

/**
 * 获取用户即将延期的工作项（截止日期小于三天）
 * @returns
 */
export function getNearDelayWorkItemApi() {
  return request({
    url: `/api/ew-project/workitem/near/delay`,
    method: 'get'
  })
}

