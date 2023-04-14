<template>
  <div class="breadcrumb-wrapper">
    <div class="title">当前位置：</div>
    <div
      class="breadcrumb-box"
    >
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="(item, index) in breadCrumbList"
          :key="index"
          :to="getRouteQuery(item)"
        >{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    // 文件路径
    filePath: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      breadCrumbList: [
        {
          path: '/',
          name: '全部文件',
          dirId: null
        }
      ]
    }
  },
  watch: {
    '$route.query'() {
      // console.log('query参数改变：', this.$route.query)
      const filePath = this.$route.query.filePath
      const filePathList = filePath.split('/')
      const res = []
      for (const query of this.breadCrumbList) {
        res.push(query)
        if (filePath === query.path) {
          break
        }
      }
      // 如果res的长度等于breadCrumbList，说明这次的路由是新的
      if (res.length === this.breadCrumbList.length) {
        this.breadCrumbList.push({
          path: filePath,
          dirId: this.$route.query.dirId,
          name: filePathList[filePathList.length - 1]
        })
      } else {
        this.breadCrumbList = res
      }
    }
  },
  methods: {
    // 获取文件参数
    getRouteQuery(item) {
      return { query: { filePath: item.path, dirId: item.dirId }}
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.breadcrumb-wrapper {
  padding: 0;
  height: 30px;
  line-height: 30px;
  display: flex;

  .title,
  >>> .el-breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  .file-path-input {
    flex: 1;
    font-size: 14px;
  }
  .breadcrumb-box {
    padding: 0 8px;
    flex: 1;
    display: flex;
    &.able-input {
      cursor: pointer;
      &:hover {
        background: $tabBackColor;
      }
    }
  }
}
</style>
