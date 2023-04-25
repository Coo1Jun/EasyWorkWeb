import request from '@/utils/request'

/**
 * 获取获取通讯录列表
 * @param {*} params
 * @returns
 */
export function getAddressBookListApi(params) {
  return request({
    url: '/api/ew-communication/address/list',
    method: 'get',
    params
  })
}

/**
 * 判断用户是否在通讯录当中
 * @param {*} params
 * @returns
 */
export function isUserAlreadyExistApi(params) {
  return request({
    url: '/api/ew-communication/address/user/exist',
    method: 'get',
    params
  })
}
