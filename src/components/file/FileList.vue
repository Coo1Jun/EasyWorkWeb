<template>
  <div class="file-list-wrapper">
    <!-- 操作按钮 -->
    <el-header height="auto">
      <OperationMenu
        :file-path="filePath"
        @getSearchFileList="getSearchFileList"
        @getTableDataByType="getTableDataByType"
      />
    </el-header>
    <div class="middle-wrapper">
      <!-- 面包屑导航栏 -->
      <BreadCrumb
        class="breadcrumb"
        :file-path="filePath"
        @getTableDataByType="getTableDataByType"
      />
    </div>
    <!-- 文件列表-表格模式 -->
    <FileTable
      v-if="fileModel === 0"
      :file-path="filePath"
      :file-list="fileList"
      :loading.sync="loading"
      @getTableDataByType="getTableDataByType"
      @click.native.right="handleClickRight"
    />
    <!-- 文件列表-网格模式 -->
    <FileGrid
      v-if="fileModel === 1"
      :file-path="filePath"
      :file-list="fileList"
      :loading="loading"
      @getTableDataByType="getTableDataByType"
      @click.native.right="handleClickRight"
    />
    <div class="pagination-wrapper">
      <div class="current-page-count">当前页{{ fileList && fileList.length }}条</div>
      <!-- 回收站不展示分页组件 -->
      <el-pagination
        background
        :current-page="pageData.currentPage"
        :page-size="pageData.pageCount"
        :total="pageData.total"
        :page-sizes="[10, 50, 100, 200]"
        :layout="
          screenWidth <= 768
            ? 'total, prev, next, jumper'
            : 'sizes, total, prev, pager, next'
        "
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu.vue'
import BreadCrumb from '@/components/file/common/BreadCrumb.vue'
import FileTable from '@/components/file/common/FileTable.vue'
import FileGrid from '@/components/file/components/FileGrid.vue'
import { getNetDiskListApi } from '@/api/netdisk'

export default {
  name: 'FileList',
  components: {
    OperationMenu,
    BreadCrumb,
    FileTable,
    FileGrid
  },
  data() {
    return {
      fileNameSearch: '',
      loading: true,
      fileList: [],
      pageData: {
        currentPage: 1,
        pageCount: 50,
        total: 0
      }
    }
  },
  computed: {
    // 当前所在路径
    filePath() {
      return this.$route.query.filePath ? this.$route.query.filePath : '/'
    },
    // 当前目录id
    dirId() {
      return this.$route.query.dirId
    },
    // 文件查看模式 0列表模式 1网格模式 2 时间线模式
    fileModel() {
      return this.$store.getters.fileModel
    },
    // 屏幕宽度
    screenWidth() {
      return this.$store.state.common.screenWidth
    }
  },
  watch: {
    filePath() {
      this.setPageCount()
      this.getTableDataByType()
    },
    // 监听文件查看模式
    fileModel() {
      this.setPageCount()
    }
  },
  created() {
    this.setPageCount()
    this.getTableDataByType()
  },
  methods: {
    /**
		 * 表格数据获取相关事件 | 获取当前路径下的文件列表
		 */
    showFileList() {
      this.loading = true
      const params = {
        filePath: this.filePath,
        dirId: this.dirId,
        pageNo: Number(this.pageData.currentPage),
        limit: Number(this.pageData.pageCount),
        fileName: this.fileNameSearch
      }
      getNetDiskListApi(params).then(res => {
        this.fileList = res.data.records
        this.pageData.total = res.data.total
        this.loading = false
      })
      this.loading = false
    },
    /**
		 * 表格数据获取相关事件 | 获取文件列表数据
		 */
    getTableDataByType() {
      this.loading = true
      // 全部文件
      this.showFileList()
    },
    /**
		 * 文件展示区域的空白处右键事件
		 * @param {Document} event 右键事件对象
		 */
    handleClickRight(event) {
      event.preventDefault()
      this.$openBox
        .contextMenu({
          selectedFile: undefined,
          domEvent: event,
          serviceEl: this
        })
        .then((res) => {
          if (res === 'confirm') {
            // 刷新文件列表
            this.getTableDataByType()
          }
        })
    },
    /**
		 * 表格数据获取相关事件 | 调整分页大小
		 */
    setPageCount() {
      this.pageData.currentPage = 1
      if (this.fileModel === 0) {
        this.pageData.pageCount = 50
      }
      if (this.fileModel === 1) {
        this.pageData.pageCount = 100
      }
    },
    /**
		 * 表格数据获取相关事件 | 分页组件 | 当前页码改变
		 */
    handleCurrentChange(currentPage) {
      this.pageData.currentPage = currentPage
      this.getTableDataByType()
    },
    /**
		 * 表格数据获取相关事件 | 分页组件 | 页大小改变时
		 */
    handleSizeChange(pageCount) {
      this.pageData.pageCount = pageCount
      this.getTableDataByType()
    },
    /**
		 * 表格数据获取相关事件 | 获取回收站文件列表
		 */
    showFileRecovery() {
      // recoveryFileApi.getRecoveryFile().then((res) => {
      //   if (res.success) {
      //     this.fileList = res.dataList
      //     this.loading = false
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    /**
		 * 表格数据获取相关事件 | 获取我的分享列表
		 */
    showMyShareFile() {
      // const data = {
      //   shareFilePath: this.filePath,
      //   shareBatchNum: this.$route.query.shareBatchNum,
      //   currentPage: this.pageData.currentPage,
      //   pageCount: this.pageData.pageCount
      // }
      // shareApi.getMyShareFileList(data).then((res) => {
      //   if (res.success) {
      //     this.fileList = res.dataList
      //     this.pageData.total = Number(res.total)
      //     this.loading = false
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },

    /**
		 * 获取搜索文件结果列表
		 * @param {string} fileName 文件名称
		 */
    getSearchFileList(fileName) {
      this.loading = true
      const params = {
        filePath: this.filePath,
        dirId: this.dirId,
        pageNo: Number(this.pageData.currentPage),
        limit: Number(this.pageData.pageCount),
        fileName: fileName
      }
      getNetDiskListApi(params).then(res => {
        this.fileList = res.data.records
        this.pageData.total = res.data.total
        this.loading = false
      })
      this.loading = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.file-list-wrapper {
  >>> .el-header {
    padding: 0;
  }

  .middle-wrapper {
    margin-bottom: 8px;
  }

  .pagination-wrapper {
    position: relative;
    border-top: 1px solid $BorderBase;
    height: 44px;
    line-height: 44px;
    text-align: center;

    .current-page-count {
      position: absolute;
      left: 16px;
      height: 32px;
      line-height: 32px;
      font-size: 13px;
      color: $RegularText;
    }
  }
}
</style>
