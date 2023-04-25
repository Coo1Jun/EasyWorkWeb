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
