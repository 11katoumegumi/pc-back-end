<template>
  <div>
    <el-card>
      <el-form :model="user">
        <el-form-item>
          <el-input
            v-model="user.username"
            placeholder="用户名"
            class="usernameInput"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="search">
            查询
          </el-button>
          <el-button @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary">添 加</el-button>
      <el-button type="danger" disabled="">批量删除</el-button>
      <el-table :data="userList" v-loading="loading" border class="user-table">
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="用户昵称"
          prop="nickName"
          width="80px"
        ></el-table-column>
        <el-table-column label="权限列表" prop="roleName"></el-table-column>
        <el-table-column
          label="创建时间"
          prop="gmtCreate"
          width="160px"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          prop="gmtModified"
          width="160px"
        ></el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template v-slot="{ row }">
            <el-button
              type="info"
              icon="el-icon-user-solid"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(row)"
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
    <!-- <el-dialog :visible.sync="dialogVisible" title="设置角色">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-checkbox label="全选"></el-checkbox>
            </el-col>
            <el-checkbox label="admin"></el-checkbox>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>
import { reqGetAclUserList, reqDeleteUser } from '../../../api/acl/user'
export default {
  name: 'User',
  mounted() {
    this.getAclUserList(this.currentPage, this.pageSize)
  },
  data() {
    return {
      loading: false,
      user: { username: '' },
      userList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: true
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getAclUserList(this.currentPage, pageSize)
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getAclUserList(currentPage, this.pageSize)
    },
    async getAclUserList(currentPage, pageSize, username) {
      this.loading = true
      const res = await reqGetAclUserList(currentPage, pageSize, username)
      console.log(res)
      this.total = res.total
      this.userList = res.items
      this.loading = false
    },
    async deleteUser(row) {
      await reqDeleteUser(row.id)
      this.getAclUserList(this.currentPage, this.pageSize)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    search() {
      this.getAclUserList(this.currentPage, this.pageSize, this.user.username)
    },
    clear() {
      this.user.username = ''
      this.getAclUserList(this.currentPage, this.pageSize)
    }
  }
}
</script>

<style scoped>
.usernameInput {
  width: 180px;
  margin-right: 10px;
}
.user-table {
  margin-top: 20px;
}
</style>
