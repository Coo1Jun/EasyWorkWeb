<template>
  <div v-if="$route.name === 'Department'" class="dept-container">
    <div>
      <div class="title-name">全部项目<el-button type="primary" icon="el-icon-plus" style="float: right">新建项目</el-button></div>
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
        />
      </el-table>
    </div>
  </div>
  <router-view v-else />
</template>

<script>

export default {
  name: 'Department',
  components: { },
  data() {
    return {
      keyword: '',
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
      ]
    }
  },
  computed: {
    projectCount() {
      return this.tableData.length
    }
  },
  mounted() {
    this.tableData = this.basicData
  },
  methods: {
    formatter(row, column, cellValue) {
      return row.address
    },
    handleInput() {
      if (this.keyword === '') {
        this.tableData = this.basicData
        return
      }
      this.tableData = this.basicData.filter(data => data.projectName.includes(this.keyword))
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
