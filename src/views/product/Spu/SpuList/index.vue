<template>
  <div>
    <el-card class="box-card">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3Id"
        class="btn"
      >
        添加属性</el-button
      >
      <el-table
        :data="spuList"
        border
        style="width: 100%"
        class="attr_table"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              content="添加SKU"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="修改SPU"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="small"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="查看SKU列表"
              placement="top"
            >
              <el-button
                type="info"
                icon="el-icon-info"
                size="small"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除SPU"
              placement="top"
            >
              <el-button
                type="danger"
                class="el-icon-delete"
                size="small"
                @click="deleteSpu(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 6, 9, 12]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper, total, sizes"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { reqGetSpuList, reqDeleteSpu } from "../../../../api/product/spu";
import { mapState } from "vuex";
export default {
  name: "SpuList",
  data() {
    return {
      currentPage: 1,
      pageSize: 3,
      total: 0,
      loading: false,
      spuList: [],
    };
  },
  computed: {
    ...mapState("category", ["category3Id"]),
  },
  components: {},
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSpuList(this.currentPage, pageSize);
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getSpuList(currentPage, this.pageSize);
    },

    async getSpuList(currentPage, pageSize) {
      const { category3Id } = this;
      this.loading = true;
      const res = await reqGetSpuList({
        page: currentPage,
        limit: pageSize,
        category3Id,
      });
      this.spuList = res.records;
      this.total = res.total;
      this.loading = false;
    },
    async deleteSpu(row) {
      this.$confirm(`此操作将永久删除 ${row.spuName} 属性, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await reqDeleteSpu(row.id);

        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getSpuList(this.currentPage, this.pageSize);
      });
    },
  },
  watch: {
    category3Id: {
      handler() {
        this.getSpuList(this.currentPage, this.pageSize);
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>
