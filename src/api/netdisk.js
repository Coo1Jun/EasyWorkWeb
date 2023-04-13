import request from '@/utils/request'

/**
 * 获取网盘文件列表
 * @param {*} params
 * @returns
 */
export function getNetDiskListApi(params) {
  return request({
    url: '/api/ew-project/netdisk/list',
    method: 'get',
    params
  })
}

/**
 * 添加文件夹
 * @param {*} data
 * @returns
 */
export function addDriApi(data) {
  return request({
    url: '/api/ew-project/netdisk/directory',
    method: 'post',
    data
  })
}

/**
 * 添加文件
 * @param {*} data
 * @returns
 */
export function addFileApi(data) {
  return request({
    url: '/api/ew-project/netdisk/upload',
    method: 'post',
    data
  })
}
