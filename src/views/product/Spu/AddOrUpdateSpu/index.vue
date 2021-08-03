<template>
  <el-card class="box-card">
    <el-form :model="spu" :rules="rules">
      <el-form-item label="SPU名称" label-width="80px" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName" />
      </el-form-item>
      <el-form-item label="SPU品牌" label-width="80px" prop="tmId">
        <el-select placeholder="请选择SPU品牌" v-model="spu.tmId">
          <el-option
            v-for="tm in spu.trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SKU描述" label-width="80px" prop="description">
        <el-input
          type="textarea"
          rows="2"
          placeholder="请输入SKU描述"
          v-model="spu.description"
        />
      </el-form-item>
      <el-form-item label="SKU图片" label-width="80px" prop="spuImageList">
        <el-upload
          :action="`${baseAPI}/admin/product/fileUpload`"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/jpeg,image/png"
          :class="{ 'spu-img-upload': spu.spuImageList.length >= 3 }"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" label-width="80px" prop="spuSaleAttrList">
        <el-select v-model="spuId">
          <el-option
            v-for="bsa in baseSaleAttrList"
            :key="bsa.id"
            :label="bsa.name"
            :value="bsa.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        <!--         <el-table
          :data="attrList"
          border
          style="width: 100%"
          class="attr_table"
          v-loading="loading"
        >
          <el-table-column prop="categoryId" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称"> </el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                class="tag"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template v-slot="{ row }">
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
        </el-table> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  reqGetTrademarkList,
  reqGetSaleAttrList,
  reqGetSpuSaleAttrList,
} from "../../../../api/product/spu";
export default {
  name: "AddOrUpdateSpu",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuId: "",
      baseSaleAttrList: [],
      spu: {
        spuName: "",
        tmId: "",
        description: "",
        trademarkList: [],
        spuImageList: [],
        spuSaleAttrList: [],
      },
      rules: {
        spuName: [{ required: true, massage: "请输入SPU名称", trigger: blur }],
        tmId: [{ required: true, massage: "请选择品牌ID", trigger: blur }],
        description: [
          { required: true, massage: "请输入SPU描述", trigger: blur },
        ],
        spuImageList: [
          { required: true, massage: "请上传SPU图片", trigger: blur },
        ],
        spuSaleAttrList: [
          { required: true, massage: "请选择销售属性", trigger: blur },
        ],
      },
      baseAPI: process.env.VUE_APP_BASE_API,
    };
  },
  async mounted() {
    const res = await Promise.allSettled([
      reqGetTrademarkList(),
      reqGetSaleAttrList(),
      reqGetSpuSaleAttrList(1535),
    ]);
    this.spu.trademarkList = res[0].value;
    this.baseSaleAttrList = res[1].value;
    this.spu.spuSaleAttrList = res[2].value.spuSaleAttrList;
    console.log(this.spu.spuSaleAttrList);
  },
  methods: {
    // 上传成功触发的回调
    handleAvatarSuccess(res, file) {
      // 保存数据
      this.spu.spuImageList.push({
        imgName: file.name,
        imgUrl: res.data,
      });
      // this.trademark.logoUrl = res.data;
      // 清空图片表单校验结果
      // this.$refs.form.clearValidate(["logoUrl"]);
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
      // 返回值 true 可以上传
      // 返回值 false 不会上传
      return isValidFileType && isLt;
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // 将数据删除
      this.spu.spuImageList = this.spu.spuImageList.filter(
        (img) => img.imgUrl !== file.response.data
      );
    },
    handlePictureCardPreview(file) {
      // file：当前点击的这个图片文件
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style>
</style>
