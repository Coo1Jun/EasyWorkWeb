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
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="请输入项目名称"
          :style="{width: '300px'}"
          @input="handleInput"
        />
      </span>
      <span class="search-result">{{ projectCount }}个项目</span>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        stripe
      >
        <el-table-column
          prop="projectName"
          label="项目"
          sortable
        />
        <el-table-column
          prop="tab"
          label="标识"
          width="250"
        />
        <el-table-column
          prop="createBy"
          label="创建人"
          width="250"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable
          width="250"
          :formatter="formatterDate"
        />
      </el-table>
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
        <el-form-item label="部门" prop="deptId">
          <el-select v-model="projectInfo.deptId" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="dept in depts" :key="dept.id" :label="dept.deptName" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="projectInfo.projectName" placeholder="请输入项目名称" maxlength="32" show-word-limit />
        </el-form-item>
        <el-form-item label="项目标识" prop="tab">
          <el-input v-model="projectInfo.tab" placeholder="大写字母和数字，15个字符以内" />
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
export default {
  name: 'Projects',
  components: { },
  data() {
    const validateDept = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择部门'))
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
        // 项目标识 非必填
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('英文字母/数字/下划线/连接线（不超过15字符）'))
      } else if (this.existTab(value)) {
        callback(new Error('该标识已被项目/项目集使用，请改用其他标识'))
      } else {
        callback()
      }
    }
    return {
      keyword: '',
      addProjectVisible: false,
      projectInfo: {
        deptId: '',
        projectName: '',
        tab: '',
        description: ''
      },
      depts: [
        {
          id: '1',
          deptName: '部门1'
        },
        {
          id: '2',
          deptName: '部门2'
        }, {
          id: '3',
          deptName: '部门3'
        }
      ],
      tableData: [],
      basicData: [
        {
          id: '1',
          projectName: '项目名1',
          tab: 'P1',
          createBy: '创建人1',
          updateTime: '2023-5-20 14:00:00'
        },
        {
          id: '2',
          projectName: '项目名2',
          tab: 'P2',
          createBy: '创建人2',
          updateTime: '2023-3-20 14:00:00'
        },
        {
          id: '3',
          projectName: '项目名3',
          tab: 'P3',
          createBy: '创建人3',
          updateTime: '2023-6-20 14:00:00'
        },
        {
          id: '4',
          projectName: '项目名4',
          tab: 'P4',
          createBy: '创建人4',
          updateTime: '2023-1-20 14:00:00'
        }
      ],
      projectRules: {
        deptId: [
          { required: true, trigger: 'blur', validator: validateDept }
        ],
        projectName: [
          { required: true, trigger: 'blur', validator: validateProName }
        ],
        tab: [
          { required: false, trigger: 'blur', validator: validateTab }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    projectCount() {
      return this.tableData.length
    }
  },
  watch: {
    'projectInfo.tab'(newVal, oldVal) {
      this.projectInfo.tab = newVal.toUpperCase()
    }
  },
  mounted() {
    this.tableData = this.basicData
  },
  methods: {
    formatterDate(row, column, cellValue) {
      return cellValue
    },
    handleInput() {
      if (this.keyword === '') {
        this.tableData = this.basicData
        return
      }
      this.tableData = this.basicData.filter(data => data.projectName.includes(this.keyword))
    },
    existTab(value) {
      return this.basicData.filter(data => data.tab === value).length > 0
    },
    addProject() {
      this.$refs.projectInfo.validate(valid => {
        if (valid) {
          this.addProjectVisible = false

          // todo向后端发请求

          const maxId = this.basicData.reduce((maxId, data) => (data.id > maxId ? data.id : maxId), 0) + 1

          const date = new Date()
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()
          const hours = date.getHours()
          const minutes = date.getMinutes()
          const seconds = date.getSeconds()
          // 在月份和日期前面补零
          const formattedMonth = String(month).padStart(2, '0')
          const formattedDay = String(day).padStart(2, '0')
          const formattedHours = String(hours).padStart(2, '0')
          const formattedMinutes = String(minutes).padStart(2, '0')
          const formattedSeconds = String(seconds).padStart(2, '0')
          const newDate = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
          this.basicData.push({
            id: maxId,
            projectName: this.projectInfo.projectName,
            tab: this.projectInfo.tab,
            createBy: this.userInfo.realName,
            updateTime: newDate
          })
          this.handleInput()
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 3000 // 持续时间为 3 秒
          })
        } else {
          return false
        }
      })
    },
    closeDialog() {
      // 关闭dialog重置表单
      this.$refs.projectInfo.resetFields()
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
</style>
