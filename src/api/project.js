import request from '@/utils/request'

/**
 * 新建项目
 * @param {*} data 项目信息
 * @returns
 */
export function addProjectApi(data) {
  return request({
    url: '/api/ew-project/project',
    method: 'post',
    data
  })
}

export function getProjectListApi(params) {
  return request({
    url: '/api/ew-project/project/list',
    method: 'get',
    params
  })
}
