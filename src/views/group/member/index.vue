<template>
  <div class="gm-container">
    <div class="gm-title-name">
      {{ groupInfo.name }}
    </div>
    <div class="gm-search">
      <span>
        <el-input
          v-model="search.name"
          prefix-icon="el-icon-search"
          placeholder="搜索用户名"
          :style="{width: '200px', 'margin-right': '20px'}"
          @blur="handleSearch"
        />
      </span>
      <span>
        <el-input
          v-model="search.email"
          prefix-icon="el-icon-search"
          placeholder="搜索邮箱"
          :style="{width: '200px'}"
          @blur="handleSearch"
        />
      </span>
      <span class="gm-search-result">{{ page.total }}个成员</span>
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
      :data="groupMember"
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
      @closed="closeDialog"
    >
      <div class="gm-add-member-dialog">
        <el-tabs v-model="activeName">
          <el-tab-pane label="邮箱邀请" name="invite">
            <div style="margin-bottom: 20px">邮箱</div>
            <div>
              <el-form ref="emailInvite" :model="emailInvite" :rules="emailsRule">
                <el-form-item v-for="(e, index) in emailInvite.emails" :key="index" :prop="`email${index}`">
                  <div style="display: flex">
                    <el-input
                      v-model="emailInvite.emails[index]"
                      placeholder="请输入邮箱"
                      :name="`email${index}`"
                    />
                    <el-button v-if="emailInvite.emails.length > 1" type="danger" icon="el-icon-delete" circle plain style="margin-left: 10px" @click="deleteEmailInvite(index)" />
                  </div>
                </el-form-item>
              </el-form>
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
    <div style="float: right;margin-top: 20px">
      <el-pagination
        background
        :current-page.sync="page.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="page.pageSize"
        :pager-count="5"
        layout="sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

import { getMemberListApi } from '@/api/group'

export default {
  name: 'GroupMember',
  components: { },
  data() {
    return {
      search: { name: '', email: '' },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      addGroupMemberVisible: false,
      activeName: 'invite',
      groupMember: [
        {
          id: '1',
          name: '李正帆',
          email: '11111@qq.com',
          role: '管理员'
        }
      ],
      emailInvite: { emails: ['', '', ''] },
      emailsRule: {}
    }
  },
  computed: {
    groupInfo() {
      return this.$route.params.groupInfo
    }
  },
  async mounted() {
    this.buildRule()
    // todo 根据groupId拿数据 this.$route.params.groupInfo.id
    const memberList = await getMemberListApi({ groupId: this.$route.params.groupInfo.id })
    this.groupMember = memberList.data.records
    this.page.total = memberList.data.total
  },
  beforeRouteEnter(to, from, next) {
    // 当前组件需要groupId才可以渲染，如果没有，则跳转到项目组界面
    if (!to.params.groupInfo) {
      next('/console/group')
    }
    next()
  },
  methods: {
    async handleSearch() {
      const memberList = await getMemberListApi({
        groupId: this.$route.params.groupInfo.id,
        name: this.search.name,
        email: this.search.email,
        limit: this.page.pageSize,
        pageNo: this.page.currentPage
      })
      this.groupMember = memberList.data.records
      this.page.total = memberList.data.total
    },
    addGroupMember() {
      this.$refs.emailInvite.validate((valid) => {
        if (valid) {
          console.log(this.emailInvite)
          // todo 发请求

          this.addGroupMemberVisible = false
          // 初始化emailInvite
          this.emailInvite = { emails: [] }
          for (let i = 0; i < 3; i++) {
            this.emailInvite.emails.push('')
          }
          this.$refs.emailInvite.clearValidate()
          this.buildRule()
        } else {
          return false
        }
      })
    },
    addEmailCount() {
      this.emailInvite.emails.push('')
      this.buildRule()
    },
    deleteEmailInvite(index) {
      this.emailInvite.emails.splice(index, 1)
      this.buildRule()
    },
    buildRule() {
      // 创建对于每个 input 的验证规则
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/
      const rule = {}
      this.emailInvite.emails.forEach((email, index) => {
        rule[`email${index}`] = [{ trigger: 'blur', validator: (rule, value, callback) => {
          value = this.emailInvite.emails[index]
          if (value && !reg.test(value)) {
            callback(new Error('请输入正确的邮箱格式'))
          } else {
            callback()
          }
        } }]
      })
      this.emailsRule = rule
    },
    closeDialog() {
      // 初始化emailInvite
      this.emailInvite = { emails: [] }
      for (let i = 0; i < 3; i++) {
        this.emailInvite.emails.push('')
      }
      this.$refs.emailInvite.clearValidate()
      this.buildRule()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.handleSearch()
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
