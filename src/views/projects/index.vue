<template>
  <div class="dept-container">
    <div>
      <div class="title-name">
        全部项目
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float: right"
          @click="addProjectVisible = true"
        >
          新建项目
        </el-button>
      </div>
    </div>
    <div class="search">
      <span>
        <el-input
          v-model="search.name"
          prefix-icon="el-icon-search"
          placeholder="请输入项目名称"
          :style="{width: '200px', 'margin-right': '20px'}"
          @blur="handleSearch"
        />
      </span>
      <span>
        <el-input
          v-model="search.tab"
          prefix-icon="el-icon-search"
          placeholder="请输入项目标识"
          :style="{width: '200px'}"
          @blur="handleSearch"
        />
      </span>
      <span class="search-result">{{ page.total }}个项目</span>
    </div>
    <div>
      <el-table
        :data="projects"
        style="width: 100%"
        stripe
        row-class-name="row-hand"
        @row-click="handleRowClick"
      >
        <el-table-column
          prop="projectName"
          label="项目"
          sortable
        />
        <el-table-column
          prop="projectTab"
          label="标识"
          width="150"
        />
        <el-table-column
          prop="groupName"
          label="所属项目组"
          width="250"
        />
        <el-table-column
          prop="createBy"
          label="创建人"
          width="200"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
          width="200"
          :formatter="formatterDate"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable
          width="200"
          :formatter="formatterDate"
        />
      </el-table>
    </div>
    <div style="float: right;margin-top: 20px;margin-bottom: 20px">
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
    <el-dialog
      title="新建项目"
      :visible.sync="addProjectVisible"
      width="500px"
      @closed="closeDialog"
    >
      <el-form
        ref="projectInfo"
        :model="projectInfo"
        label-width="80px"
        :rules="projectRules"
      >
        <el-form-item label="项目组" prop="groupId">
          <el-select v-model="projectInfo.groupId" placeholder="请选择项目组" style="width: 100%;">
            <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="projectInfo.projectName" placeholder="请输入项目名称" maxlength="32" show-word-limit />
        </el-form-item>
        <el-form-item label="项目标识" prop="tab">
          <el-input v-model="projectInfo.tab" maxlength="15" show-word-limit placeholder="大写字母和数字，15个字符以内" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="projectInfo.description" type="textarea" placeholder="请输入项目描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addProjectVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGroupListApi } from '@/api/group'
import { getProjectListApi, addProjectApi } from '@/api/project'

export default {
  name: 'Projects',
  components: { },
  data() {
    const validateDept = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择项目组'))
      } else {
        callback()
      }
    }
    const validateProName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入项目名称'))
      } else {
        callback()
      }
    }
    const reg = /^[a-zA-Z0-9_-]{1,15}$/
    const validateTab = (rule, value, callback) => {
      if (!value) {
        // 项目标识 必填
        callback(new Error('请输入项目标识'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('英文字母/数字/下划线/连接线（不超过15字符）'))
      } else if (this.existTab(value)) {
        callback(new Error('该标识已被使用，请改用其他标识'))
      } else {
        callback()
      }
    }
    return {
      search: { name: '', tab: '' },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      addProjectVisible: false,
      projectInfo: {
        groupId: '',
        projectName: '',
        tab: '',
        description: ''
      },
      groups: [],
      projects: [],
      projectRules: {
        groupId: [
          { required: true, trigger: 'blur', validator: validateDept }
        ],
        projectName: [
          { required: true, trigger: 'blur', validator: validateProName }
        ],
        tab: [
          { required: true, trigger: 'blur', validator: validateTab }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'curProject'])
  },
  watch: {
    'projectInfo.tab'(newVal, oldVal) {
      this.projectInfo.tab = newVal.toUpperCase()
    }
  },
  async mounted() {
    // 获取项目组信息列表
    const groupResponse = await getGroupListApi()
    this.groups = groupResponse.data.records
    // 获取项目信息列表
    const projectResponse = await getProjectListApi()
    this.projects = projectResponse.data.records
    this.page.total = projectResponse.data.total
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 如果不是由项目概览页面跳转来的，且项目id不为空，直接跳转到
      if (from.name !== 'Details' && vm.curProject && vm.curProject.id) {
        next({ path: '/mission/projects/details' })
      } else {
        // 否则则进入到当前组件，且设置curPro为空
        vm.$store.dispatch('project/setCurProject', null)
        next()
      }
    })
  },
  methods: {
    formatterDate(row, column, cellValue) {
      return cellValue
    },
    existTab(value) {
      return this.projects.filter(data => data.projectTab === value).length > 0
    },
    addProject() {
      this.$refs.projectInfo.validate(async(valid) => {
        if (valid) {
          // todo向后端发请求
          const response = await addProjectApi({
            groupId: this.projectInfo.groupId,
            name: this.projectInfo.projectName,
            tab: this.projectInfo.tab,
            description: this.projectInfo.description
          })
          if (response.success) {
            this.addProjectVisible = false
            this.handleSearch()
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 3000 // 持续时间为 3 秒
            })
          }
        } else {
          return false
        }
      })
    },
    closeDialog() {
      // 关闭dialog重置表单
      this.$refs.projectInfo.resetFields()
    },
    handleRowClick(row, column, event) {
      console.log(row)
      console.log(column)
      console.log(event)
      // 将当前选择的项目id放在vuex里
      this.$store.dispatch('project/setCurProject', row)
      // 跳转到/mission/projects/details
      this.$router.push('/mission/projects/details')
    },
    async handleSearch() {
      const projectResponse = await getProjectListApi({
        name: this.search.name,
        tab: this.search.tab,
        limit: this.page.pageSize,
        pageNo: this.page.currentPage
      })
      this.projects = projectResponse.data.records
      this.page.total = projectResponse.data.total
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
.dept-container {
  padding: 40px;
}
.title-name {
  font-size: 25px;
  color: #333333;
}
.search {
  margin-top: 30px;
}
.search-result {
  color: #999999;
  margin-left: 30px;
}
::v-deep .row-hand {
  cursor: pointer;
}
</style>
