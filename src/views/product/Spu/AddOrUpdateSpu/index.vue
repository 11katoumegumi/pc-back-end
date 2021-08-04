<template>
  <el-card class="box-card topMargin">
    <el-form :model="spu" :rules="rules" ref="form">
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
        <el-select
          v-model="baseSaleAttr"
          :placeholder="`还剩${baseSaleAttrList.length}个销售属性`"
        >
          <el-option
            v-for="bsa in baseSaleAttrList"
            :key="bsa.id"
            :label="bsa.name"
            :value="`${bsa.id}:${bsa.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!baseSaleAttr"
          >添加销售属性值</el-button
        >
        <el-table
          :data="spu.spuSaleAttrList"
          border
          style="width: 100%"
          class="attr_table"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column label="属性名称">
            <template v-slot="{ row }">
              <span>{{ row.saleAttrName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spuSaleAttrList" label="属性值列表">
            <template v-slot="{ row, $index }">
              <el-tag
                v-for="(ssav, index) in row.spuSaleAttrValueList"
                class="tag-with-margin-right"
                :key="ssav.saleAttrValueName"
                closable
                @close="deleteSaleValue(row.spuSaleAttrValueList, index)"
                >{{ ssav.saleAttrValueName }}</el-tag
              >

              <el-button
                size="mini"
                icon="el-icon-plus"
                v-show="!row.isEdit"
                @click="showEdit(row, $index)"
                >添加属性值</el-button
              >

              <el-input
                v-show="row.isEdit"
                size="mini"
                class="attrValueInput"
                v-model="spuSaleAttrValueName"
                :ref="$index"
                placeholder="请输入属性值"
                @blur="setAttrValue(row)"
                @keyup.enter.native="$event.target.blur"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
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
                  @click="deleteSaleAttr(row, $index)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="handleCancelClick">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  reqGetTrademarkList,
  reqGetSaleAttrList,
  reqGetSpuSaleAttrList,
  reqSaveSpuInfo,
} from "../../../../api/product/spu";
import { mapState } from "vuex";
export default {
  name: "AddOrUpdateSpu",
  data() {
    const SaleAttrListValidator = (rule, value, callback) => {
      /*
        rule 规则名称 包含字段
        value 校验值的情况
        callback 必须要调用
          callback() 通过
          callback(xxx) 失败
      */
      if (!this.spu.spuSaleAttrList.length) {
        callback("至少输入一个销售属性");
        return;
      }
      const hasSpuSaleAttrValueList = this.spu.spuSaleAttrList.every(
        (saleAttr) => !!saleAttr.spuSaleAttrValueList.length
      );
      if (!hasSpuSaleAttrValueList) {
        callback("每个销售属性都要添加至少一个属性值");
        return;
      }
      callback();
    };
    return {
      loading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      baseSaleAttr: "",
      baseSaleAttrList: [],
      spuSaleAttrValueName: "",

      spu: {
        trademarkList: [],
        spuImageList: [],
        spuSaleAttrList: [],
      },
      rules: {
        spuName: [
          { required: true, message: "请输入SPU名称", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "请选择品牌ID", trigger: "change" }],
        description: [
          { required: true, message: "请输入SPU描述", trigger: "blur" },
        ],
        spuImageList: [
          { required: true, message: "请上传SPU图片", trigger: "blur" },
        ],
        spuSaleAttrList: [
          { required: true, validator: SaleAttrListValidator, trigger: "blur" },
        ],
      },
      baseAPI: process.env.VUE_APP_BASE_API,
    };
  },
  computed: {
    ...mapState("category", ["category3Id"]),
  },
  async mounted() {
    const res = await Promise.allSettled([
      reqGetTrademarkList(),
      reqGetSaleAttrList(),
      reqGetSpuSaleAttrList(),
    ]);
    this.spu.trademarkList = res[0].value;
    this.baseSaleAttrList = res[1].value;
    //this.spu.spuSaleAttrList = res[2].value.spuSaleAttrList;
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
    handleCancelClick() {
      this.$emit("changeIsShow", 1);
    },
    //添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.baseSaleAttr.split(":");
      //1 给table添加一行属性
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      //2. 销售属性要删除一个
      this.baseSaleAttrList = this.baseSaleAttrList.filter((item) => {
        return item.id !== +baseSaleAttrId;
      });
      this.baseSaleAttr = "";
    },
    //删除销售属性
    deleteSaleAttr(row, index) {
      this.spu.spuSaleAttrList.splice(index, 1);

      this.baseSaleAttrList.push({
        id: +row.baseSaleAttrId,
        name: row.saleAttrName,
      });
      this.baseSaleAttrList.sort();
    },
    showEdit(row, index) {
      this.$set(row, "isEdit", true);
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    setAttrValue(row) {
      if (this.spuSaleAttrValueName) {
        row.spuSaleAttrValueList.push({
          saleAttrValueName: this.spuSaleAttrValueName,
          baseSaleAttrId: +row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
        });
        this.spuSaleAttrValueName = "";
      }
      row.isEdit = false;
    },
    deleteSaleValue(spuSaleAttrValueList, index) {
      spuSaleAttrValueList.splice(index, 1);
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { category3Id } = this;
          const { spuName, tmId, description, spuImageList, spuSaleAttrList } =
            this.spu;
          const data = {
            category3Id,
            spuName,
            tmId,
            description,
            spuImageList,
            spuSaleAttrList,
          };
          await reqSaveSpuInfo(data);
          this.$message({
            type: "success",
            message: "添加成功!",
          });
        }
      });
    },
  },
};
</script>

<style>
.topMargin {
  margin-top: 50px;
}
.attrValueInput {
  width: 80px;
}
.tag-with-margin-right {
  margin-right: 10px;
}
.attr_table {
  margin-top: 20px;
}
</style>
