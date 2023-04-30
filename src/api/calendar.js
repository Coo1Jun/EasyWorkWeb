import request from '@/utils/request'

/**
 * 获取日历列表
 * @returns
 */
export function getCalendarListApi() {
  return request({
    url: '/api/ew-communication/calendar/list',
    method: 'get'
  })
}

/**
 * 添加日程信息
 * @param {} data
 * @returns
 */
export function addScheduleApi(data) {
  return request({
    url: '/api/ew-communication/schedule',
    method: 'post',
    data
  })
}

/**
 * 添加待办信息
 * @param {} data
 * @returns
 */
export function addTodoListApi(data) {
  return request({
    url: '/api/ew-communication/todolist',
    method: 'post',
    data
  })
}

