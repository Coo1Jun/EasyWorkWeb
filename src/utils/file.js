import Vue from 'vue'
import router from '@/router/index'
import { Message } from 'element-ui'
import {
  fileImgMap,
  unknownImg,
  fileSuffixCodeModeMap,
  markdownFileType
} from '@/utils/map.js'
import { officeFileType } from '@/utils/map.js'
import * as base64Encode from 'js-base64'

// 全局函数 - 文件相关
const fileFunction = {
  /**
     * 格式化文件大小
     * @param {number} size 文件大小
     * @param {boolean} isInteger 是否只显示整数位，默认不截取
     * @returns {string} 文件大小（带单位）
     */
  calculateFileSize(size, isInteger = false) {
    const B = 1024
    const KB = Math.pow(1024, 2)
    const MB = Math.pow(1024, 3)
    const GB = Math.pow(1024, 4)
    if (isInteger) {
      // 截取为整数
      if (size < B) {
        return `${size}B`
      } else if (size < KB) {
        return `${(size / B).toFixed(0)}KB`
      } else if (size < MB) {
        return `${(size / KB).toFixed(0)}MB`
      } else if (size < GB) {
        return `${(size / MB).toFixed(0)}GB`
      } else {
        return `${(size / GB).toFixed(0)}TB`
      }
    } else {
      // 保留小数位
      if (size < B) {
        return `${size}B`
      } else if (size < KB) {
        return `${(size / B).toFixed(0)}KB`
      } else if (size < MB) {
        return `${(size / KB).toFixed(1)}MB`
      } else if (size < GB) {
        return `${(size / MB).toFixed(2)}GB`
      } else {
        return `${(size / GB).toFixed(3)}TB`
      }
    }
  },
  /**
     * 获取流式的缩略图、视频封面图
     * @param {object} row 文件信息
     * @returns {string} 流式图片
     */
  getMinImgStream(row) {
    return `/fileTransfer/preview?userFileId=${
      row.userFileId
    }&isMin=true&shareBatchNum=${
      row.shareBatchNum == null ? '' : row.shareBatchNum
    }&extractionCode=${row.extractionCode == null ? '' : row.extractionCode}`
  },
  /**
     * 获取文件查看路径
     * @param {object} row 文件信息
     * @returns {string} 文件路径
     */
  getViewFilePath(row) {
    return `/fileTransfer/preview?userFileId=${
      row.userFileId
    }&isMin=false&shareBatchNum=${
      row.shareBatchNum == null ? '' : row.shareBatchNum
    }&extractionCode=${row.extractionCode == null ? '' : row.extractionCode}`
  },
  /**
     * 获取文件下载路径
     * @param {object} row 文件信息
     * @returns {string}  文件下载路径
     */
  getDownloadFilePath(row) {
    return `/api/ew-server/file/download/${row.fileId}`
  },
  /**
     * 获取分享链接
     * @param {string} shareBatchNum
     * @returns {string} 完整的分享链接
     */
  getShareLink(shareBatchNum) {
    return `${location.protocol}//${location.host}/share/${shareBatchNum}`
  },
  /**
     * 复制分享链接
     * @param {string} shareBatchNum
     * @param {string} extractionCode
     */
  copyShareLink(shareBatchNum, extractionCode) {
    // 直接构建textarea以保持换行
    const input = document.createElement('textarea')
    input.value =
            extractionCode === null
              ? `分享链接：${this.getShareLink(
                shareBatchNum
              )}\n复制链接到浏览器中并输入提取码即可查看文件`
              : `分享链接：${this.getShareLink(
                shareBatchNum
              )}\n提取码：${extractionCode}\n复制链接到浏览器中并输入提取码即可查看文件` // 设置内容
    // 添加临时实例
    document.body.appendChild(input)
    // 选择实例内容
    input.select()
    // 执行复制
    document.execCommand('Copy')
    // 删除临时实例
    document.body.removeChild(input)
    Message.success('复制成功')
  },
  /**
     * 根据文件扩展名设置文件图片
     * @param {object} file 文件信息
     */
  setFileImg(file) {
    file.extendName
      ? file.extendName.toLowerCase()
      : file.extendName = ''
    if (file.isDir === 1) {
      // 文件夹
      return fileImgMap.get('dir' + file.belongType)
    } else if (fileImgMap.has(file.extendName)) {
      // 可以识别文件类型的文件
      return fileImgMap.get(file.extendName)
    } else {
      // 无法识别文件类型的文件
      return unknownImg
    }
  },
  /**
     * 判断是否是视频文件
     * @param {object} file 文件信息
     */
  isVideoFile(file) {
    if (
      ['avi', 'mp4', 'mpg', 'mov', 'swf'].includes(
                file.extendName?.toLowerCase()
      )
    ) {
      return true
    } else {
      return false
    }
  },
  /**
     * 图片预览
     * @param {*} currentIndex 当前图片索引
     * @param {*} imgInfo 单个图片信息
     * @param {*} imgInfoList 多个图片列表
     */
  handleImgPreview(currentIndex, imgInfo = {}, imgInfoList = []) {
    // 图片分类下 - 传递整个页面的图片列表；非图片分类下 - 由单个图片构建图片列表
    const imgList =
            Number(router.currentRoute.query.fileType) === 1
              ? imgInfoList.map((item) => {
                return {
                  ...item,
                  fileUrl: item.fileUrl,
                  downloadLink: this.getDownloadFilePath(item)
                }
              })
              : [
                {
                  ...imgInfo,
                  fileUrl: imgInfo.fileUrl,
                  downloadLink: this.getDownloadFilePath(imgInfo)
                }
              ]
    const defaultIndex =
            Number(router.currentRoute.query.fileType) === 1 ? currentIndex : 0
    Vue.prototype.$openBox.imgPreview({ imgList, defaultIndex })
  },
  /**
     * 视频预览
     * @param {*} currentIndex 当前视频索引
     * @param {*} videoInfo 单个视频信息
     * @param {*} videoInfoList 多个视频列表
     */
  handleVideoPreview(currentIndex, videoInfo = {}, videoInfoList = []) {
    // 视频分类下 - 传递整个页面的视频列表；非视频分类下 - 由单个视频构建视频列表
    const videoList =
            Number(router.currentRoute.query.fileType) === 3
              ? videoInfoList.map((item) => {
                return {
                  ...item,
                  fileUrl: this.getViewFilePath(item),
                  downloadLink: this.getDownloadFilePath(item)
                }
              })
              : [
                {
                  ...videoInfo,
                  fileUrl: this.getViewFilePath(videoInfo),
                  downloadLink: this.getDownloadFilePath(videoInfo)
                }
              ]
    const defaultIndex =
            Number(router.currentRoute.query.fileType) === 3 ? currentIndex : 0
    Vue.prototype.$openBox.videoPreview({ videoList, defaultIndex })
  },
  /**
     * 音频预览
     * @param {*} currentIndex 当前音频索引
     * @param {*} audioInfo 单个音频信息
     * @param {*} audioInfoList 多个音频列表
     */
  handleAudioPreview(currentIndex, audioInfo = {}, audioInfoList = []) {
    // 音频分类下 - 传递整个页面的音频列表；非音频分类下 - 由单个音频构建音频列表
    const audioList =
            Number(router.currentRoute.query.fileType) === 4
              ? audioInfoList.map((item) => {
                return {
                  ...item,
                  fileUrl: this.getViewFilePath(item),
                  downloadLink: this.getDownloadFilePath(item)
                }
              })
              : [
                {
                  ...audioInfo,
                  fileUrl: this.getViewFilePath(audioInfo),
                  downloadLink: this.getDownloadFilePath(audioInfo)
                }
              ]
    const defaultIndex =
            Number(router.currentRoute.query.fileType) === 4 ? currentIndex : 0
    Vue.prototype.$openBox.audioPreview({ audioList, defaultIndex })
  },
  /**
     * 文件预览
     * @description 若当前点击的为文件夹，则进入文件夹内部；若是文件，则进行相应的预览。
     * @param {object} row 文件信息
     * @param {number} currentIndex 当前文件索引
     * @param {array} fileList 文件列表
     */
  handleFileNameClick(row, currentIndex, fileList = []) {
    // console.log('点击了=====》', row.fileName)
    // console.log('是否是文件夹', row.isDir)
    // console.log(fileList)
    // 如果当前文件在回收站中，则不允许预览
    if (row.deleted && row.deleted !== 1) {
      return false
    }
    // 若是文件夹则进入该文件夹
    if (row.isDir) {
      router.push({
        query: {
          filePath: `${row.filePath === '/' ? '' : row.filePath}/${
            row.fileName
          }`,
          dirId: row.id
        }
      })
      // if (router.currentRoute.name === 'Share') {
      //   // 当前是查看他人分享列表的页面
      //   router.push({
      //     query: {
      //       filePath: `${row.shareFilePath === '/' ? '' : row.shareFilePath}/${
      //         row.fileName
      //       }`
      //     }
      //   })
      // } else if (Number(router.currentRoute.query.fileType) === 8) {
      //   // 当前是我的已分享列表页面
      //   router.push({
      //     query: {
      //       fileType: 8,
      //       filePath: `${row.shareFilePath === '/' ? '' : row.shareFilePath}/${
      //         row.fileName
      //       }`,
      //       shareBatchNum: row.shareBatchNum
      //     }
      //   })
      // } else if (Number(router.currentRoute.query.fileType) !== 6) {
      //   // 回收站页面不允许打开文件夹
      //   // 网盘页面
      //   router.push({
      //     query: {
      //       filePath: `${row.filePath === '/' ? '' : row.filePath}/${
      //         row.fileName
      //       }`
      //     }
      //   })
      // }
    }
    // 若是文件，则进行相应的预览
    else {
      // 若当前点击项是图片
      const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
      row.extendName
        ? row.extendName.toLowerCase()
        : row.extendName = ''
      if (PIC.includes(row.extendName)) {
        this.handleImgPreview(currentIndex, row, fileList)
        return false
      }
      // 使用kkfileview在线预览 官网链接https://file.kkview.cn 自己的服务器：http://47.120.39.20:8012
      window.open(`https://file.kkview.cn/onlinePreview?url=` + encodeURIComponent(base64Encode.encode(row.fileUrl)))
      // 若当前点击项是可以使用office在线预览的
      // if ([...officeFileType].includes(row.extendName)) {
      //   const url = `${config.getFileUrl}/fileTransfer/getFileUrl/` + row.userFileId + '.' + row.extendName
      //   window.open(`${config.kkFileView}/onlinePreview?url=` + encodeURIComponent(base64Encode.encode(url)))
      //   return false
      // }
      // 若当前点击项是pdf
      // 阿里云oss的地址不能直接访问
      // if (row.extendName === 'pdf') {
      //   window.open(row.fileUrl, '_blank')
      // }
      // 若当前点击项是代码或文本文件
      // let codeFileSuffix = row.extendName
      // if (codeFileSuffix === 'yaml') {
      //   codeFileSuffix = 'yml'
      // }
      // // 无格式文件也可以在线编辑
      // if (
      //   fileSuffixCodeModeMap.has(codeFileSuffix) ||
      //           (row.isDir === 0 && row.extendName === '')
      // ) {
      //   Vue.prototype.$openBox.codePreview({ fileInfo: row, isEdit: false })
      //   return false
      // }
      // // 若当前点击项是 markdown 文档
      // if (markdownFileType.includes(row.extendName.toLowerCase())) {
      //   Vue.prototype.$openBox.markdownPreview({
      //     fileInfo: row,
      //     editable: false
      //   })
      //   return false
      // }
      // // 若当前点击项是视频mp4格式
      // const VIDEO = ['mp4']
      // if (VIDEO.includes(row.extendName.toLowerCase())) {
      //   this.handleVideoPreview(currentIndex, row, fileList)
      //   return false
      // }
      // // 若当前点击项是音频 mp3、flac 格式
      // const AUDIO = ['mp3', 'flac']
      // if (AUDIO.includes(row.extendName.toLowerCase())) {
      //   this.handleAudioPreview(currentIndex, row, fileList)
      //   return false
      // }
    }
  },
  /**
     * 文件名称拼接，包括文件名称 + 文件后缀
     * @param {object} file 文件信息
     * @param {boolean} isHighlight 是否需要展示高亮效果，默认不需要
     * @returns {string} 完整文件名称
     */
  getFileNameComplete(file, isHighlight = false) {
    return isHighlight === true && file.highlightFields
      ? `${file.highlightFields}${
        file.isDir === 0 && file.extendName ? `.${file.extendName}` : ''
      }`
      : `${file.fileName}${
        file.isDir === 0 && file.extendName ? `.${file.extendName}` : ''
      }`
  },
  /**
     * 文件类型
     * @param {object} file 文件信息
     */
  getFileType(file) {
    return file.isDir === 1
      ? '文件夹'
      : file.extendName
        ? file.extendName
        : '文件'
  },
  /**
     * 获取文件分享过期状态
     * @param {string} time 日期
     * @returns {boolean} 是否过期
     */
  getFileShareStatus(time) {
    if (new Date(time).getTime() > new Date().getTime()) {
      return false
    } else {
      return true
    }
  }
}

export default fileFunction
