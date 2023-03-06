<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-popover
        v-model="visible"
        class="avatar-container"
        placement="bottom"
        width="320"
        trigger="click"
        :visible-arrow="false"
      >
        <el-avatar
          slot="reference"
          :size="'large'"
          :src="userInfo && userInfo.portrait"
        />
        <div @click="visible = false">
          <el-row>
            <router-link to="/">
              <el-dropdown-item>
                <i class="el-icon-house" />
                主页
              </el-dropdown-item>
            </router-link>
          </el-row>
          <el-row>
            <el-dropdown-item>
              <i class="el-icon-user" />
              账号资料设置
            </el-dropdown-item>
          </el-row>
          <el-row>
            <el-dropdown-item style="color:red" divided @click.native="logout">
              <i class="el-icon-right" />
              退出登录
            </el-dropdown-item>
          </el-row>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      visible: false
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
    }
    // async filePath(fileId) {
    //   if (fileId !== null) {
    //     const {data} = await getFilePath(fileId)
    //     this.avatar = data.location
    //   }
    // }
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
    height: 80%;
    line-height: 50px;
    margin-top: 5px;

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
      margin-right: 30px;
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
.my-icon {
  &:hover {
    // color: #66b1ff;
    color: red;
    fill: red;
  }
}
</style>
