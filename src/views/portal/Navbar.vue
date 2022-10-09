<template>
    <div class="page">
      
    </div>
  </template>
  
  <script>
    import moment from "moment";
  
    export default {
      name: "Navbar",
      data() {
        return {
          
        };
      },
      created() {
       
      },
      mounted() {
    
    },
      methods: {
        // 时间格式化 Start
        formatDate(row, column) {
          // 获取单元格数据
          let data = row[column.property];
          if (data == null) {
            return null;
          }
          return moment(data).format("YYYY-MM-DD HH:mm:ss");
        },
        // 时间格式化 End
  
        
      },
    };
  </script>
  
  <style scoped>

  </style>