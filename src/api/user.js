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
    url: '/api/ew-server/user/change/forgot',
    method: 'put',
    data
  })
}

export function editUserInfo(data) {
  return request({
    url: '/api/ew-server/user',
    method: 'put',
    data
  })
}

export function editPassword(data) {
  return request({
    url: '/api/ew-server/user/edit/password',
    method: 'put',
    data
  })
}

export function editEmail(data) {
  return request({
    url: '/api/ew-server/user/edit/email',
    method: 'put',
    data
  })
}

