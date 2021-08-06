<template>
  <div>
    <el-input disabled v-model="roleName"></el-input>
    <el-tree
      :data="roleList"
      :props="defaultProps"
      @check-change="handleCheckChange"
      show-checkbox
      node-key="id"
      :default-expand-all="true"
    ></el-tree>
    <el-button type="primary">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import { reqGetPermissionListById } from '../../../api/acl/permission'
import { mapState } from 'vuex'
export default {
  name: 'RoleAuth',
  data() {
    return {
      roleList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapState('role', ['userId', 'roleName'])
  },
  mounted() {
    this.getRoleAuthList()
    console.log(this.roleName)
  },
  methods: {
    async getRoleAuthList() {
      const res = await reqGetPermissionListById(this.userId)
      this.roleList = res.children
    },
    handleCheckChange(data, indeterminate) {
      console.log(data, indeterminate)
      data.select = indeterminate
    },
    cancel() {
      this.$emit('update:isRoleShow', false)
    }
  }
}
</script>

<style></style>
