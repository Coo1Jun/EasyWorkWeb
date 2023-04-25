import request from '@/utils/request'

/**
 * 添加通知
 * @param {*} data
 * @returns
 */
export function sendNotification(data) {
  return request({
    url: '/api/ew-communication/notification',
    method: 'post',
    data
  })
}

/**
 * 获取通知列表
 * @returns
 */
export function getNotificationListApi() {
  return request({
    url: '/api/ew-communication/notification/list',
    method: 'get'
  })
}

/**
 * 修改通知（设置已读或已处理）
 * @returns
 */
export function editNotificationApi(data) {
  return request({
    url: '/api/ew-communication/notification',
    method: 'put',
    data
  })
}

/**
 * 邀请成员进入项目组
 * @returns
 */
export function groupInviteApi(data) {
  return request({
    url: '/api/ew-communication/notification/group/invite',
    method: 'post',
    data
  })
}

