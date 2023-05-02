<template>
  <div class="chat-container">
    <lemon-imui
      ref="IMUI"
      width="100%"
      height="100%"
      theme="blue"
      avatar-cricle
      :user="user"
      :contextmenu="contextmenu"
      :contact-contextmenu="contactContextmenu"
      :wrap-key="(e)=>e.keyCode === 13 && (e.shiftKey || e.ctrlKey)"
      :send-key="(e)=>e.keyCode === 13 && (!e.ctrlKey && !e.shiftKey)"
      hide-menu
      :hide-message-name="hideMessageName"
      :hide-message-time="hideMessageTime"
      @change-contact="handleChangeContact"
      @pull-messages="handlePullMessages"
      @message-click="handleMessageClick"
      @send="handleSend"
    >
      <template #cover>
        <div class="cover">
          <i class="lemon-icon-message" />
          <p><b>尽情畅聊 ！</b></p>
          <p><b>HAVE A NICE CHAT !</b></p>
          <p><b>点击从「 <a class="contact-a" @click="$router.push('/contacts')">通讯录</a> 」选择聊天对象</b></p>
        </div>
      </template>
      <template #message-title="contact">
        <span>{{ contact.displayName }}</span>
        <small
          class="more"
          @click="changeDrawer(contact, $refs.IMUI)"
        >{{
          ($refs.IMUI ? $refs.IMUI.drawerVisible : false) ? "关闭" : "打开"
        }}抽屉</small>
        <br>
      </template>
      <template #editor-footer>
        <p>使用 enter 快捷发送消息</p>
      </template>
    </lemon-imui>
    <el-dialog
      title="修改备注"
      :visible.sync="editRemarkVisible"
      width="30%"
    >
      <el-input v-model="editRemark" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRemarkVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRemarkConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EmojiData from '@/chatdata/emoji'
import SnowflakeId from 'snowflake-id'
import WebSocket from '@/api/websocket'
import { mapGetters } from 'vuex'
import { uploadFileApi } from '@/api/file'
import {
  getChatRecordsApi,
  getContactListApi,
  deleteContactApi,
  updateContactApi,
  addContactApi } from '@/api/chat'

const getTime = () => {
  return new Date().getTime()
}
const snowflake = new SnowflakeId()
const generateRandId = () => {
  return snowflake.generate() // 生成雪花id
}

