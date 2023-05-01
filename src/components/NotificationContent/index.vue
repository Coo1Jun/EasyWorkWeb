<template>
  <div>
    <div v-if="data.type === 'friend'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      <span class="nc-from-name">{{ data.fromName }}</span>请求添加你为好友
    </div>
    <div v-if="data.type === 'work'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      <span class="nc-from-name">{{ data.fromName }}</span>
      在工作项
      <span class="nc-work-item-title">
        [ {{ data.projectTab }} - {{ data.workItem.number }} ]
        {{ data.workItem.title }}
      </span>
      中将你添加为负责人
    </div>
    <div v-if="data.type === 'group'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      <span class="nc-from-name">{{ data.fromName }}</span>邀请你进入<span class="nc-group-name">{{ data.group.name }}</span>项目组
    </div>
    <div v-if="data.type === 'warn'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      <span>工作项</span>
      <span class="nc-work-item-title">
        [ {{ data.projectTab }} - {{ data.workItem.number }} ]
        {{ data.workItem.title }}
      </span>
      即将截止，请尽快完成
    </div>
    <div v-if="data.type === 'new_schedule'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      <span class="nc-from-name">{{ data.fromName }}</span>创建了日程<span class="nc-strong">{{ data.schedule.title }}</span>
      <span>，时间为</span><span class="nc-strong">{{ data.schedule.startTime }} - {{ data.schedule.endTime }}</span>
      <span>，请及时参加</span>
    </div>
    <div v-if="data.type === 'schedule'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      您有一个日程<span class="nc-strong">{{ data.schedule.title }}</span>
      <span>即将开始，时间为</span><span class="nc-strong">{{ data.schedule.startTime }} - {{ data.schedule.endTime }}</span>
      <span>，请及时参加</span>
    </div>
    <div v-if="data.type === 'todo'"><el-badge style="margin-right: 5px" is-dot class="item" :hidden="data.isRead === 1" />
      您有一个待办<span class="nc-strong">{{ data.todoList.title }}</span><span>，</span>
      <span style="color: #409eff;margin-right: 4px">{{ data.todoList.reminderTime }}</span><span>分钟后截止，截止时间为</span><span class="nc-strong">{{ data.todoList.endTime }}</span>
      <span>，请及时完成</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationContent',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.nc-from-name {
  margin-right: 4px;
  color: #409eff
}
.nc-work-item-title {
  margin: 0 4px;
  color: #409eff
}
.nc-group-name {
  margin: 0 4px;
  color: #409eff
}
.nc-strong {
  margin: 0 4px;
  color: #409eff
}
</style>
