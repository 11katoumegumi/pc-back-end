<template>
  <div>
    <!-- 属性选项 -->
    <CategorySelector />

    <!-- 列表 -->
    <el-card class="box-card" v-if="!isAddOrUpdateShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3Id"
        class="btn"
        @click="isAddOrUpdateShow = true"
      >
        添加属性
      </el-button>
      <el-table
        :data="attrList"
        border
        style="width: 100%"
        class="attr_table"
        v-loading="loading"
      >
        <el-table-column
          prop="categoryId"
          label="序号"
          width="50"
        ></el-table-column>
        <el-table-column prop="attrName" label="属性名称"></el-table-column>
        <el-table-column prop="attrValueList" label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              class="tag"
            >
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
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
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                class="el-icon-delete"
                size="small"
                @click="deleteAttr(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <AddOrUpdateAttr
      :categoryId="category3Id"
      v-else
      :isAddOrUpdateShow.sync="isAddOrUpdateShow"
    />
  </div>
</template>

<script>
import AddOrUpdateAttr from './AddOrUpdateAttr'
import CategorySelector from '../../../components/CategorySelector'
import { mapState } from 'vuex'
import { reqGetAttrValueList, reqDeleteAttr } from '../../../api/product/attr'
export default {
  name: 'Attr',
  mounted() {},
  data() {
    return {
      attrList: [],
      loading: false,
      isAddOrUpdateShow: false
    }
  },
  computed: {
    ...mapState('category', ['category1Id', 'category2Id', 'category3Id'])
  },
  watch: {
    category3Id: {
      async handler() {
        if (!this.category3Id) {
          this.attrList = []
          return
        }
        this.getAttrList()
      },
      immediate: true
    }
  },
  components: {
    CategorySelector,
    AddOrUpdateAttr
  },
  methods: {
    async getAttrList() {
      this.loading = true
      const res = await reqGetAttrValueList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      )
      this.loading = false
      this.attrList = res
    },
    async deleteAttr(row) {
      this.$confirm(
        `此操作将永久删除 ${row.attrName} 属性, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        await reqDeleteAttr(row.id)

        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getAttrList()
      })
    }
  }
}
</script>

<style scoped>
.tag {
  margin: 0 10px;
}
.btn {
  margin-bottom: 20px;
}
.box-card {
  margin: 10px 10px;
}
</style>
