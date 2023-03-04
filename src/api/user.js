import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/ew-server/doLogin',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/ew-server/getCurrentUser',
    method: 'get'
  })
}
