
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {}}
editorConfig.MENU_CONF['uploadImage'] = {
  // 其他配置...

  // 小于该值就插入 base64 格式（而不上传），默认为 0
  // 这里不走服务端地址，因此把图片都渲染成base64，设置大小为2M
  // base64LimitSize: 2 * 1024 * 1024

  // 打开，将所有的上传图片都转为base64
  uploadImgShowBase64: true
}

const toolbarConfig = {}
// 排除功能
toolbarConfig.excludeKeys = [
  'group-video', // 排除上传视频功能
  'fontSize', // 字体大小设置
  'lineHeight', // 行高设置
  'fontFamily', // 字体样式设置
  'fullScreen' // 全屏
]

const config = {
  editorConfig,
  toolbarConfig
}
export default config
