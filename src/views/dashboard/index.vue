<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="14">
        <el-card class="db-work-card">
          <div slot="header">
            <span>我的任务</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div class="db-work-item">
            <el-collapse v-model="workActiveNames">
              <el-collapse-item title="已延期" name="delayed">
                <template slot="title">
                  <span style="font-size: 16px;color: #333333">已延期</span>
                </template>
                <WorkItemList :work-items="delayedWorkItem" />
              </el-collapse-item>
              <el-collapse-item title="即将截止" name="nearDelay">
                <template slot="title">
                  <span style="font-size: 16px;color: #333333">即将截止</span>
                </template>
                <WorkItemList :work-items="nearDelayWorkItem" />
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10"><div class="grid-content bg-purple" /></el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import WorkItemList from '@/components/WorkItemList'
import { getNearDelayWorkItemApi, getDelayedWorkItemApi } from '@/api/workitem'

export default {
  name: 'Dashboard',
  components: { WorkItemList },
  data() {
    return {
      workActiveNames: ['delayed', 'nearDelay'],
      delayedWorkItem: [],
      nearDelayWorkItem: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    // 获取用户已经延期的工作项
    getDelayedWorkItemApi().then(res => {
      this.delayedWorkItem = res.data
    })
    // 获取用户即将延期的工作项（截止日期小于三天）
    getNearDelayWorkItemApi().then(res => {
      this.nearDelayWorkItem = res.data
    })
  }
}
</script>

<style lang="css" scoped>
.dashboard-container {
  padding: 20px 10px;
}
.db-work-card {
  /* height: 70%; */
}
.db-work-item {
  overflow: auto;
  height: 530px;
  padding-bottom: 20px;
}
.bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
