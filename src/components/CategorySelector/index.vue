<template>
  <el-card class="box-card" style="width: 99%">
    <el-form :inline="true" class="form-body">
      <el-form-item label="一级分类" class="form_item">
        <el-select
          :value="category1Id"
          placeholder="请选择一级分类"
          label="一级分类"
          @change="getCategory2List"
        >
          <el-option
            v-for="item in category1List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" class="form_item">
        <el-select
          :value="category2Id"
          placeholder="请选择二级分类"
          label="二级分类"
          @change="getCategory3List"
        >
          <el-option
            v-for="item in category2List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" class="form_item">
        <el-select
          :value="category3Id"
          placeholder="请选择三级分类"
          label="三级分类"
          @change="SET_CATEGORY3_ID"
        >
          <el-option
            v-for="item in category3List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "CategorySelector",
  mounted() {
    this.getCategory1List();
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("category", [
      "category1Id",
      "category2Id",
      "category3Id",
      "category1List",
      "category2List",
      "category3List",
    ]),
  },
  methods: {
    ...mapActions("category", [
      "getCategory1List",
      "getCategory2List",
      "getCategory3List",
    ]),
    ...mapMutations("category", ["SET_CATEGORY3_ID"]),
  },
};
</script>

<style  scoped>
.box-card {
  margin: 10px 10px;
}
.text {
  font-size: 14px;
}
.attr_text {
  font-size: 14px;
  margin-right: 10px;
}
.form-body {
  margin: 10px 0;
}
.form_item {
  margin-bottom: 0;
}
.item {
  padding: 18px 0;
}
.attr_table {
  margin: 20px 0;
}
.box-card {
  width: 480px;
}
</style>
