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
 * 获取通讯录信息实体列表（包括项目组的所有成员）
 * @returns
 */
export function getAllAddressBookListApi() {
  return request({
    url: '/api/ew-communication/address/member/list',
    method: 'get'
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
