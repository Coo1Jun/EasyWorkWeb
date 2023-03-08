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

export function sendVerifyCode(email) {
  return request({
    url: '/api/ew-server/user/register/sendVerifyCode',
    method: 'get',
    params: {
      email
    }
  })
}

export function register(data) {
  return request({
    url: '/api/ew-server/user/register',
    method: 'post',
    data
  })
}
