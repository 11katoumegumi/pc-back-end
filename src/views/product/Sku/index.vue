<template>
  <el-card class="container">
    <el-table :data="skuList">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" class="defaultImage" />
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="handleDelete(row)"
          ></el-button>
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
    ></el-pagination>
  </el-card>
</template>

<script>
import { reqSkuList, reqdeleteSku } from '../../../api/product/sku'
export default {
  name: 'Sku',
  mounted() {
    this.getSkuList()
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      total: 0,
      skuList: []
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSkuList()
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getSkuList()
    },
    async getSkuList() {
      const res = await reqSkuList(this.currentPage, this.pageSize)
      this.skuList = res.records
      this.total = res.total
    },
    async handleDelete(row) {
      await reqdeleteSku(row.id)
      this.$message({
        type: 'success',
        message: '删除SKU成功'
      })
      this.getSkuList()
    }
  }
}
</script>

<style scoped>
.defaultImage {
  width: 125px;
  height: 125px;
}
</style>
