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

export function sendVerifyCode(params) {
  return request({
    url: '/api/ew-server/user/email/sendVerifyCode',
    method: 'get',
    params
  })
}

export function register(data) {
  return request({
    url: '/api/ew-server/user/register',
    method: 'post',
    data
  })
}

export function forgot(data) {
  return request({
    url: '/api/ew-server/user/change/password',
    method: 'post',
    data
  })
}
