import request from '@/utils/request'

/**
 * 获取用户自己创建的项目组
 * @param {*} params
 * @returns
 */
export function getCreatedGroupListApi(params) {
  return request({
    url: '/api/ew-project/group/created',
    method: 'get',
    params
  })
}

/**
 * 获取用户加入的项目组，不包括自己创建的
 * @param {*} params
 * @returns
 */
export function getJoinedGroupListApi(params) {
  return request({
    url: '/api/ew-project/group/joined',
    method: 'get',
    params
  })
}

/**
 * 获取用户加入的项目组，包括自己创建的
 * @param {*} params
 * @returns
 */
export function getGroupListApi(params) {
  return request({
    url: '/api/ew-project/group/list',
    method: 'get',
    params
  })
}

export function addGroupApi(data) {
  return request({
    url: '/api/ew-project/group',
    method: 'post',
    data
  })
}

export function editGroupApi(data) {
  return request({
    url: '/api/ew-project/group',
    method: 'put',
    data
  })
}

/**
 * 获取项目组成员列表
 */
export function getMemberListApi(params) {
  return request({
    url: '/api/ew-project/group/member/list',
    method: 'get',
    params
  })
}
