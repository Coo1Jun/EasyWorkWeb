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
      <div class="current-page-count">当前页{{ fileList.length }}条</div>
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
// import * as fileApi from '@/api/fileApi'
// import * as recoveryFileApi from '@/api/recoveryFileApi'
// import * as shareApi from '@/api/shareApi'

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
      loading: false,
      fileList: [
        {
          'creatorId': 2,
          'createTime': '2023-04-09 15:16:16',
          'updaterId': 2,
          'updateTime': '2023-04-09 15:16:16',
          'remark': null,
          'deleted': 0,
          'fileId': null,
          'timeStampName': null,
          'fileUrl': null,
          'fileSize': null,
          'storageType': null,
          'pointCount': null,
          'identifier': null,
          'userFileId': '1644962412387078145',
          'userId': 2,
          'fileName': '文件夹',
          'filePath': '/',
          'extendName': '',
          'isDir': 1,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 13:52:28',
          'updaterId': 2,
          'updateTime': '2023-04-09 15:28:06',
          'remark': null,
          'deleted': 0,
          'fileId': '1644941323174907905',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/956cf7e8-2710-4f3e-ac75-75fffbb4944a.txt',
          'fileSize': 0,
          'storageType': 0,
          'pointCount': null,
          'identifier': '9394248e89344f899fe65d7ed1199027',
          'userFileId': '1644941323439149057',
          'userId': 2,
          'fileName': '重命名文本',
          'filePath': '/',
          'extendName': 'txt',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 12:26:44',
          'updaterId': 2,
          'updateTime': '2023-04-09 19:52:55',
          'remark': null,
          'deleted': 0,
          'fileId': '1644914392119291906',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/9a5f6918ff9d6266ca4ba144ee71e954.jpg',
          'fileSize': 146628,
          'storageType': 0,
          'pointCount': null,
          'identifier': '9a5f6918ff9d6266ca4ba144ee71e954',
          'userFileId': '1644919749755453443',
          'userId': 2,
          'fileName': 'cloudy',
          'filePath': '/',
          'extendName': 'jpg',
          'isDir': 0,
          'deleteTime': '2023-04-09 19:52:08',
          'deleteBatchNum': '',
          'imageWidth': 2400,
          'imageHeight': 1602
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 12:26:44',
          'updaterId': 2,
          'updateTime': '2023-04-09 12:29:58',
          'remark': null,
          'deleted': 0,
          'fileId': '1644914400109441025',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/1a00dc29fb213e7000380c7279c71f94.jpg',
          'fileSize': 476059,
          'storageType': 0,
          'pointCount': null,
          'identifier': '1a00dc29fb213e7000380c7279c71f94',
          'userFileId': '1644919749755453442',
          'userId': 2,
          'fileName': 'partly cloudy',
          'filePath': '/',
          'extendName': 'jpg',
          'isDir': 0,
          'deleteTime': '2023-04-09 12:29:14',
          'deleteBatchNum': 'efa7bbaf-57e3-47d9-bcd7-6afef2ca0571',
          'imageWidth': 6016,
          'imageHeight': 4016
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 17:25:55',
          'updaterId': 2,
          'updateTime': '2023-04-09 17:25:55',
          'remark': null,
          'deleted': 0,
          'fileId': '1644995041010356226',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/2793516f5d073c1e44748ea12a6a8f07.mp3',
          'fileSize': 9946574,
          'storageType': 0,
          'pointCount': null,
          'identifier': '2793516f5d073c1e44748ea12a6a8f07',
          'userFileId': '1644995041073270786',
          'userId': 2,
          'fileName': '房东的猫 - 云烟成雨',
          'filePath': '/',
          'extendName': 'mp3',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 13:50:30',
          'updaterId': 2,
          'updateTime': '2023-04-09 13:50:30',
          'remark': null,
          'deleted': 0,
          'fileId': '1644940828586774529',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/b6cff58597a57a2bc397c6c27aebe3d9.png',
          'fileSize': 806435,
          'storageType': 0,
          'pointCount': null,
          'identifier': 'b6cff58597a57a2bc397c6c27aebe3d9',
          'userFileId': '1644940828653883393',
          'userId': 2,
          'fileName': '404',
          'filePath': '/',
          'extendName': 'png',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': 3840,
          'imageHeight': 2160
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 18:03:20',
          'updaterId': 2,
          'updateTime': '2023-04-09 18:03:20',
          'remark': null,
          'deleted': 0,
          'fileId': '1645004457071841281',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/5a1592eaa6010a8e6a55d33d608171ae.mp4',
          'fileSize': 114716,
          'storageType': 0,
          'pointCount': null,
          'identifier': '5a1592eaa6010a8e6a55d33d608171ae',
          'userFileId': '1645004457206059009',
          'userId': 2,
          'fileName': '书法',
          'filePath': '/',
          'extendName': 'mp4',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 13:50:46',
          'updaterId': 2,
          'updateTime': '2023-04-09 13:50:46',
          'remark': null,
          'deleted': 0,
          'fileId': '1644940898614874113',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/043d4eff64a0e80fb4b2b640e789b953.java',
          'fileSize': 21575,
          'storageType': 0,
          'pointCount': null,
          'identifier': '043d4eff64a0e80fb4b2b640e789b953',
          'userFileId': '1644940898681982978',
          'userId': 2,
          'fileName': 'java',
          'filePath': '/',
          'extendName': 'java',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 18:07:41',
          'updaterId': 2,
          'updateTime': '2023-04-09 18:26:11',
          'remark': null,
          'deleted': 0,
          'fileId': '1645005553672622082',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/217a5fc090ce11e7f6a049de134a6cd8.mp4',
          'fileSize': 1031290448,
          'storageType': 0,
          'pointCount': null,
          'identifier': '217a5fc090ce11e7f6a049de134a6cd8',
          'userFileId': '1645005553735536641',
          'userId': 2,
          'fileName': '影视剧\n',
          'filePath': '/',
          'extendName': 'mp4',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 13:51:25',
          'updaterId': 2,
          'updateTime': '2023-04-09 13:54:16',
          'remark': null,
          'deleted': 0,
          'fileId': '1644941062075289601',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/3d88174e6959ba3fd65be3897e4e7a35.mp4',
          'fileSize': 143090215,
          'storageType': 0,
          'pointCount': null,
          'identifier': '3d88174e6959ba3fd65be3897e4e7a35',
          'userFileId': '1644941062142398465',
          'userId': 2,
          'fileName': '视频\n',
          'filePath': '/',
          'extendName': 'mp4',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 13:51:49',
          'updaterId': 2,
          'updateTime': '2023-04-09 13:51:49',
          'remark': null,
          'deleted': 0,
          'fileId': '1644941159404113922',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/74d69a3ff1b247a9a59bd8f9a821eb1d.docx',
          'fileSize': 2339528,
          'storageType': 0,
          'pointCount': null,
          'identifier': '74d69a3ff1b247a9a59bd8f9a821eb1d',
          'userFileId': '1644941159467028482',
          'userId': 2,
          'fileName': 'word',
          'filePath': '/',
          'extendName': 'docx',
          'isDir': 0,
          'deleteTime': null,
          'deleteBatchNum': null,
          'imageWidth': null,
          'imageHeight': null
        },
        {
          'creatorId': 2,
          'createTime': '2023-04-09 13:51:49',
          'updaterId': 2,
          'updateTime': '2023-04-09 13:51:49',
          'remark': null,
          'deleted': 0,
          'fileId': '1644941162008776705',
          'timeStampName': null,
          'fileUrl': 'upload/20230409/ea14147effa439b5d66b8d8f353b6f58.pdf',
          'fileSize': 2612109,
          'storageType': 0,
          'pointCount': null,
          'identifier': 'ea14147effa439b5d66b8d8f353b6f58',
          'userFileId': '1644941162071691265',
          'userId': 2,
          'fileName': 'pdf',
          'filePath': '/',
          'extendName': 'pdf',
          'isDir': 0,
          'deleteTime': '2023-04-09 17:45:26',
          'deleteBatchNum': '',
          'imageWidth': null,
          'imageHeight': null
        }
      ],
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
      const data = {
        filePath: this.filePath,
        currentPage: Number(this.pageData.currentPage),
        pageCount: Number(this.pageData.pageCount)
      }
      console.log('当前文件路径：', this.filePath)
      console.log('当前页：', this.pageData.currentPage)
      console.log('每页几条：', this.pageData.pageCount)
      // fileApi.getFileListByPath(data).then((res) => {
      //   if (res.success) {
      //     this.fileList = res.dataList
      //     this.pageData.total = Number(res.total)
      //     this.loading = false
      //   }
      // })
    },
    /**
		 * 表格数据获取相关事件 | 获取文件列表数据
		 */
    getTableDataByType() {
      // this.loading = true
      console.log('现在搜索框没有搜索内容')
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
      const data = {
        shareFilePath: this.filePath,
        shareBatchNum: this.$route.query.shareBatchNum,
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }
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
      // this.loading = true
      const data = {
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount,
        fileName: fileName
      }
      console.log('搜索文件=》start')
      console.log('当前页：', this.pageData.currentPage)
      console.log('每页几条：', this.pageData.pageCount)
      console.log('文件名称：', fileName)
      console.log('搜索文件=》end')
      // fileApi.searchFile(data).then((res) => {
      //   this.loading = false
      //   if (res.success) {
      //     this.fileList = res.dataList.map((item) => {
      //       return {
      //         ...item,
      //         highlightFields: item.highLight.fileName[0]
      //       }
      //     })
      //     this.pageData.total = res.data.totalHits
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
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
