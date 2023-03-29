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
        @click="addProjectGroupVisible = true"
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
  </div>
</template>

<script>

export default {
  name: 'GroupMember',
  components: { },
  data() {
    return {
      searchWord: '',
      tableData: [],
      groupMember: [
        {
          id: '1',
          name: '李正帆',
          email: '11111@qq.com',
          role: '管理员'
        }
      ]
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
</style>
