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
    }
  },
  computed: {
    /**
		 * 面包屑导航栏数组
		 */
    breadCrumbList: {
      get() {
        const filePath = this.$route.query.filePath
        console.log('444444444444444查询参数改变：', filePath)
        const filePathList = filePath ? filePath.split('/') : ['全部文件']
        const res = [] //  返回结果数组
        const _path = [] //  存放祖先路径
        for (let i = 0; i < filePathList.length; i++) {
          if (filePathList[i]) {
            _path.push(filePathList[i])
            res.push({
              path: _path.join('/'),
              name: filePathList[i]
            })
          } else if (i === 0) {
            //  根目录
            filePathList[i] = ''
            _path.push(filePathList[i])
            res.push({
              path: '/',
              name: '全部文件'
            })
          }
        }
        console.log('结111111果', res)
        return res
      },
      set() {
        return []
      }
    }
  },
  methods: {
    // 获取文件参数
    getRouteQuery(item) {
      return { query: { filePath: item.path }}
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
