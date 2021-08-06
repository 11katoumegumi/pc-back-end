<template>
  <el-card class="box-card">
    <el-form inline :rules="rules" :model="attr" ref="form">
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
    >
      添加属性值
    </el-button>
    <el-table
      :data="attrValueList"
      :disabled="!attr.attrName"
      style="width: 100%"
      class="container-table"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="50"
      ></el-table-column>

      <el-table-column label="属性值名称">
        <template v-slot="{ row, $index }">
          <el-input
            :id="`input${row.id}`"
            size="mini"
            placeholder="请输入属性值名称"
            v-model="attr.valueName"
            @blur="setAttrValue($index, row)"
            @keyup.enter.native="$event.target.blur()"
            v-show="row.isSpanHide"
          ></el-input>
          <span
            v-show="!row.isSpanHide"
            @click="handleSpanClick(row)"
            class="inlineBlockSpan"
          >
            {{ row.valueName }}
          </span>
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
    <el-button type="primary" class="btnWithTopMargin" @click="SaveAttrInfo">
      确定
    </el-button>
    <el-button class="btnWithTopMargin" @click="ClearAndGoback">取消</el-button>
  </el-card>
</template>

<script>
import { reqSaveAttrInfo } from '../../../../api/product/attr'
import { mapState } from 'vuex'
export default {
  name: 'AddOrUpdateAttr',
  data() {
    return {
      attrValueList: [],
      loading: false,
      attr: {
        attrName: '',
        valueName: '', // 临时属性值
        isSpanHide: true
      },
      rules: {
        attrName: { required: true, message: '请输入属性名', trigger: 'blur' }
      }
    }
  },
  computed: {
    ...mapState('category', ['category1Id', 'category2Id', 'category3Id'])
  },
  props: {
    categoryId: {
      type: Number
    }
  },
  methods: {
    addAttrValue() {
      if (
        this.attrValueList.some(item => item.isSpanHide === true) &&
        !this.attr.valueName
      ) {
        return
      }
      const id = this.attrValueList.length
        ? this.attrValueList[this.attrValueList.length - 1].id + 1
        : 1
      this.attrValueList.push({
        id,
        valueName: '',
        isSpanHide: true
      })
      this.$nextTick(() => {
        //this.$refs.input.focus();
        document.querySelector(`#input${id}`).focus()
      })
    },
    ClearAndGoback() {
      this.attrValueList = []
      this.attr = {
        attrName: '',
        valueName: '', // 临时属性值
        isSpanHide: true
      }
      this.$emit('update:isAddOrUpdateShow', false)
    },
    setAttrValue(index, row) {
      if (!this.attr.valueName) {
        document.querySelector(`#input${row.id}`).focus()
        return
      }

      if (
        this.attrValueList
          .filter(iten => iten.id !== row.id)
          .some(item => item.valueName === row.valueName)
      ) {
        this.$message({
          message: '不能输入相同的属性值名称',
          type: 'warning'
        })
        return
      }
      row.valueName = this.attr.valueName
      this.attr.valueName = ''
      this.attrValueList[index].isSpanHide = false
    },

    deleteAttrValue(index) {
      this.attrValueList.splice(index, 1)
    },
    handleSpanClick(row) {
      if (
        this.attrValueList.some(item => item.isSpanHide === true) &&
        !this.attr.valueName
      ) {
        this.$message({
          message: '请填写属性值名称',
          type: 'warning'
        })
        return
      }
      row.isSpanHide = true
      this.$nextTick(() => {
        //this.$refs.input.focus();
        document.querySelector(`#input${row.id}`).focus()
      })
    },
    async SaveAttrInfo() {
      this.$refs.form.validate(async valid => {
        if (!valid) {
          return
        }
        const { attrName } = this.attr
        const { attrValueList, category3Id } = this
        if (!attrValueList.length) {
          this.$message({
            type: 'error',
            message: '请添加至少一个属性值'
          })
          return
        }

        await reqSaveAttrInfo({
          attrName,
          attrValueList,
          categoryId: category3Id,
          categoryLevel: 3
        })
        this.ClearAndGoback()
      })
    }
  }
}
</script>

<style>
.btnWithTopMargin {
  margin-top: 20px;
}
.btnWithBottomMargin {
  margin-bottom: 20px;
}
.inlineBlockSpan {
  display: inline-block;
  width: 100%;
}
</style>
