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
      hide-menu
      :hide-message-name="hideMessageName"
      :hide-message-time="hideMessageTime"
      @change-menu="handleChangeMenu"
      @change-contact="handleChangeContact"
      @pull-messages="handlePullMessages"
      @message-click="handleMessageClick"
      @menu-avatar-click="handleMenuAvatarClick"
      @send="handleSend"
    >
      <template #cover>
        <div class="cover">
          <i class="lemon-icon-message" />
          <p><b>自定义封面 Lemon</b> IMUI</p>
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
    </lemon-imui>
    <a
      ref="downloadFile"
      target="_blank"
      :href="download.url"
      :download="download.fileName"
    />
  </div>
</template>

<script>
import EmojiData from '@/chatdata/emoji'
import { uploadFileApi } from '@/api/file'

const getTime = () => {
  return new Date().getTime()
}
const generateRandId = () => {
  return Math.random()
    .toString(36)
    .substr(-8)
}
const generateRandWord = () => {
  return Math.random()
    .toString(36)
    .substr(2)
}
const generateMessage = (toContactId = '', fromUser) => {
  if (!fromUser) {
    fromUser = {
      id: 'system',
      displayName: '系统测试',
      avatar: 'http://upload.qqbodys.com/allimg/1710/1035512943-0.jpg'
    }
  }
  return {
    id: generateRandId(),
    status: 'succeed',
    type: 'text',
    sendTime: getTime(),
    content: generateRandWord(),
    // fileSize: 1231,
    // fileName: "asdasd.doc",
    toContactId,
    fromUser
  }
}

