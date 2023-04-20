import request from '@/utils/request'

/**
 * 获取获取聊天记录
 * @param {*} params
 * @returns
 */
export function getChatRecordsApi(params) {
  return request({
    url: '/api/ew-chat/chat/history/list',
    method: 'get',
    params
  })
}

/**
 * 获取联系人列表
 * @param {*} params
 * @returns
 */
export function getContactListApi(params) {
  return request({
    url: '/api/ew-chat/contact/list',
    method: 'get',
    params
  })
}

/**
 * 删除联系人
 * @param {*} params
 * @returns
 */
export function deleteContactApi(ids) {
  return request({
    url: `/api/ew-chat/contact/${ids}`,
    method: 'delete'
  })
}

/**
 * 修改联系人信息
 * @param {*} params
 * @returns
 */
export function updateContactApi(data) {
  return request({
    url: `/api/ew-chat/contact`,
    method: 'put',
    data
  })
}

/**
 * 添加联系人信息
 * @param {*} params
 * @returns
 */
export function addContactApi(data) {
  return request({
    url: `/api/ew-chat/contact`,
    method: 'post',
    data
  })
}
