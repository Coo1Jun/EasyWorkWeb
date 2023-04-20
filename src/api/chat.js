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