export default {
  name: 'Chat',
  data() {
    return {
      download: {
        url: '',
        fileName: ''
      },
      user: {
        id: '1',
        displayName: 'June',
        avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/d534b989bc074da0b190f2a9e87c9e45.png'
      },
      contextmenu: [
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            const data = {
              id: generateRandId(),
              type: 'event',
              // 使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
              content: (
                <div>
                  <span>
                    你撤回了一条消息{' '}
                  <span
                    v-show={message.type === 'text'}
                    style='color:#333;cursor:pointer'
                    content={message.content}
                    on-click={e => {
                      IMUI.setEditorValue(e.target.getAttribute('content'))
                    }}
                  >
                      重新编辑
                  </span>
                  </span>
                </div>
              ),

              toContactId: message.toContactId,
              sendTime: getTime()
            }
            IMUI.removeMessage(message.id)
            IMUI.appendMessage(data, true)
            hide()
          },
          visible: instance => {
            return instance.message.fromUser.id === this.user.id
          },
          text: '撤回消息'
        },
        {
          visible: instance => {
            return instance.message.fromUser.id !== this.user.id
          },
          text: '举报'
        },
        {
          text: '转发'
        },
        {
          visible: instance => {
            return instance.message.type === 'text'
          },
          text: '复制文字'
        },
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
        },
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance
            IMUI.removeMessage(message.id)
            console.log('删除消息', message)
            hide()
          },
          icon: 'lemon-icon-folder',
          color: 'red',
          text: '删除'
        }
      ],
      contactContextmenu: [
        {
          text: '删除该聊天',
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance
            IMUI.updateContact({
              id: contact.id,
              lastContent: null
            })
            if (IMUI.currentContactId === contact.id) IMUI.changeContact(null)
            hide()
          }
        },
        {
          text: '设置备注和标签'
        },
        {
          text: '投诉'
        },
        {
          icon: 'lemon-icon-message',
          render: (h, instance, hide) => {
            return (
              <div style='display:flex;justify-content:space-between;align-items:center;width:130px'>
                <span>加入黑名单</span>
                <span>
                  <input type='checkbox' id='switch' />
                  <label id='switch-label' for='switch'>
                    Toggle
                  </label>
                </span>
              </div>
            )
          }
        },
        {
          click(e, instance, hide) {
            const { IMUI, contact } = instance
            IMUI.removeContact(contact.id)
            if (IMUI.currentContactId === contact.id) IMUI.changeContact(null)
            hide()
          },
          color: 'red',
          text: '删除好友'
        }
      ],
      hideMenu: false,
      hideMenuAvatar: false,
      hideMessageName: false,
      hideMessageTime: false
    }
  },
  mounted() {
    const contactData1 = {
      id: 'contact-1',
      displayName: '工作协作群',
      avatar: 'http://upload.qqbodys.com/img/weixin/20170804/ji5qxg1am5ztm.jpg',
      index: '[1]群组',
      unread: 0,
      lastSendTime: 1566047865417,
      lastContent: '2'
    }
    const contactData2 = {
      id: 'contact-2',
      displayName: '自定义内容',
      avatar: 'http://upload.qqbodys.com/img/weixin/20170807/jibfvfd00npin.jpg',
      // index: "Z",
      click(next) {
        next()
      },
      renderContainer: () => {
        return <h1 style='text-indent:20px'>自定义页面</h1>
      },
      lastSendTime: 1345209465000,
      lastContent: '12312',
      unread: 2
    }
    const contactData3 = {
      id: 'contact-3',
      displayName: '铁牛',
      avatar: 'http://upload.qqbodys.com/img/weixin/20170803/jiq4nzrkrnd0e.jpg',
      index: 'T',
      unread: 32,
      lastSendTime: 3,
      lastContent: '你好123'
    }
    const contactData4 = {
      id: 'contact-4',
      displayName: '如花',
      avatar:
        'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4275424924,2201401076&fm=111&gp=0.jpg',
      index: '',
      unread: 1,
      lastSendTime: 3,
      lastContent: '吃饭了嘛'
    }

    const { IMUI } = this.$refs
    setTimeout(() => {
      IMUI.changeContact('contact-1')
    }, 500)

    IMUI.setLastContentRender('text', message => {
      return `[自定义通知内容]`
    })

    const contactList = [
      { ...contactData1 },
      { ...contactData2 },
      { ...contactData3 },
      { ...contactData4 }
      // ...Array(100).fill(contactData1)
    ]

    IMUI.initContacts(contactList)

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

    IMUI.setLastContentRender('voice', message => {
      return <span>[语音]</span>
    })
  },
  methods: {
    handleMenuAvatarClick() {
      console.log('Event:menu-avatar-click')
    },
    handleMessageClick(e, key, message, instance) {
      console.log('点击了消息', e, key, message)

      if (key === 'status') {
        instance.updateMessage({
          id: message.id,
          status: 'going',
          content: '正在重新发送消息...'
        })
        setTimeout(() => {
          instance.updateMessage({
            id: message.id,
            status: 'succeed',
            content: '发送成功'
          })
        }, 2000)
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
      console.log('Event:change-contact')
      instance.updateContact({
        id: contact.id,
        unread: 0
      })
      instance.closeDrawer()
    },
    async handleSend(message, next, file) {
      console.log('发送了消息：', message)
      if (file) {
        console.log('发送的消息类型是文件', file)
        const form = new FormData()
        form.append('file', file)
        // const { data } = await uploadFileApi(form)
        // message.content = data.url
      }

      // console.log(message, next, file)
      setTimeout(() => {
        next()
      }, 1000)
    },
    handlePullMessages(contact, next, instance) {
      const otheruser = {
        id: contact.id,
        displayName: contact.displayName,
        avatar: contact.avatar
      }
      setTimeout(() => {
        const messages = [
          generateMessage(instance.currentContactId, this.user),
          generateMessage(instance.currentContactId, otheruser),
          generateMessage(instance.currentContactId, this.user),
          generateMessage(instance.currentContactId, otheruser),
          generateMessage(instance.currentContactId, this.user),
          generateMessage(instance.currentContactId, this.user),
          generateMessage(instance.currentContactId, otheruser),
          {
            ...generateMessage(instance.currentContactId, this.user),
            ...{ status: 'failed' }
          }
        ]
        let isEnd = false
        if (
          instance.getMessages(instance.currentContactId).length +
            messages.length >
          11
        ) { isEnd = true }
        next(messages, isEnd)
      }, 500)
    },
    handleChangeMenu() {
      console.log('Event:change-menu')
    },
    openCustomContainer() {},
    downloadFile(file) {
      console.log('下载文件start')
      this.download.url = file.content
      this.download.fileName = file.type === 'image' ? '图片' : '文件'
      this.$refs.downloadFile.click()
      console.log('下载文件end')
    }
  }
}

</script>

<style scoped>
.chat-container{
  height: 600px;
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
