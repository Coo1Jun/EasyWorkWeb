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
export function addDirApi(data) {
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

/**
 * 重命名文件
 * @param {*} data
 * @returns
 */
export function renameFileApi(data) {
  return request({
    url: '/api/ew-project/netdisk/rename',
    method: 'put',
    data
  })
}

/**
 * 获取文件夹树结构
 * @param {*}
 * @returns
 */
export function getDirTreeNodeApi(params) {
  return request({
    url: '/api/ew-project/netdisk/dir/tree',
    method: 'get',
    params
  })
}

/**
 * 移动文件
 * @param {*}
 * @returns
 */
export function moveFileApi(data) {
  return request({
    url: '/api/ew-project/netdisk/move',
    method: 'put',
    data
  })
}

/**
 * 移动文件
 * @param {*}
 * @returns
 */
export function copyFileApi(data) {
  return request({
    url: '/api/ew-project/netdisk/copy',
    method: 'put',
    data
  })
}

/**
 * 删除文件(彻底删除)
 * @param {*}
 * @returns
 */
export function deleteFileApi(ids) {
  return request({
    url: `/api/ew-project/netdisk/${ids}`,
    method: 'delete'
  })
}
