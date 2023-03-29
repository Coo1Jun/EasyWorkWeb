<template>
  <div v-if="$route.name === 'Group'" class="group-container">
    <div class="group-title-name">
      我加入的项目组
    </div>
    <el-table
      :data="group"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="name"
        label="项目组名称"
        width="120"
      />
      <el-table-column
        prop="createBy"
        label="创建人"
        width="120"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="120"
      />
      <el-table-column
        prop="desc"
        label="描述"
        show-overflow-tooltip
      />
      <el-table-column
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="toMember(scope.row)"
          >查看组成员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="group-title-name">
      我创建的项目组
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="float: right"
        @click="addProjectGroupVisible = true"
      >
        新建项目组
      </el-button>
    </div>
    <el-table
      :data="group"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="name"
        label="项目组名称"
        width="120"
      />
      <el-table-column
        prop="createBy"
        label="创建人"
        width="120"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="120"
      />
      <el-table-column
        prop="desc"
        label="描述"
        show-overflow-tooltip
      />
      <el-table-column
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="toMember(scope.row)"
          >查看组成员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建项目组 -->
    <el-dialog
      title="新建项目组"
      :visible.sync="addProjectGroupVisible"
      width="500px"
      @closed="closeDialog"
    >
      <el-form
        ref="newGroup"
        :model="newGroup"
        label-width="100px"
        :rules="groupRules"
      >
        <el-form-item label="项目组名称" prop="name">
          <el-input v-model="newGroup.name" placeholder="请输入项目组名称" maxlength="32" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="newGroup.desc" type="textarea" placeholder="请输入项目组描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addProjectGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <router-view v-else />
</template>

<script>

export default {
  name: 'Group',
  components: { },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入项目组名称'))
      } else {
        callback()
      }
    }
    return {
      addProjectGroupVisible: false,
      group: [
        {
          id: '1',
          name: 'xxx项目组',
          desc: 'xxx项目组的描述',
          createBy: '李正帆',
          createTime: '2023-03-29'
        }
      ],
      newGroup: {
        name: '',
        desc: ''
      },
      groupRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ]
      }
    }
  },
  methods: {
    closeDialog() {
      // 关闭dialog重置表单
      this.$refs.newGroup.resetFields()
    },
    addGroup() {
      this.$refs.newGroup.validate(valid => {
        if (valid) {
          this.addProjectVisible = false
          console.log('新建的项目组', this.newGroup)

          // todo向后端发请求

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
    toMember(row) {
      this.$router.push({ name: 'GroupMember', params: { groupId: row.id }})
    }
  }

}
</script>

<style scoped>
.group-container {
  padding: 40px 20px;
}
.group-title-name {
  font-size: 25px;
  color: #333333;
  margin: 30px 0;
}
</style>
