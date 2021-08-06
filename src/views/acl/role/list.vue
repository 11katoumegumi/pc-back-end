<template>
  <div>
    <el-card v-show="!isRoleShow">
      <el-form>
        <el-form-item>
          <el-input
            v-model="roleName"
            placeholder="角色名称"
            class="RoleNameInput"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="search">
            查询
          </el-button>
          <el-button @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="dialogVisible = true">添 加</el-button>
      <el-button type="danger" disabled="">批量删除</el-button>
      <el-table :data="roleList" v-loading="loading" border class="user-table">
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="角色名称" prop="roleName">
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <el-input
                placeholder="请输入角色名称"
                class="editInput"
                size="small"
                v-model="row.roleName"
                @blur="updateRole(row)"
                @keyup.enter.native="$event.target.blur()"
              ></el-input>
              <el-button
                type="warning"
                icon="el-icon-refresh"
                size="mini"
                @click="row.isEdit = false"
                class="btnWithMarinLeft"
              >
                取消
              </el-button>
            </template>
            <span v-else>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template v-slot="{ row }">
            <el-button
              type="info"
              icon="el-icon-user-solid"
              size="mini"
              @click="goAsign(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="row.isEdit = true"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(row)"
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
    <RoleAuth v-if="isRoleShow" :isRoleShow.sync="isRoleShow" />

    <el-dialog :visible.sync="dialogVisible" title="添加角色" width="420px">
      <el-form>
        <span>请输入新名称</span>
        <el-form-item>
          <el-input v-model="newRoleName" class="newRoleNameInput"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqGetAclRoleList,
  reqDeleteRole,
  reqSaveRole,
  reqUpdateRole
} from '../../../api/acl/role'
import RoleAuth from './roleAuth.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'Role',
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 3,
      total: 0,
      roleName: '',
      roleList: [],
      newRoleName: '',
      dialogVisible: false,
      isEdit: false,
      isRoleShow: false
    }
  },
  mounted() {
    this.getRoleList(this.currentPage, this.pageSize)
  },
  components: {
    RoleAuth
  },
  methods: {
    ...mapMutations('role', ['SET_USER_ID', 'SET_USER_NAME']),
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getRoleList(this.currentPage, pageSize)
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getRoleList(currentPage, this.pageSize)
    },
    async getRoleList(currentPage, pageSize, roleName) {
      this.loading = true
      const res = await reqGetAclRoleList(currentPage, pageSize, roleName)
      this.total = res.total
      this.roleList = res.items.map(item => ({ ...item, isEdit: false }))
      this.loading = false
    },
    async deleteRole(row) {
      await reqDeleteRole(row.id)
      this.getRoleList(this.currentPage, this.pageSize)
      this.$message({
        type: 'warning',
        message: '删除成功'
      })
    },
    async saveRole() {
      if (!this.newRoleName) {
        return
      }
      await reqSaveRole({ roleName: this.newRoleName })
      this.newRoleName = ''
      this.dialogVisible = false
      this.getRoleList(this.currentPage, this.pageSize)
      this.$message({
        type: 'success',
        message: '添加成功'
      })
    },
    async updateRole(row) {
      await reqUpdateRole({ id: row.id, roleName: row.roleName })
      this.$message({
        type: 'success',
        message: '修改成功'
      })
      row.isEdit = false
    },
    goAsign(row) {
      console.log(row)
      this.SET_USER_ID(row.id)
      this.SET_USER_NAME(row.roleName)
      this.isRoleShow = true
    },
    search() {
      this.getRoleList(this.currentPage, this.pageSize, this.roleName)
      this.roleName = ''
    },
    clear() {
      this.roleName = ''
      this.getRoleList(this.currentPage, this.pageSize)
    }
  }
}
</script>

<style scoped>
.RoleNameInput {
  width: 180px;
  margin-right: 10px;
}
.user-table {
  margin-top: 20px;
  width: 960px;
}
.newRoleNameInput {
  margin-top: 20px;
}
.editInput {
  width: 380px;
}
.btnWithMarinLeft {
  margin-left: 10px;
}
</style>
