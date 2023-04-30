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
    <div v-if="enablePage" style="float: right;margin-top: 20px;margin-bottom: 20px">
      <el-pagination
        background
        :current-page.sync="page.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="page.pageSize"
        :pager-count="5"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'AddressBookList',
  components: { },
  props: {
    data: {
      type: Array,
      required: true
    },
    enablePage: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  beforeDestroy() {
    // 解绑所有自定义事件
    this.$off()
  },
  methods: {
    handleClickImg(user) {
      const imgList = [{ fileName: `${user.name}的头像`, fileUrl: user.avatar, downloadLink: user.avatar }]
      this.$openBox.imgPreview({ imgList, defaultIndex: 0 })
    },
    toChat(data) {
      // this.$router.push({ path: '/message/chat', query: { type: 'person', contactId: data.id }})
      this.$router.push({ name: 'Chat', params: { type: 'person', contactId: data.id }})
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.$emit('page-change', this.page.currentPage, this.page.pageSize)
    },
    handleCurrentChange() {
      this.$emit('page-change', this.page.currentPage, this.page.pageSize)
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