export default {
  name: 'Chat',
  data() {
    return {
      editRemarkVisible: false,
      editRemark: '',
      CurrentContact: null,
      user: {},
      contextmenu: [
        // {
        //   click: (e, instance, hide) => {
        //     const { IMUI, message } = instance
        //     const data = {
        //       id: generateRandId(),
        //       type: 'event',
        //       // 使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
        //       content: (
        //         <div>
        //           <span>
        //             你撤回了一条消息{' '}
        //           <span
        //             v-show={message.type === 'text'}
        //             style='color:#333;cursor:pointer'
        //             content={message.content}
        //             on-click={e => {
        //               IMUI.setEditorValue(e.target.getAttribute('content'))
        //             }}
        //           >
        //               重新编辑
        //           </span>
        //           </span>
        //         </div>
        //       ),

        //       toContactId: message.toContactId,
        //       sendTime: getTime()
        //     }
        //     IMUI.removeMessage(message.id)
        //     IMUI.appendMessage(data, true)
        //     hide()
        //   },
        //   visible: instance => {
        //     return instance.message.fromUser.id === this.user.id
        //   },
        //   text: '撤回消息'
        // },
        // {
        //   visible: instance => {
        //     return instance.message.fromUser.id !== this.user.id
        //   },
        //   text: '举报'
        // },
        // {
        //   text: '转发'
        // },
        // {
        //   visible: instance => {
        //     return instance.message.type === 'text'
        //   },
        //   text: '复制文字'
        // },
        {
          visible: instance => {
            return instance.message.type === 'image'
          },
          text: '下载图片',
          click: (e, instance, hide) => {
            this.downloadFile(instance.message)
            hide()
          }
        },
        {
          visible: instance => {
            return instance.message.type === 'file'
          },
          text: '下载文件',
          click: (e, instance, hide) => {
            this.downloadFile(instance.message)
            hide()
          }
        }
        // {
        //   click: (e, instance, hide) => {
        //     const { IMUI, message } = instance
        //     IMUI.removeMessage(message.id)
        //     console.log('删除消息', message)
        //     hide()
        //   },
        //   icon: 'lemon-icon-folder',
        //   color: 'red',
        //   text: '删除'
        // }
      ],
      contactContextmenu: [
        {
          text: '删除该聊天',
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            this.$confirm('此操作将删除该聊天窗口, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const { success } = await deleteContactApi(contact.keyId)
              if (success) {
                IMUI.updateContact({
                  id: contact.id,
                  lastContent: null
                })
                if (IMUI.currentContactId === contact.id) IMUI.changeContact(null)
              }
            })
            hide()
          }
        },
        {
          text: '设置备注和标签',
          click: (e, instance, hide) => {
            this.openEditRemark(instance.contact)
            hide()
          }
        }
        // {
        //   text: '投诉'
        // },
        // {
        //   click(e, instance, hide) {
        //     const { IMUI, contact } = instance
        //     IMUI.removeContact(contact.id)
        //     if (IMUI.currentContactId === contact.id) IMUI.changeContact(null)
        //     hide()
        //   },
        //   color: 'red',
        //   text: '删除好友'
        // }
      ],
      hideMenu: false,
      hideMenuAvatar: false,
      hideMessageTime: false,
      curContact: {
        id: '',
        pageNo: 1, // 第几页
        limit: 30 // 每页几条记录
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    hideMessageName() {
      if (this.CurrentContact !== null) {
        return this.CurrentContact.type === 'person'
      }
      return false
    }
  },
  async mounted() {
    // console.log(this.userInfo)
    // 初始化当前用户
    this.user = {
      id: this.userInfo.userid,
      displayName: this.userInfo.realName,
      avatar: this.userInfo.portrait
    }
    // 初始化websocket
    WebSocket.init(this.userInfo.userid + ',' + getTime().toString(), this.onOpen, this.onMessage)
    // 如果params参数存在，则是由通讯录页面跳转而来，先保存联系人
    const params = this.$route.params
    if (params.contactId && params.type) {
      const data = {
        contactId: params.contactId,
        type: params.type
      }
      if (params.type === 'group') {
        data.name = '【项目组】' + params.name
      }
      await addContactApi(data)
    }
    // 初始化联系人列表
    const { data } = await getContactListApi().catch(() => {})

    // const contactData2 = {
    //   id: 'contact-2',
    //   displayName: '自定义内容',
    //   avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/d534b989bc074da0b190f2a9e87c9e45.png',
    //   // index: "Z",
    //   click(next) {
    //     next()
    //   },
    //   renderContainer: () => {
    //     return <h1 style='text-indent:20px'>自定义页面</h1>
    //   },
    //   lastSendTime: 1345209465000,
    //   lastContent: '12312',
    //   unread: 2
    // }
    // const contactData3 = {
    //   id: '1634404380204183554',
    //   displayName: '李正帆测试',
    //   avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/d534b989bc074da0b190f2a9e87c9e45.png',
    //   // index: '2',
    //   unread: 32,
    //   lastSendTime: 1566047865417,
    //   lastContent: '你好123'
    // }

    const { IMUI } = this.$refs

    // IMUI.setLastContentRender('text', message => {
    //   return message.content
    // })

    // const contactList = [
    //   { ...contactData3 },
    //   { ...contactData1 },
    // ]

    IMUI.initContacts(data)

    IMUI.initEditorTools([
      {
        name: 'emoji'
      },
      {
        name: 'uploadFile'
      },
      {
        name: 'uploadImage'
      },
      // {
      //   name: 'test1',
      //   // click: () => {
      //   //   IMUI.$refs.editor.selectFile('application/vnd.ms-excel')
      //   // },
      //   render: () => {
      //     return <span>Excel</span>
      //   }
      // },
      // {
      //   name: 'test1',
      //   click: () => {
      //     IMUI.initEditorTools([{ name: 'uploadFile' }, { name: 'emoji' }])
      //   },
      //   render: () => {
      //     return <span>重制工具栏</span>
      //   }
      // },
      {
        name: 'test2',
        isRight: true,
        title: '上传 Excel',
        click: () => {
          alert('点击了 ··· ')
        },
        render: () => {
          return <b>···</b>
        }
      }
    ])
    IMUI.initEmoji(EmojiData)
    // 如果参数存在，则定位到指定的聊天窗口
    if (params.contactId) {
      IMUI.changeContact(params.contactId)
    }

    // IMUI.setLastContentRender('voice', message => {
    //   return <span>[语音]</span>
    // })
  },
  beforeDestroy() {
    WebSocket.closeConnect()
    // console.log('聊天模块销毁了')
    this.$refs.IMUI.clearMessages() // 清空所有的本地消息缓存，当重新进入页面是会重新请求获得消息。这样做的原因如下：
    // 原因：由于IMUI组件可能有做全局缓存，即使离开此页面组件销毁了，缓存还在。所有如果不清空，下次重新进入此页面，
    // 组件并不会触发pull-messages事件，导致如果页面消息不够多，最上方会一直在转圈圈
  },
  methods: {
    handleMessageClick(e, key, message, instance) {
      // console.log('点击了消息', e, key, message)

      if (key === 'status') {
        message.status = 'going'
        instance.updateMessage(message)
        if (!WebSocket.connectSuccess()) {
          WebSocket.reconnect() // 重新连接
          const intervalId = setInterval(() => {
            if (WebSocket.reconnectOver()) {
              clearInterval(intervalId) // 清除定时器
              if (WebSocket.connectSuccess()) {
                message.status = 'succeed'
                WebSocket.send(JSON.stringify(message))
                instance.updateMessage(message)
              } else {
                instance.updateMessage({
                  id: message.id,
                  status: 'failed',
                  content: message.content
                })
              }
            }
          }, 500)
        } else {
          message.status = 'succeed'
          WebSocket.send(JSON.stringify(message))
          instance.updateMessage(message)
        }
      }
      if (message.type === 'image') {
        const imgList = [{ fileName: '图片', fileUrl: message.content, downloadLink: message.content }]
        this.$openBox.imgPreview({ imgList, defaultIndex: 0 })
      }
    },
    changeDrawer(contact, instance) {
      const IMUI = this.$refs.IMUI
      const params = {
        position: 'center',
        width: '50%',
        height: '50%',
        render: contact => {
          return (
            <div style='padding:15px'>
              <h5>{contact.displayName}</h5>
              <span on-click={IMUI.closeDrawer}>关闭抽屉</span>
            </div>
          )
        }
      }
      IMUI.openDrawer(params)
    },
    handleChangeContact(contact, instance) {
      // console.log('切换聊天窗口，当前为=》', contact)
      this.CurrentContact = contact
      instance.updateContact({
        id: contact.id,
        unread: 0
      })
      instance.closeDrawer()
    },
    async handleSend(message, next, file) {
      message.toContactType = this.$refs.IMUI.getCurrentContact().type
      message.id = generateRandId() // 生成雪花id
      if (file) {
        // console.log('发送的消息类型是文件', file)
        const form = new FormData()
        form.append('file', file)
        const { data } = await uploadFileApi(form).catch(() => {
          next({ status: 'failed' })
        })
        // console.log(data)
        message.content = data.url
        message.fileName = data.name
        message.fileSize = data.fileSize
      }
      if (!WebSocket.connectSuccess()) {
        WebSocket.reconnect() // 重新连接
        const intervalId = setInterval(() => {
          // console.log('继续连接')
          if (WebSocket.reconnectOver()) {
            clearInterval(intervalId) // 清除定时器
            if (WebSocket.connectSuccess()) {
              next()
              WebSocket.send(JSON.stringify(message))
            } else {
              next({ status: 'failed' })
            }
          }
        }, 500)
      } else {
        next()
        WebSocket.send(JSON.stringify(message))
      }
    },
    async handlePullMessages(contact, next, instance) {
      if (JSON.stringify(contact) === '{}') {
        return
      }
      // 第一次进入该聊天窗口，或者切换了聊天窗口
      if (this.curContact.id === '' || this.curContact.id !== contact.id) {
        this.curContact.id = contact.id
        this.curContact.pageNo = 1
        this.curContact.limit = 30
      } else {
        this.curContact.pageNo++
      }
      const response = await getChatRecordsApi({
        toContactId: contact.id,
        contactType: contact.type,
        pageNo: this.curContact.pageNo,
        limit: this.curContact.limit
      }).catch(() => { next([], true) })
      if (response && response.success) {
        const messages = response.data
        const isEnd = messages.length === 0 || messages.length < this.curContact.limit
        next(messages, isEnd)
      } else {
        next([], true)
      }
    },
    downloadFile(file) {
      // console.log('下载文件start')
      const a = document.createElement('a')
      a.href = file.content
      a.download = file.type === 'image' ? '图片' : '文件'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // console.log('下载文件end')
    },
    onMessage(msg) {
      const message = JSON.parse(msg)
      // console.log(message)
      const IMUI = this.$refs.IMUI
      if (message.toContactType === 'person') {
        message.toContactId = message.fromUser.id // 接收到消息，将聊天框的id改为对方的id，这样才能定位到对方的聊天框
      }
      IMUI.appendContact({
        id: message.toContactId,
        displayName: message.fromUser.displayName,
        avatar: message.fromUser.avatar
      })
      IMUI.appendMessage(message, true)
    },
    onOpen() {},
    openEditRemark(contact) {
      this.editRemarkVisible = true
      this.editRemark = contact.displayName
      this.CurrentContact = contact
    },
    async editRemarkConfirm() {
      this.editRemarkVisible = false
      if (this.editRemark !== '' && this.editRemark !== this.CurrentContact.displayName) {
        const { success } = await updateContactApi({
          id: this.CurrentContact.keyId,
          remarkName: this.editRemark
        })
        if (success) {
          this.$refs.IMUI.updateContact({
            id: this.CurrentContact.id,
            displayName: this.editRemark
          })
        }
      }
    }
  }
}

