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
