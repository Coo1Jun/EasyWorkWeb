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
