<template>
  <div class="gm-container">
    <div class="gm-title-name">
      {{ groupInfo.name }}
    </div>
    <div class="gm-search">
      <span>
        <el-input
          v-model="searchWord"
          prefix-icon="el-icon-search"
          placeholder="搜索用户名或邮箱"
          :style="{width: '300px'}"
          @input="handleSearch"
        />
      </span>
      <span class="gm-search-result">{{ memberCount }}个成员</span>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="float: right"
        @click="addGroupMemberVisible = true"
      >
        添加成员
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column
        prop="name"
        label="用户名"
      />
      <el-table-column
        prop="email"
        label="邮箱"
      />
      <el-table-column
        prop="role"
        label="角色"
      />
    </el-table>

    <el-dialog
      title="添加成员"
      :visible.sync="addGroupMemberVisible"
      width="600px"
      top="10vh"
    >
      <div class="gm-add-member-dialog">
        <el-tabs v-model="activeName">
          <el-tab-pane label="邮箱邀请" name="invite">
            <div style="margin-bottom: 20px">邮箱</div>
            <div
              v-for="(e, index) in emailInvite"
              :key="index"
              style="display: flex;margin-bottom: 20px"
            >
              <el-input
                v-model="emailInvite[index]"
                placeholder="请输入邮箱"
              />
              <el-button type="danger" icon="el-icon-delete" circle plain style="margin-left: 10px" @click="deleteEmailInvite(index)" />
            </div>
            <el-link type="primary" @click="addEmailCount">
              <i class="el-icon-plus" />
              添加
            </el-link>
          </el-tab-pane>
          <el-tab-pane label="邀请记录" name="record">配置管理</el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupMemberVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroupMember">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'GroupMember',
  components: { },
  data() {
    return {
      addGroupMemberVisible: false,
      searchWord: '',
      activeName: 'invite',
      tableData: [],
      groupMember: [
        {
          id: '1',
          name: '李正帆',
          email: '11111@qq.com',
          role: '管理员'
        }
      ],
      emailInvite: ['', '', '']
    }
  },
  computed: {
    groupInfo() {
      return this.$route.params.groupInfo
    },
    memberCount() {
      return this.groupMember ? this.groupMember.length : 0
    }
  },
  mounted() {
    this.tableData = this.groupMember
    // todo 根据groupId拿数据 this.$route.params.groupInfo.id
  },
  beforeRouteEnter(to, from, next) {
    // 当前组件需要groupId才可以渲染，如果没有，则跳转到项目组界面
    if (!to.params.groupInfo) {
      next('/console/group')
    }
    next()
  },
  methods: {
    handleSearch() {
      if (this.searchWord === '') {
        this.tableData = this.groupMember
        return
      }
      this.tableData = this.groupMember.filter(data => (data.name.includes(this.searchWord) || data.email.includes(this.searchWord)))
    },
    addGroupMember() {
      console.log(this.emailInvite)
      // todo 发请求
      this.addGroupMemberVisible = false

      // 初始化emailInvite
      this.emailInvite = []
      for (let i = 0; i < 3; i++) {
        this.emailInvite.push('')
      }
    },
    addEmailCount() {
      this.emailInvite.push('')
    },
    deleteEmailInvite(index) {
      this.emailInvite.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.gm-container {
  padding: 40px 20px;
}
.gm-title-name {
  font-size: 25px;
  color: #333333;
  margin: 30px 0;
}
.gm-search {
  margin-top: 30px;
  margin-bottom: 20px;
}
.gm-search-result {
  color: #999999;
  margin-left: 30px;
}
.gm-add-member-dialog {
  height: 400px;
  overflow: auto;
  padding: 0 20px;
}
</style>
