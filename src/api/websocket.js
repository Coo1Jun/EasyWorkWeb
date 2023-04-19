let websocket
let curUserId
let success = false
let maxTimes = 10
let curTimes = 0
let intervalId
const defaultUrl = 'ws://localhost:8022/api/ew-chat/websocket'

const externalFun = {
  onOpen: () => {},
  onMessage: () => {},
  onClose: () => {},
  onError: () => {}
}

function open() {
  success = true // 连接成功
  maxTimes = 10
  curTimes = 0
  // console.log('连接成功')
  clearInterval(intervalId)
  externalFun.onOpen()
}

function message(msg) {
  externalFun.onMessage(msg.data)
}

function close() {
  success = false
  // console.log('连接关闭')
  if (curTimes >= maxTimes) {
    clearInterval(intervalId)
  }
  externalFun.onClose()
}

function error() {
  success = false
  // console.log('连接错误')
  if (curTimes >= maxTimes) {
    clearInterval(intervalId)
  }
  externalFun.onError()
}

export function reconnect() {
  intervalId = setInterval(() => {
    connect(curUserId)
    curTimes++
  }, 1000)
}

function reconnectOver() {
  return success || curTimes >= maxTimes
}

function connect(userId) {
  const url = defaultUrl + '/' + userId
  websocket = new WebSocket(url)
  // 监听socket连接
  websocket.onopen = open
  // 监听socket错误信息
  websocket.onerror = error
  // 监听socket的关闭
  websocket.onclose = close
  // 监听socket消息
  websocket.onmessage = message
}

export function init(userId, onOpen, onMessage, onClose, onError) {
  curUserId = userId
  if (onOpen) externalFun.onOpen = onOpen
  if (onMessage) externalFun.onMessage = onMessage
  if (onClose) externalFun.onClose = onClose
  if (onError) externalFun.onError = onError
  connect(userId)
}

export function setOnMessage(onMessage) {
  // 监听socket消息
  externalFun.onMessage = onMessage
}

export function setOnOpen(onOpen) {
  // 监听socket连接
  externalFun.onOpen = onOpen
}

export function setOnError(onError) {
  // 监听socket连接
  externalFun.onError = onError
}

export function getWebSocket() {
  return websocket
}

export function connectSuccess() {
  return success
}

// 发送消息
export function send(msg) {
  websocket.send(msg)
}

// 主动关闭连接
function closeConnect() {
  websocket.close()
}

export default {
  init,
  setOnMessage,
  setOnOpen,
  setOnError,
  getWebSocket,
  send,
  reconnect,
  reconnectOver,
  connectSuccess,
  closeConnect
}
