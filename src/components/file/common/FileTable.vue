<template>
  <div class="file-table-wrapper">
    <!-- 文件表格 -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      class="file-table"
      :class="['file-type-' + 0, routeName === 'Share' ? 'share' : '']"
      fit
      element-loading-text="文件加载中……"
      tooltip-effect="dark"
      :data="fileList"
      :highlight-current-row="true"
      @selection-change="handleSelectRow"
      @sort-change="handleSortChange"
      @row-contextmenu="handleContextMenu"
    >
      <!-- <el-table-column
        key="selection"
        type="selection"
        width="56"
        align="center"
      /> -->
      <el-table-column
        key="isDir"
        label
        prop="isDir"
        :width="screenWidth <= 768 ? 40 : 56"
        align="center"
        class-name="file-icon-column"
      >
        <template slot-scope="scope">
          <img
            :src="$file.setFileImg(scope.row)"
            :title="`${scope.row.isDir ? '' : '点击预览'}`"
            style="width: 30px; max-height: 30px; cursor: pointer"
            @click="
              $file.handleFileNameClick(scope.row, scope.$index, sortedFileList)
            "
          >
        </template>
      </el-table-column>
      <el-table-column
        key="fileName"
        prop="fileName"
        :sort-by="['isDir', 'fileName']"
        sortable
        show-overflow-tooltip
      >
        <template slot="header">
          <span>文件名</span>
        </template>
        <template slot-scope="scope">
          <span
            @click="
              $file.handleFileNameClick(scope.row, scope.$index, sortedFileList)
            "
          >
            <span
              class="file-name"
              style="cursor: pointer"
              :title="`${scope.row.isDir ? '' : '点击预览'}`"
              v-html="$file.getFileNameComplete(scope.row, true)"
            />
            <div v-if="screenWidth <= 768" class="file-info">
              {{ scope.row.updateTime }}
              <span class="file-size">
                {{
                  scope.row.isDir === 0
                    ? $file.calculateFileSize(scope.row.fileSize)
                    : ''
                }}
              </span>
            </div>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        key="filePath"
        label="路径"
        prop="filePath"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            style="cursor: pointer"
            title="点击跳转"
            @click="
              $router.push({
                query: { filePath: scope.row.filePath}
              })
            "
          >
            {{ scope.row.filePath }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="selectedColumnList.includes('belongType') && screenWidth > 768"
        key="belongType"
        label="所属类型"
        prop="belongType"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.belongType === 0 ? '项目' : '个人' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumnList.includes('extendName') && screenWidth > 768"
        key="extendName"
        label="文件类型"
        width="100"
        prop="extendName"
        :sort-by="['isDir', 'extendName']"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ $file.getFileType(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="selectedColumnList.includes('fileSize') && screenWidth > 768"
        key="fileSize"
        label="大小"
        width="100"
        prop="fileSize"
        :sort-by="['isDir', 'fileSize']"
        sortable
        align="right"
      >
        <template slot-scope="scope">
          {{
            scope.row.isDir === 0
              ? $file.calculateFileSize(scope.row.fileSize)
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        key="createTime"
        label="创建日期"
        prop="createTime"
        width="160"
        :sort-by="['isDir', 'createTime']"
        sortable
        align="center"
      />
      <el-table-column
        v-if="
          selectedColumnList.includes('updateTime') &&
            screenWidth > 768
        "
        key="updateTime"
        label="修改日期"
        prop="updateTime"
        width="160"
        :sort-by="['isDir', 'updateTime']"
        sortable
        align="center"
      />
      <!-- <el-table-column
        v-if="fileType === 8 && screenWidth > 768"
        key="shareType"
        label="分享类型"
        prop="shareType"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.shareType === 1 ? '私密' : '公共' }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        v-if="fileType === 8 && screenWidth > 768"
        key="shareTime"
        label="分享时间"
        prop="shareTime"
        width="160"
        :sort-by="['isDir', 'shareTime']"
        show-overflow-tooltip
        sortable
        align="center"
      /> -->
      <!-- <el-table-column
        v-if="fileType === 8 && screenWidth > 768"
        key="endTime"
        label="过期时间"
        prop="endTime"
        width="160"
        :sort-by="['isDir', 'endTime']"
        show-overflow-tooltip
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <i
              v-if="$file.getFileShareStatus(scope.row.endTime)"
              class="el-icon-warning"
            />
            <i v-else class="el-icon-time" />
            {{ scope.row.endTime }}
          </div>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        v-if="screenWidth <= 768"
        key="operation"
        label=""
        width="48"
      >
        <template slot-scope="scope">
          <i
            class="file-operate el-icon-more"
            :class="`operate-more-${scope.$index}`"
            @click="handleClickMore(scope.row, $event)"
          />
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'FileTable',
  props: {
    // 文件路径
    filePath: {
      required: true,
      type: String
    },
    // 文件列表
    fileList: {
      required: true,
      type: Array
    },
    // 文件加载状态
    loading: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      officeFileType: ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'],
      // 排序后的表格数据
      sortedFileList: []
    }
  },
  computed: {
    selectedColumnList() {
      return this.$store.getters.selectedColumnList
    },
    // 路由名称
    routeName() {
      return this.$route.name
    },
    // 屏幕宽度
    screenWidth() {
      return this.$store.state.common.screenWidth
    }
  },
  watch: {
    /**
		 * 文件路径变化时清空表格已选行
		 */
    filePath() {
      this.clearSelectedTable()
      this.$refs.multipleTable.clearSort()
    },
    /**
		 * 文件列表变化时清空表格已选行
		 */
    fileList() {
      this.clearSelectedTable()
      this.$refs.multipleTable.clearSort()
      this.sortedFileList = this.fileList
    }
  },
  methods: {
    /**
		 * 当表格的排序条件发生变化的时候会触发该事件
		 */
    handleSortChange() {
      console.log('出发')
      this.sortedFileList = this.$refs.multipleTable.tableData
      console.log(this.sortedFileList)
    },
    /**
		 * 表格某一行右键事件
		 * @description 打开右键菜单
		 * @param {object} row 当前行数据
		 * @param {object} column 当前列数据
		 * @param {object} event 当前右键元素
		 */
    handleContextMenu(row, column, event) {
      // 阻止右键事件冒泡
      event.cancelBubble = true
      // xs 以上的屏幕
      if (this.screenWidth > 768) {
        event.preventDefault()
        // 选中当前行
        this.$refs.multipleTable.setCurrentRow(row)
        this.$openBox
          .contextMenu({
            selectedFile: row,
            domEvent: event
          })
          .then((res) => {
            // 取消当前选中行
            this.$refs.multipleTable.setCurrentRow()
            if (res === 'confirm') {
              // 刷新文件列表
              this.$emit('getTableDataByType')
            }
          })
      }
    },
    /**
		 * 清空表格已选行
		 * @description 用于父组件调用 | 本组件调用，请勿删除
		 */
    clearSelectedTable() {
      this.$refs.multipleTable.clearSelection()
    },
    /**
		 * 表格选择项发生变化时的回调函数
		 * @param {[]} selection 勾选的行数据
		 */
    handleSelectRow(selection) {
      this.$store.commit('changeSelectedFiles', selection)
      this.$store.commit('changeIsBatchOperation', selection.length !== 0)
    },
    /**
		 * 更多图标点击事件
		 * @description 打开右键菜单
		 * @param {object} row 当前行数据
		 * @param {object} event 当前右键元素
		 */
    handleClickMore(row, event) {
      this.$refs.multipleTable.setCurrentRow(row) // 选中当前行
      this.$openBox
        .contextMenu({
          selectedFile: row,
          domEvent: event
        })
        .then((res) => {
          // 取消当前选中行
          this.$refs.multipleTable.setCurrentRow()
          if (res === 'confirm') {
            // 刷新文件列表
            this.$emit('getTableDataByType')
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.file-table-wrapper {
  margin-top: 2px;

  .file-type-0 {
    height: calc(100vh - 206px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 262px) !important;
    }
  }

  .file-type-6 {
    height: calc(100vh - 211px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 263px) !important;
    }
  }

  .file-table.share {
    height: calc(100vh - 109px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 161px) !important;
    }
  }

  .file-table {
    width: 100% !important;
    height: calc(100vh - 203px);

    >>> .el-table__header-wrapper {
      th {
        // background: $tabBackColor;
        padding: 4px 0;
        color: $RegularText;
      }

      .el-icon-circle-plus, .el-icon-remove {
        margin-left: 6px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          color: $Primary;
        }
      }
    }

    >>> .el-table__body-wrapper {
      height: calc(100vh - 255px);
      overflow-y: auto;
      setScrollbar(6px, transparent, #C0C4CC);

      td {
        padding: 8px 0;

        .file-name {
          .keyword {
            color: $Danger;
          }
        }
      }

      .el-icon-warning {
        font-size: 16px;
        color: $Warning;
      }

      .el-icon-time {
        font-size: 16px;
        color: $Success;
      }
    }
  }
}

.right-menu-list {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid $BorderLighter;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 4px 0;
  color: $RegularText;

  .right-menu-item,
  .unzip-item {
    padding: 0 16px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;

    &:hover {
      background: $PrimaryHover;
      color: $Primary;
    }

    i {
      margin-right: 8px;
    }
  }

  .unzip-menu-item {
    position: relative;

    &:hover {
      .unzip-list {
        display: block;
      }
    }

    .unzip-list {
      position: absolute;
      display: none;

      .unzip-item {
        width: 200px;
        setEllipsis(1)
      }
    }
  }
}

.right-menu-list,
.unzip-list {
  background: #fff;
  border: 1px solid $BorderLighter;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 4px 0;
  color: $RegularText;
}
</style>
