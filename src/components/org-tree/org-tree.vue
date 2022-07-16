<template>
  <div class="org-tree-container outBox">
    <div class="org-tree" :class="{horizontal, collapsable}" v-drag id="ddd" @mousewheel.prevent="hMouseWheel">
      <org-tree-node :data="data" :props="props" :horizontal="horizontal" :label-width="labelWidth"
        :collapsable="collapsable" :render-content="renderContent" :label-class-name="labelClassName"
        @on-expand="(e, data) => $emit('on-expand', e, data)"
        @on-expand-mouseover="(e, data) => $emit('on-expand-mouseover', e, data)"
        @on-expand-mouseout="(e, data) => $emit('on-expand-mouseout', e, data)"
        @on-node-click="(e, data) => {$emit('on-node-click', e, data)}"
        @on-node-mouseover="(e, data) => $emit('on-node-mouseover', e, data)"
        @on-node-mouseout="(e, data) => $emit('on-node-mouseout', e, data)">
      </org-tree-node>
    </div>
  </div>
</template>

<script>
  import render from './node'

  export default {
    name: 'OrgTree',
    components: {
      OrgTreeNode: {
        render,
        functional: true
      }
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      props: {
        type: Object,
        default: () => ({
          label: 'label',
          expand: 'expand',
          children: 'children'
        })
      },
      horizontal: Boolean,
      collapsable: Boolean,
      renderContent: Function,
      labelWidth: [String, Number],
      labelClassName: [Function, String]
    },
    directives: {
      drag: { // 以下代码可以自己提出去封装
        inserted: function (el) {
          el.style.cursor = 'move'
          var firstTime = ''
          var lastTime = ''
          el.onmousedown = function (e) {
            let disx = e.pageX - el.offsetLeft
            let disy = e.pageY - el.offsetTop
            document.getElementById('ddd').setAttribute('data-flag', false)
            firstTime = new Date().getTime();
            document.onmousemove = function (e) {
              let x = e.pageX - disx
              let y = e.pageY - disy
              let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width)
              let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height)

              el.style.left = x + 'px'
              el.style.top = y + 'px'

              if (x < 0) {
                x = 0
              } else if (x > maxX) {
                x = maxX
              }

              if (y < 0) {
                y = 0
              } else if (y > maxY) {
                y = maxY
              }

              let et = e || window.event
              et.preventDefault()
            }
            document.onmouseup = function () {
              lastTime = new Date().getTime();
              if ((lastTime - firstTime) < 150) {
                document.getElementById('ddd').setAttribute('data-flag', true)
              }
              document.onmousemove = document.onmouseup = null
            }
          }
        }
      }
    },
    methods: {
      hMouseWheel(ev) { // 缩放功能
        var ev = ev || window.event;
        var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
        down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
        var scal = 1
        var oDiv = document.getElementById('ddd')
        if (down) {
          // 鼠标滚轮向上放大
          if (scal == 0.01) {
            scal = 0.01
            return
          } else {
            scal = (parseFloat(scal) - 0.01).toFixed(2);
            scal = scal - 0.3
          }
          oDiv.style.transform = "scale(" + scal + ")"; //scale()在这里要使用拼接的方式才能生效。
          oDiv.style.transformOrigin = '0 0';

        } else {
          // 鼠标滚轮向下缩小
          scal = (parseFloat(scal) + 0.01).toFixed(2);
          scal = scal
          oDiv.style.transform = "scale(" + scal + ")"; //scale()在这里要使用拼接的方式才能生效
          oDiv.style.transformOrigin = '0 0';
        }

        if (ev.preventDefault) {
          /*FF 和 Chrome*/
          ev.preventDefault(); // 阻止默认事件
        }
        return false;
      },

    },
  }
