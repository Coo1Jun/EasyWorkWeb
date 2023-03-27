<template>
  <el-dialog
    :visible.sync="workItemVisible"
    width="90%"
    top="4vh"
    @closed="closeDialog"
  >
    <div class="container">
      <!-- 左边 -->
      <div class="content">hello</div>
      <!-- 右边 -->
      <div class="attribute">
        <el-collapse v-model="collapseActiveName">
          <el-collapse-item title="属性" name="1">
            <div class="attribute-item">
              <div style="width: 120px;font-size: 14px">优先级</div>
              <el-rate
                v-model="workItem.priority"
                show-text
                :texts="['最低', '较低', '普通', '较高', '最高']"
                :colors=" { 1: '#73d897', 3: { value: '#6698ff', excluded: true }, 4: { value: '#f6c659', excluded: true }, 5: { value: '#ff9f73', excluded: true }, 6: '#ff7575' }"
                @change="priorityCheck"
              />
            </div>
            <div class="attribute-item">
              <div style="width: 120px;font-size: 14px">风险</div>
              <el-rate
                v-model="workItem.risk"
                show-text
                :texts="['低', '中', '高']"
                :colors=" { 1: '#73d897', 3: { value: '#f6c659', excluded: true }, 4: '#ff7575' }"
                :max="3"
                @change="riskCheck"
              />
            </div>
          </el-collapse-item>
          <el-collapse-item title="基础信息" name="2">
            <div class="basic-info">
              <div>
                <span class="basic-info-item">项目</span>
                <span>项目名称</span>
              </div>
              <div>
                <span class="basic-info-item">创建人</span>
                <span style="margin-right: 5px"><el-avatar :size="'small'" src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/default_user.png" /></span>
                <span>李正帆</span>
              </div>
              <div>
                <span class="basic-info-item">创建时间</span>
                <span>2023年3月27日 20:18:36</span>
              </div>
              <div>
                <span class="basic-info-item">更新人</span>
                <span style="margin-right: 5px"><el-avatar :size="'small'" src="https://easywork23.oss-cn-shenzhen.aliyuncs.com/attachment/default_user.png" /></span>
                <span>李正帆</span>
              </div>
              <div>
                <span class="basic-info-item">更新时间</span>
                <span>2023年3月27日 20:18:36</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CardPreview',
  props: {
    visable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      workItemVisible: false,
      collapseActiveName: ['1', '2'], // collapse默认展开的菜单
      priorityOldValue: 0, // 优先级的旧值
      riskOldValue: 0, // 优先级的旧值
      workItem: {
        title: '',
        priority: 0,
        risk: 0
      }
    }
  },
  watch: {
    visable(newVal) {
      console.log(newVal)
      this.workItemVisible = newVal
    }
  },
  beforeDestroy() {
    // 解绑所有自定义事件
    this.$off()
  },
  methods: {
    closeDialog() {
      this.$emit('set-visable', false)
    },
    priorityCheck(value) {
      if (value !== 0) {
        if (value === this.priorityOldValue) {
          this.workItem.priority = 0
          this.priorityOldValue = 0
        } else {
          this.priorityOldValue = value
        }
      }
      // 因为change事件，每次评分的时候都会触发，即使评分是相同的也会
      // todo 发请求 改优先级
    },
    riskCheck(value) {
      if (value !== 0) {
        if (value === this.riskOldValue) {
          this.workItem.risk = 0
          this.riskOldValue = 0
        } else {
          this.riskOldValue = value
        }
      }
      // todo 发请求 改风险等级
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 540px;
}
.content {
  width: 70%;
  width: 70%;
  margin-right: 10px;
  padding-right: 20px;
  overflow-x: hidden;
}
.attribute {
  width: 30%;
  margin-left: 10px;
  padding-right: 10px;
  overflow-y: hidden;
  overflow: auto;
}
.attribute .basic-info div {
  margin: 15px 0;
}
.attribute span {
  font-size: 14px;
  /* 让span成为行内块元素，就可以设置宽度，并且可以设置垂直居中 */
  display: inline-block;
  vertical-align: middle;
}
.basic-info-item {
  width: 120px;
}
.el-collapse {
  border: none;
}
.attribute-item {
  display: flex;
  margin: 15px 0;
}
</style>
