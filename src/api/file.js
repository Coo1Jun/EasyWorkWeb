import request from '@/utils/request'

// 文件上传地址
export const uploadUrl = '/api/ew-server/file/upload'

// 根据文件id获取文件元信息
export function getFilePath(fileId) {
  return request({
    url: `api/ew-server/file/${fileId}`,
    method: 'get'
  })
}
