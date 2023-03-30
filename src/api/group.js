import request from '@/utils/request'

export function getGroupListApi(params) {
  return request({
    url: '/api/ew-project/group/all',
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
