<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-tooltip content="通知" placement="bottom" effect="light" :hide-after="1000">
        <div class="n-notification">
          <i class="el-icon-bell" @click="notificationDrawer = true" />
          <el-badge is-dot class="item" :hidden="notifications && notifications.length === 0" />
        </div>
      </el-tooltip>
      <el-popover
        v-model="visible"
        class="avatar-container"
        placement="bottom"
        width="320"
        trigger="click"
        :visible-arrow="false"
      >
        <div
          slot="reference"
          style="display: flex;"
        >
          <el-avatar
            :size="'large'"
            :src="userInfo && userInfo.portrait"
            style="margin-top: 5px;margin-right: 10px"
          />
          <span class="avatar-name">{{ userInfo && userInfo.realName }}</span>
        </div>
        <div>
          <div class="user-bg">
            <el-avatar :size="60" :src="userInfo && userInfo.portrait" />
            <div>
              <h1>{{ userInfo && userInfo.realName }}</h1>
            </div>
          </div>
          <div @click="visible = false">
            <router-link to="/">
              <el-dropdown-item divided>
                <i class="el-icon-house" />
                主页
              </el-dropdown-item>
            </router-link>
          </div>
          <div @click="visible = false">
            <router-link to="/console/account">
              <el-dropdown-item>
                <i class="el-icon-user" />
                账号资料设置
              </el-dropdown-item>
            </router-link>
          </div>
          <div @click="visible = false">
            <el-dropdown-item
              style="color: #ff7575"
              divided
              @click.native="logout"
            >
              <i class="el-icon-right" />
              退出登录
            </el-dropdown-item>
          </div>
        </div>
      </el-popover>
    </div>
    <el-drawer
      :visible.sync="notificationDrawer"
      :modal="false"
    >
      <template slot="title">
        <div>
          通知
          <el-link type="primary" style="margin-left: 20px" @click="toNotification">通知中心</el-link>
        </div>
      </template>
      <div class="n-notification-list">
        <el-card v-for="n in notifications" :key="n.id" shadow="hover" class="n-notification-card">
          <div class="n-notification-card-body">
            <NotificationContent :data="n" />
          </div>
          <div class="n-notification-card-foot">
            <span>2023-04-24 20:18:16</span>
            <span style="margin-left: 20px;font-size: 14px">未读</span>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import NotificationContent from '@/components/NotificationContent'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    NotificationContent
  },
  data() {
    return {
      visible: false,
      notificationDrawer: false,
      notifications: [
        {
          id: '1',
          type: 'friend',
          fromName: '某某某',
          workItem: {
            id: '1',
            title: '我是工作项标题'
          },
          group: {
            id: '1',
            name: '我是项目组'
          },
          isRead: 0
        },
        {
          id: '5',
          type: 'work',
          fromName: '某某某',
          workItem: {
            id: '1',
            title: '我是工作项标题',
            number: 22
          },
          projectTab: 'EW',
          group: {
            id: '1',
            name: '我是项目组'
          },
          isRead: 0
        },
        {
          id: '2',
          type: 'group',
          fromName: '某某某',
          workItem: {
            id: '1',
            title: '我是工作项标题'
          },
          group: {
            id: '1',
            name: '我是项目组'
          },
          isRead: 1
        },
        {
          id: '3',
          type: 'warn',
          fromName: '某某某',
          workItem: {
            id: '1',
            title: '我是工作项标题',
            number: 22
          },
          projectTab: 'EW',
          group: {
            id: '1',
            name: '我是项目组'
          },
          isRead: 1
        },
        {
          id: '4',
          type: 'friend',
          fromName: '我是某某某',
          workItem: {
            id: '1',
            title: '我是工作项标题'
          },
          group: {
            id: '1',
            name: '我是项目组'
          },
          isRead: 1
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    toNotification() {
      this.$router.push({ path: '/console/notification' })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display: flex;
    height: 100%;
    line-height: 50px;
    margin-right: 20px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 10px;
      // margin-top: 5px;
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
$bg-image: url("../../assets/background/user_bg.jpg");
@mixin bg-image($image) {
  background-image: $image;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.user-bg {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  flex-direction: column; /* 垂直排列 */
  width: 100%;
  height: 260px;
  padding-top: 70px;
  @include bg-image($bg-image);
}
// 设置 el-avatar 的鼠标指针效果
.el-avatar {
  cursor: pointer;

  // 鼠标移动到 el-avatar 时的效果
  &:hover {
    cursor: pointer;
  }
}
.avatar-name {
  cursor: pointer;

  // 鼠标移动到 el-avatar 时的效果
  &:hover {
    cursor: pointer;
  }
}
</style>
<style lang="css" scoped>
.n-notification {
  font-size: 25px;
  margin-right: 20px;
  cursor: pointer;
}
.n-notification-list {
  overflow: auto;
  height: 620px;
}
.n-notification-card {
  margin: 10px 0;
  cursor: pointer;
  height: 8em;
}
.n-notification-card-body {
  height: 74px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3; /* 确保文本的行数不超过 3 行 */
  line-height: 1.5; /* 设置行高 */
}
.n-notification-card-foot {
  color: #aaa;
  margin-top: 5px;
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
  padding-bottom: 32px;
  border-bottom: 1px solid #eee
}
</style>
