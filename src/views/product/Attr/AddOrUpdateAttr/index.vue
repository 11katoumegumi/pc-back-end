<template>
  <el-card class="box-card">
    <el-form inline :rules="rules" :model="attr">
      <el-form-item label="属性名" prop="attrName">
        <el-input v-model="attr.attrName" placeholder="请输入属性名"></el-input>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      icon="el-icon-plus"
      class="btnWithBottomMargin"
      :disabled="!attr.attrName"
      @click="addAttrValue"
      >添加属性值</el-button
    >
    <el-table
      :data="attrValueList"
      :disabled="!attr.attrName"
      style="width: 100%"
      class="container-table"
      v-loading="loading"
    >
      <el-table-column type="index" align="center" label="序号" width="50">
      </el-table-column>
      <el-table-column label="属性值名称">
        <template v-slot="{ row, $index }">
          <el-input
            :id="`input${$index}`"
            size="mini"
            placeholder="请输入属性值名称"
            v-model="row.valueName"
            @change="setAttrValue($index)"
            v-show="row.isSpanHide"
          ></el-input>
          <span v-show="!row.isSpanHide" @click="isSpanHide = true">{{
            row.valueName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除属性值"
            placement="top"
          >
            <el-button
              type="danger"
              class="el-icon-delete"
              size="small"
              @click="deleteAttrValue($index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" class="btnWithTopMargin">确定</el-button>
    <el-button class="btnWithTopMargin">取消</el-button>
  </el-card>
</template>

<script>
export default {
  name: "AddOrUpdateAttr",
  data() {
    return {
      attrValueList: [],
      loading: false,
      attr: {
        attrName: "",
        valueName: "", // 临时属性值
        isSpanHide: true,
      },
      rules: {
        attrName: { required: true, message: "请输入属性名", trigger: "blur" },
      },
    };
  },
  methods: {
    addAttrValue() {
      this.attrValueList.push({
        id: this.attrValueList.length
          ? this.attrValueList[this.attrValueList.length - 1].id + 1
          : 1,
        valueName: "",
        isSpanHide: true,
      });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    setAttrValue(index) {
      if (!this.attrValueList[index].valueName) {
        this.$refs.input.focus();
        document.querySelector(`#input${index}`).focus();
        return;
      }
      this.attrValueList[index].isSpanHide = false;
    },

    deleteAttrValue(index) {
      this.attrValueList.splice(index, 1);
    },
  },
};
</script>

<style>
.btnWithTopMargin {
  margin-top: 20px;
}
.btnWithBottomMargin {
  margin-bottom: 20px;
}
</style>
