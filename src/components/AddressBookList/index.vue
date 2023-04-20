<template>
  <div class="abl-container">
    <el-table
      :data="data"
      style="width: 100%"
      class="abl-table"
      tooltip-effect="light"
    >
      <el-table-column
        prop="avatar"
        align="center"
        width="60"
      >
        <template slot-scope="scope">
          <img class="abl-avatar" :src="scope.row.avatar" @click="handleClickImg(scope.row)">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        width="180"
      />
      <el-table-column
        prop="email"
        label="邮箱"
        width="200"
      />
      <el-table-column
        prop="description"
        label="个性签名"
        show-overflow-tooltip
      />
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="small" class="abl-chat-btn" round @click="toChat(scope.row)">聊天</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'AddressBookList',
  components: { },
  data() {
    return {
      data: [
        {
          id: '1633362162592845826',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1557662367922384897',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        },
        {
          id: '1',
          name: '小明',
          avatar: 'https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/db02c8745a314524b18cbf5b9e310730.png',
          email: '142517@qq.com',
          description: '我是一个帅小伙'
        }
      ]
    }
  },
  methods: {
    handleClickImg(user) {
      const imgList = [{ fileName: `${user.name}的头像`, fileUrl: user.avatar, downloadLink: user.avatar }]
      this.$openBox.imgPreview({ imgList, defaultIndex: 0 })
    },
    toChat(data) {
      this.$router.push({ path: '/message/chat', query: { type: 'person', contactId: data.id }})
    }
  }
}
</script>

<style scoped>
.abl-container {
  padding: 20px;
}
::v-deep .abl-table td {
  padding: 5px 0;
}
.abl-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
}
.abl-chat-btn {
  display: none;
}
.el-table__row:hover .abl-chat-btn {
  display: inline-block;
}
</style>
