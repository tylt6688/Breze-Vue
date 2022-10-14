<template>
  <div class="page">
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.titleName" placeholder="请输入名称" clearable>
            <el-button slot="append" @click="getNameList" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="navbarDialogVisible = true"  icon="el-icon-picture-outline">
            添加导航
          </el-button>
        </el-form-item>
       
      </el-form>
    </el-header>
    <el-main>
        
        <el-table ref="navbarTable" :data="navbars" tooltip-effect="dark" border stripe table-lauout="auto">
          <el-table-column prop="flag" label="导航栏类型" >
          </el-table-column>
          <el-table-column prop="titleName" label="标题名称" >
          </el-table-column>
          <el-table-column prop="titleUrl" label="跳转路径" >
          </el-table-column>
          <el-table-column prop="parentId" label="父id">
          </el-table-column>
          <el-table-column prop="icon" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="editHandle(scope.row.id)" icon="el-icon-edit">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <template>
                <el-popconfirm title="确定删除此内容吗?" @confirm="delHandle(scope.row.id)">
                  <el-button type="text" slot="reference" icon="el-icon-delete">
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-main> 
      <!-- 分页 -->
      <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="current"
                :page-sizes="[2, 5, 10, 20]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
  <!--编辑主体内容模态框 Start-->
  <el-dialog title="编辑导航内容" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
    <el-form ref="editForm" :model="editForm" :rules="editFormRules">

    
      <el-form-item label="导航栏类型" prop="flag" label-width="100px">
        <el-input v-model="editForm.flag" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="导航栏名称" prop="titleName" label-width="100px">
        <el-input v-model="editForm.titleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="跳转路径" prop="titleUrl" label-width="100px">
        <el-input v-model="editForm.titleUrl" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父id" prop="parentId" label-width="100px">
        <el-input v-model="editForm.parentId" autocomplete="off"></el-input>
      </el-form-item>
    
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      <el-button @click="resetForm('editForm')">取 消</el-button>
    </div>
  </el-dialog>
  <!--编辑主体内容模态框 End-->

  <!-- 上传文件模态框 Start -->
  <el-dialog title="添加主页内容" :visible.sync="navbarDialogVisible" width="600px" :before-close="maincontentMaincontent">
    <el-form>
      <el-form-item label="导航栏类型" label-width="100px">
        <el-input style= "width: 80%" block placeholder="请输入" :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea" v-model="form.flag" autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="导航栏名称" label-width="100px">
        <el-input style= "width: 80%" block placeholder="请输入" :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea" v-model="form.titleName" autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="跳转路径" label-width="100px">
        <el-input style= "width: 80%" block placeholder="请输入" :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea" v-model="form.titleUrl" autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="父id" label-width="100px">
        <el-input style= "width: 80%" block placeholder="请输入" :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea" v-model="form.parentId" autocomplete="off">
        </el-input>
      </el-form-item>
      
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitnavbar">添 加</el-button>
      <el-button @click="navbarDialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
  <!-- 上传文件模态框 End -->
</div>

</template>

<script>
  
  import navbar from "@/api/portal/navbar";
export default {
  name: "MaincontentManage",
  data() {
    return {
      // 分页数据
      total: 0,
      current: 1,
      size: 10,

      searchForm: {
          titleName: ""
        },
      imgalt: "",
      
      dialogVisible: false,
      navbarDialogVisible: false,

      titleName:"",
      flag:"",
      titleUrl:"",
      parentId:"",
      

      uploadState: false,
      form: {},
      navbars: [],
      editForm: {},
      editFormRules: {
        alt: [{
          required: true,
          message: "请输入图片主题",
          trigger: "blur",
        }, ],
      },
     
    };
  },
  created() {},
  mounted() {
    this.getNameList();
    //this.getNavbar();
  },
  methods: {

    
    handleSizeChange(size){

       this.size=size
       
       this.getNameList()

    },
    handleCurrentChange(current){
      this.current=current
      
      this.getNameList()

    },

    // 获取用户列表 Start
    getNameList() {
       // console.log("searchForm", this.searchForm.titleName);
        let params = {
          titleName: this.searchForm.titleName,
          current: this.current,
          size: this.size,
        };
        navbar.getNameList(params).then((res) => {
          this.navbars=res.data.result.data.records
          this.total=res.data.result.data.total
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        });
      },

      // 获取用户列表 End
    // 获取内容 Start
    getNavbar() {
      navbar.getNavbarInfo().then((res) => {
        this.navbars = res.data.result.data;
      });
    },
    // 获取内容 End

    // 编辑内容 Start
    editHandle(id) { 
      
      navbar.editHandle(id).then((res) => {
        this.editForm = res.data.result.data;
        this.dialogVisible = true;
       
      });
    },
    // 编辑内容 End

    // 取消编辑，重置模态框内容 Start
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    handleClose() {
      this.resetForm("editForm");
    },
    // 取消编辑，重置模态框内容 End

    
      

    //添加数据 start
    submitnavbar() {
      navbar.uploadNavbar(this.form).then((res) => {
        this.navbarDialogVisible = false;
        this.$message({
          showClose: true,
          duration: 2000,
          message: "上传成功",
          type: "success",
          onClose: () => {
            this.getNavbar();
          },
        });
      });
      
    },
    // 用户添加数据 End

    // 新增或编辑Banner图 Start
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          navbar.submitNavbarForm(this.editForm).then((res) => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: "编辑成功",
              type: "success",
              onClose: () => {
                this.getNavbar();
              },
            });
            this.dialogVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增或编辑Banner图 End

    // 删除内容 Start
    delHandle(id) {
      navbar.delHandleInfo(id).then((res) => {
        this.$message({
          showClose: true,
          duration: 2000,
          message: "删除成功",
          type: "success",
          onClose: () => {
            this.getNavbar();
          },
        });
      });
    },
    // 删除内容 End

    maincontentMaincontent() {
      this.navbarDialogVisible = false;
    },
   
  },
};
</script>

<style scoped>

</style>