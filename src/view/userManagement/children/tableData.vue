<template>
  <div>
    <v-snackbar :timeout="3000" :top="true" v-model="snackbarShow">
      {{tipMessage}}
      <v-btn flat icon color="pink" @click.native="snackbarShow = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <edit-dialog :formTitle="formTitle" :dialogShow="dialog" :editedItem="editedItem" @close="close" @save="save"></edit-dialog>
    <v-data-table :headers="headers" :items="userList" :rows-per-page-items="[10,20,50]" rows-per-page-text="每页行数" :pagination.sync="pagination" :total-items="totalDesserts" class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{ props.item.userName }}</td>
          <td class="text-xs-center">{{ props.item.cityName}}</td>
          <td class="text-xs-center">{{ props.item.distName }}</td>
          <td class="text-xs-center">{{ props.item.phoneNum }}</td>
          <td class="text-xs-center">{{ props.item.email }}</td>
          <td class="text-xs-center">{{ props.item.roleName }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">重置</v-btn>
      </template>
    </v-data-table>
    <div style="position: fixed;bottom: 50px;right: 20px;z-index: 100;">
      <v-btn fab color="pink" @click="editItem()">
        <v-icon>add</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import EditDialog from './editDialog'
export default {
  components: {
    EditDialog
  },
  data: () => ({
    page: 1,
    dialog: false,
    totalDesserts: 0,
    pagination: {
      page: 1,
      rowsPerPage: 10
    },
    headers: [
      { text: '名称', align: 'center', sortable: false, value: 'userName' },
      { text: '所属地市', align: 'center', sortable: false, value: 'cityName' },
      { text: '所属县区', align: 'center', sortable: false, value: 'distName' },
      { text: '电话', align: 'center', sortable: false, value: 'phoneNum' },
      { text: 'email', align: 'center', sortable: false, value: 'email' },
      { text: '角色名称', align: 'center', sortable: false, value: 'roleName' },
      { text: '操作', align: 'center', value: 'name', sortable: false }
    ],
    userList: [
      {
        userName: 'YJ',
        cityName: '广州',
        distName: '天河区',
        phoneNum: '220324234',
        email: '3243@qq.com',
        roleName: '管理员'
      }
    ],
    editedItem: {},
    tipMessage: '成功',
    snackbarShow: false
  }),

  computed: {
    formTitle () {
      return !this.editedItem.userId ? '新增用户' : '  修改用户信息'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    pagination: {
      handler (newVal, oldVal) {
        // 页码或者条数变化时触发
        if (newVal.page !== oldVal.page || newVal.rowsPerPage !== oldVal.rowsPerPage) {
          this.initialize()
        }
      },
      deep: true
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    // 获取列表数据
    async initialize (searchData) {
      this.totalDesserts = 20
    },

    // 打开编辑界面
    editItem (item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem (item) {
      try {
        await this.$confirm('此操作将永久用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        try {
          this.initialize()
          this.tipMessage = '用户删除成功'
        } catch (err) {
          this.tipMessage = '删除失败'
        }
        this.snackbarShow = true
      } catch (err) {}
    },

    close () {
      this.dialog = false
    },
    // 保存用户数据
    async save (params) {
      try {
        if (this.editedItem.userId) {
          this.tipMessage = '用户信息更新成功'
        } else {
          this.tipMessage = '成功添加新用户'
        }
      } catch (err) {
        this.tipMessage = '失败'
      }
      this.snackbarShow = true
      this.initialize(this.tipMessage)
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
