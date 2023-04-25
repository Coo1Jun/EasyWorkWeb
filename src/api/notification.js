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