</script>

<style scoped>
.chat-container{
  height: 600px;
}
.contact-a {
  font-size: 18px;
  color: #7768fd;
}
</style>
<style lang="stylus" scoped>
::selection{background:#000;color:#fff;}
body
  font-family "Microsoft YaHei"
  background #f6f6f6 !important
#app
  width 90%
  margin 0 auto
  padding-bottom 100px
  .scroll-top
    cursor pointer
    position fixed
    bottom 40px
    left 50%
    border-radius 50%
    background #fff
    font-size 18px
    overflow hidden
    width 40px
    height 40px
    line-height 40px
    user-select none
    text-align center
    transform rotate(-45deg) translateX(-50%)
    box-shadow 0 0 30px rgba(0,0,0,0.1);
    &:hover
      font-size 22px
a
  color #0c5ed9
  text-decoration none
  font-size 12px
.action
  margin-top 20px
  .lemon-button
    margin-right 10px
    margin-bottom 10px
.link
  font-size 14px
  margin-top 15px
  a
    display inline-block
    margin 0 5px
    text-decoration none
    background #ffba00
    border-radius 4px
    padding 5px 10px
    color rgba(0,0,0,0.8)
.logo
  position relative
  display inline-block
  margin 60px auto
  user-select none
.logo-text
  font-size 38px
.logo-sub
  font-size 18px
  color #999
  font-weight 300
.logo-badge
  position absolute
  top -10px
  left 230px
  background #000
  border-radius 16px
  color #f9f9f9
  font-size 12px
  padding 4px 8px
.title
  font-size 24px
  line-height 26px
  border-left 1px solid #ffba00
  padding-left 15px
  margin-bottom 15px
  margin-top 30px
  user-select none
.table
  width 100%
  border-radius 10px
  background #fff
  border-collapse collapse
  tr
    cursor pointer
  tr:not(.table-head):hover
    background #ffba00 !important
  tr:nth-of-type(even)
    background #f9f9f9
  th
    user-select none
    color #999
  td,
  th
    text-align left
    padding 10px 15px
    font-size 14px
    font-weight normal
.imui-center
  margin-bottom 60px
  .lemon-wrapper
    border:1px solid #ddd;
  .lemon-drawer
    border:1px solid #ddd;
    border-left:0;
.drawer-content
  padding 15px
.more
  font-size 12px
  line-height 24px
  height 24px
  position absolute
  top 14px
  right 14px
  cursor pointer
  user-select none
  color #f1f1f1
  display inline-block
  border-radius 4px
  background #111
  padding 0 8px
  &:active
    background #999
.bar
  text-align center
  line-height 30px
  background #fff
  margin 15px
  color #666
  user-select none
  font-size 12px
.cover
  text-align center
  user-select none
  position absolute
  top 50%
  left 50%
  transform translate(-50%,-50%)
  i
    font-size 84px
    color #e6e6e6
  p
    font-size 18px
    color #ddd
    line-height 50px
.article-item
  line-height 34px
  cursor pointer
  &:hover
    text-decoration underline
    color #318efd
pre
  background #fff
  border-radius 8px
  padding 15px
.lemon-simple .lemon-container{
  z-index:5
}
.lemon-simple .lemon-drawer{
  z-index:4
}

input#switch[type=checkbox]{
	height: 0;
	width: 0;
	display:none;
}

label#switch-label {
	cursor: pointer;
	text-indent: -9999px;
	width: 34px;
	height: 20px;
	background: #aaa;
	display: block;
	border-radius: 100px;
	position: relative;
}

label#switch-label:after {
	content: '';
	position: absolute;
	top: 2px;
	left: 2px;
	width: 16px;
	height: 16px;
	background: #fff;
	border-radius: 20px;
	transition: 0.3s;
}

input#switch:checked + label {
	background: #0fd547;
}

input#switch:checked + label:after {
	left: calc(100% - 2px);
	transform: translateX(-100%);
}

label#switch-label:active:after {
	width: 20px;
}
</style>
<style scoped>
::v-deep .lemon-container {
  z-index: 7;
}
::v-deep .lemon-drawer {
  z-index: 7;
}
::v-deep .lemon-editor__emoji-item {
  width: 30px;
}
::v-deep .lemon-message-text .lemon-message__content img {
  width: 25px;
  height: 21px;
}
::v-deep .lemon-editor__input {
  padding: 10px 10px;
}
</style>
