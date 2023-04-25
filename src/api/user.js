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

/**
 * 根据用户id获取用户基本信息
 * @param {*} id
 * @returns
 */
export function getUserInfoApi(id) {
  return request({
    url: `/api/ew-server/user/${id}`,
    method: 'get'
  })
}

/**
 * 根据用户邮箱获取用户基本信息
 * @param {*} params
 * @returns
 */
export function getUserByEmailApi(params) {
  return request({
    url: `/api/ew-server/user/find`,
    method: 'get',
    params
  })
}

