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
 * 修改日程信息
 * @param {} data
 * @returns
 */
export function editScheduleApi(data) {
  return request({
    url: '/api/ew-communication/schedule',
    method: 'put',
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

/**
 * 删除日程信息
 * @returns
 */
export function deleteScheduleApi(ids) {
  return request({
    url: `/api/ew-communication/schedule/${ids}`,
    method: 'delete'
  })
}

/**
 * 编辑待办信息
 * @param {} data
 * @returns
 */
export function editTodoListApi(data) {
  return request({
    url: '/api/ew-communication/todolist',
    method: 'put',
    data
  })
}

/**
 * 设置待办结束信息
 * @returns
 */
export function setTodoListEndApi(data) {
  return request({
    url: '/api/ew-communication/todolist/end',
    method: 'put',
    data
  })
}

/**
 * 删除待办信息
 * @param {} data
 * @returns
 */
export function deleteTodoListApi(ids) {
  return request({
    url: `/api/ew-communication/todolist/${ids}`,
    method: 'delete'
  })
}