</script>
<style lang="less" scoped>
  .outBox {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  #ddd {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    // left: 20%; // 打开，tree在中间位置，弊端是添加节点，整个tree不会自动向左移动，造成左边留白
  }

  .org-tree-container {
    display: inline-block;
    padding: 15px;
    background-color: #fff;
  }

  .org-tree {
    display: table;
    text-align: center;
  }

  .org-tree:before,
  .org-tree:after {
    content: '';
    display: table;
  }

  .org-tree:after {
    clear: both;
  }

  .org-tree-node,
  .org-tree-node-children {
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .org-tree-node:before,
  .org-tree-node-children:before,
  .org-tree-node:after,
  .org-tree-node-children:after {
    transition: all 0.35s;
  }

  .org-tree-node-label {
    position: relative;
    display: inline-block;
  }

  .org-tree-node-label .org-tree-node-label-inner {
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    // tree节点不换行
    // padding: 6px 20px;
    // white-space: nowrap;
    // tree节点换行
    padding: 6px 10px;
    width: 150px;
    word-wrap: break-word
  }

  .org-tree-node-btn {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 20px;
    height: 20px;
    z-index: 10;
    margin-left: -11px;
    margin-top: 9px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.35s ease;
  }

  .org-tree-node-btn:hover {
    background-color: #e7e8e9;
    transform: scale(1.15);
  }

  .org-tree-node-btn:before,
  .org-tree-node-btn:after {
    content: '';
    position: absolute;
  }

  .org-tree-node-btn:before {
    top: 50%;
    left: 4px;
    right: 4px;
    height: 0;
    border-top: 1px solid #ccc;
  }

  .org-tree-node-btn:after {
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 0;
    border-left: 1px solid #ccc;
  }

  .org-tree-node-btn.expanded:after {
    border: none;
  }

  .org-tree-node {
    padding-top: 20px;
    display: table-cell;
    vertical-align: top;
  }

  .org-tree-node.is-leaf,
  .org-tree-node.collapsed {
    padding-left: 10px;
    padding-right: 10px;
  }

  .org-tree-node:before,
  .org-tree-node:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 19px;
  }

  .org-tree-node:after {
    left: 50%;
    border-left: 1px solid #ddd;
  }

  .org-tree-node:not(:first-child):before,
  .org-tree-node:not(:last-child):after {
    border-top: 1px solid #ddd;
  }

  .collapsable .org-tree-node.collapsed {
    padding-bottom: 30px;
  }

  .collapsable .org-tree-node.collapsed .org-tree-node-label:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 50%;
    height: 20px;
    border-right: 1px solid #ddd;
  }

  .org-tree>.org-tree-node {
    padding-top: 0;
  }

  .org-tree>.org-tree-node:after {
    border-left: 0;
  }

  .org-tree-node-children {
    padding-top: 20px;
    display: table;
  }

  .org-tree-node-children:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid #ddd;
  }

  .org-tree-node-children:after {
    content: '';
    display: table;
    clear: both;
  }

  .horizontal .org-tree-node {
    display: table-cell;
    float: none;
    padding-top: 0;
    padding-left: 20px;
  }

  .horizontal .org-tree-node.is-leaf,
  .horizontal .org-tree-node.collapsed {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .horizontal .org-tree-node:before,
  .horizontal .org-tree-node:after {
    width: 19px;
    height: 50%;
  }

  .horizontal .org-tree-node:after {
    top: 50%;
    left: 0;
    border-left: 0;
  }

  .horizontal .org-tree-node:only-child:before {
    top: 1px;
    border-bottom: 1px solid #ddd;
  }

  .horizontal .org-tree-node:not(:first-child):before,
  .horizontal .org-tree-node:not(:last-child):after {
    border-top: 0;
    border-left: 1px solid #ddd;
  }

  .horizontal .org-tree-node:not(:only-child):after {
    border-top: 1px solid #ddd;
  }

  .horizontal .org-tree-node .org-tree-node-inner {
    display: table;
  }

  .horizontal .org-tree-node-label {
    display: table-cell;
    vertical-align: middle;
  }

  .horizontal.collapsable .org-tree-node.collapsed {
    padding-right: 30px;
  }

  .horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
    top: 0;
    left: 100%;
    width: 20px;
    height: 50%;
    border-right: 0;
    border-bottom: 1px solid #ddd;
  }

  .horizontal .org-tree-node-btn {
    top: 50%;
    left: 100%;
    margin-top: -11px;
    margin-left: 9px;
  }

  .horizontal>.org-tree-node:only-child:before {
    border-bottom: 0;
  }

  .horizontal .org-tree-node-children {
    display: table-cell;
    padding-top: 0;
    padding-left: 20px;
  }

  .horizontal .org-tree-node-children:before {
    top: 50%;
    left: 0;
    width: 20px;
    height: 0;
    border-left: 0;
    border-top: 1px solid #ddd;
  }

  .horizontal .org-tree-node-children:after {
    display: none;
  }

  .horizontal .org-tree-node-children>.org-tree-node {
    display: block;
  }

  /* 1 */
  .org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #4c97de;
    color: #fff;
  }

  /* 2 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #36a4fd;
    color: #fff;
  }

  /* 3 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #c2d4ff;
    color: #4665b0;
  }

  /* 4 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #9dd4e9;
    color: #4794b1;
  }

  /* 第5层 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #e7f1fd;
    color: #5b9be5;
  }

  /* 第6层 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #fecece;
    color: #f47171;
  }

  /* 第7层 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #ffe4b4;
    color: #dea540;
  }

  /* 第8层 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #c8efef;
    color: #76bebe;
  }

  /* 第9层 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #e6d7f3;
    color: #bd99dd;
  }

  /* 第10层 */
  .org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-children>.org-tree-node>.org-tree-node-label>.org-tree-node-label-inner {
    background-color: #f4f7fe;
    color: #9eb1dd;
  }

  /* 每层多.org-tree-node-children>.org-tree-node */
  /* 节点.org-tree-node-label>.org-tree-node-label-inner*/
</style>