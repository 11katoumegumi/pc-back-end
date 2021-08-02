<template>
  <el-card class="container">
    <el-button type="primary" @click="showSaveTrademark">添加品牌</el-button>

    <el-table
      :data="trademarkList"
      border
      class="container-table"
      v-loading="loading"
    >
      <el-table-column label="序号" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <!--
          可以通过作用域插槽，给当前列传递一个slotScoped对象里面包含了:
            slotScoped.$index 下标
            slotScoped.row 当前行数据
         -->
        <template v-slot="{ row }">
          <img class="trademark-img" :src="row.logoUrl" :alt="row.tmName" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="warning" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
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

    <el-dialog :visible.sync="visible" title="添加品牌">
      <el-form :model="trademark" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${baseAPI}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png并且小于500kb的图片
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button @click="addTrademark" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  reqGetTrademarkList,
  reqSaveTrademark,
} from "../../../api/product/trademark";

export default {
  name: "Trademark",
  mounted() {
    this.getTrademarkList(this.currentPage, this.pageSize);
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 3,
      total: 100,
      trademarkList: [],
      loading: false,
      visible: false,
      trademark: {
        tmName: "",
        logoUrl: "",
      },
      baseAPI: process.env.VUE_APP_BASE_API,
      // 表单校验规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请上传品牌LOGO", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    async getTrademarkList(currentPage, pageSize) {
      this.loading = true;
      const res = await reqGetTrademarkList(currentPage, pageSize);
      this.trademarkList = res.records;
      this.total = res.total;
      this.loading = false;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTrademarkList(this.currentPage, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTrademarkList(currentPage, this.pageSize);
    },
    // 上传成功触发
    handleAvatarSuccess(res) {
      this.trademark.logoUrl = res.data;
      // 清空图片表单校验结果
      this.$refs.form.clearValidate(["logoUrl"]);
    },
    // 上传之前触发的回调
    beforeAvatarUpload(file) {
      // file 上传的图片文件信息
      // file.type 文件类型
      const validFileType = ["image/jpeg", "image/jpg", "image/png"];
      const isValidFileType = validFileType.indexOf(file.type) > -1;
      // file.size 文件大小
      const isLt = file.size / 1024 < 500;

      if (!isValidFileType) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过 500KB!");
      }
      //  true 可以上传
      // false 不会上传
      return isValidFileType && isLt;
    },
    // 添加品牌
    addTrademark() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { tmName, logoUrl } = this.trademark;
          await reqSaveTrademark(tmName, logoUrl);
          this.$message({
            type: "success",
            message: "添加品牌成功~",
          });
          this.getTrademarkList(this.currentPage, this.pageSize);
          this.visible = false;
        }
      });
    },
    // 显示添加品牌对话框
    showSaveTrademark() {
      this.visible = true;
      // 清空表单
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
  },
};
</script>

<style lang="sass">
.trademark-img
  width: 150px
  height: 100px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  .avatar
    width: 178px
    height: 178px
    display: block
</style>
