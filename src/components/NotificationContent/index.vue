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
</style>
