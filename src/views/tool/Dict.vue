<!-- <el-empty description="数据字典"></el-empty> -->
<template>
    <div>
      <canvas ref="canvas" width="500" height="500"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Draw',
    data() {
      return {
        context: null,
        isDrawing: false,
      };
    },
    mounted() {
      this.context = this.$refs.canvas.getContext('2d');
    },
    methods: {
      handleMouseDown(event) {
        this.isDrawing = true;
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
      },
      handleMouseMove(event) {
        if (this.isDrawing) {
          this.context.lineTo(event.offsetX, event.offsetY);
          this.context.stroke();
        }
      },
      handleMouseUp() {
        this.isDrawing = false;
      },
    },
  };
  </script>
  
  <style>
  canvas {
    background-color: #eee;
    border: 1px solid #000;
  }
  </style>
  