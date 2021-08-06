<template>
  <el-card class="box-card">
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input-number
          controls-position="right"
          :min="1"
          v-model="sku.price"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量">
        <el-input-number
          controls-position="right"
          :min="1"
          v-model="sku.weight"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input
          type="textarea"
          placeholder="请输入SKU描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-row>
          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-form-item :label="attr.attrName">
              <el-select
                placeholder="请选择平台属性值"
                v-model="sku.skuAttrValueList[index]"
              >
                <el-option
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                  :value="
                    `${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`
                  "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-row>
          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            v-for="(spuSaleAttr, index) in spu.spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-form-item :label="spuSaleAttr.saleAttrName">
              <el-select
                placeholder="请选择销售属性值"
                v-model="sku.skuSaleAttrValueList[index]"
              >
                <el-option
                  v-for="ssav in spuSaleAttr.spuSaleAttrValueList"
                  :key="ssav.id"
                  :label="ssav.saleAttrValueName"
                  :value="
                    `${spuSaleAttr.id}:${spuSaleAttr.saleAttrName}:${ssav.id}:${ssav.saleAttrName}`
                  "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="SKU图片">
        <el-table
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            width="50"
            type="selection"
            align="center"
          ></el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" class="table-image" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-show="row.isDefault === '0'"
                @click="setDefaultImage(row)"
              >
                设置默认图片
              </el-button>
              <el-button
                type="success"
                size="mini"
                v-show="row.isDefault === '1'"
                disabled
              >
                默认图片
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <template v-slot="{ row }">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  reqSpuBySpuId,
  reqSpuImageListBySpuId,
  reqSaveSkuInfo
} from '../../../../api/product/sku'

import { reqGetAttrValueList } from '../../../../api/product/attr'

import { mapState } from 'vuex'
export default {
  name: 'AddOrUpdateSku',
  computed: {
    ...mapState('category', ['category1Id', 'category2Id', 'category3Id']),
    ...mapState('spu', ['spuId'])
  },
  data() {
    return {
      spu: {},
      spuImageList: [],
      attrList: [],
      sku: {
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
        skuDefaultImg: ''
      }
    }
  },
  async mounted() {
    const { spuId, category1Id, category2Id, category3Id } = this
    const [spuRes, spuImageListRes, AttrListRes] = await Promise.allSettled([
      reqSpuBySpuId(spuId),
      reqSpuImageListBySpuId(spuId),
      reqGetAttrValueList(15, 91, 861)
    ])

    if (spuRes.status === 'fulfilled') {
      this.spu = spuRes.value
    }
    if (spuImageListRes.status === 'fulfilled') {
      this.spuImageList = spuImageListRes.value.map(item => {
        return { ...item, isDefault: '0' }
      })
    }
    if (AttrListRes.status === 'fulfilled') {
      this.attrList = AttrListRes.value
    }
  },
  methods: {
    handleSelectionChange(value) {
      this.sku.skuImageList = value
    },
    setDefaultImage(row) {
      this.spuImageList.map(item => (item.isDefault = '0'))
      row.isDefault = '1'
      this.sku.skuDefaultImg = row.imgUrl
    },
    async submit() {
      const { category3Id, spuId } = this
      const { tmId } = this.spu
      const {
        price,
        skuAttrValueList,
        skuDefaultImg,
        skuDesc,
        skuImageList,
        skuName,
        skuSaleAttrValueList,
        weight
      } = this.sku
      const newSkuImageList = skuImageList.filter(Boolean)
      const data = {
        category3Id,
        price,
        skuAttrValueList: skuAttrValueList.filter(Boolean).map(attr => {
          const [attrId, attrName, valueId, valueName] = attr.split(':')
          return {
            attrId,
            attrName,
            valueId,
            valueName
          }
        }),
        skuDefaultImg,
        skuDesc,
        skuImageList: newSkuImageList,
        skuName,
        skuSaleAttrValueList: skuSaleAttrValueList
          .filter(Boolean)
          .map(saleAttr => {
            const [
              saleAttrId,
              saleAttrName,
              saleAttrValueId,
              saleAttrValueName
            ] = saleAttr.split(':')
            return {
              saleAttrId,
              saleAttrName,
              saleAttrValueId,
              saleAttrValueName
            }
          }),
        spuId,
        tmId,
        weight
      }
      console.log(data)
      await reqSaveSkuInfo(data)

      this.$message({
        type: 'success',
        message: '添加SKU成功'
      })
    },
    handleCancel() {
      this.$emit('changeIsShow', 1)
    }
  }
}
</script>

<style scoped>
.table-image {
  width: 150px;
  height: 150px;
}
</style>
