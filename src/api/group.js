import request from '@/utils/request'

export function getGroupListApi(params) {
  return request({
    url: '/api/ew-project/group/created',
    method: 'get',
    params
  })
}

export function getJoinedGroupListApi(params) {
  return request({
    url: '/api/ew-project/group/joined',
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
