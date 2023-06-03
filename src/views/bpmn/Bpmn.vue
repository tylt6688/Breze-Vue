<template>

    <div class="container">
      <!-- 创建一个canvas画布 bpmn-js是通过canvas实现绘图的，并设置ref让vue获取到element -->
      <div class="bpmn-canvas" ref="canvas"></div>
      <!-- 工具栏显示的地方 -->
      <div class="bpmn-js-properties-panel" id="js-properties-panel"></div>


      <!-- 把操作按钮写在这里面 -->
      <div class="action">
        <el-upload action class="upload-demo" :before-upload="openBpmn">
          <el-button icon="el-icon-folder-opened"></el-button>
        </el-upload>
        <el-button icon="el-icon-download" @click="downloadBpmn"></el-button>
        <el-button icon="el-icon-picture" @click="downloadSvg"></el-button>
        <el-button @click="deploy">在线部署</el-button>
        <el-button class="new" @click="newDiagram">重置工作流</el-button>

        <a hidden ref="downloadLink"></a>
      </div>
    </div>

</template>

<script>
  import BpmnModeler from "bpmn-js/lib/Modeler";
  // 工具栏相关
  import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
  import propertiesPanelModule from "bpmn-js-properties-panel";
  import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
  //汉化
  import customTranslate from './customTranslate'



  export default {
    data() {
      return {
        bpmnModeler: null,
        canvas: null,
        bpmnTemplate: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" id="m1577635100724" name="" targetNamespace="http://www.activiti.org/testm1577635100724">
<process id="Process_18la5ob">
  <startEvent id="Event_07uivap" name="开始">
    <outgoing>Flow_0dgggyy</outgoing>
  </startEvent>
  <parallelGateway id="Gateway_1kyo5dw" name="分支">
    <incoming>Flow_0dgggyy</incoming>
    <outgoing>Flow_09r5bzs</outgoing>
    <outgoing>Flow_14svaw2</outgoing>
    <outgoing>Flow_0hxq9b5</outgoing>
  </parallelGateway>
  <sequenceFlow id="Flow_0dgggyy" sourceRef="Event_07uivap" targetRef="Gateway_1kyo5dw" />
  <task id="Activity_04e0rhn" name="流程">
    <incoming>Flow_09r5bzs</incoming>
    <outgoing>Flow_0zqwbx6</outgoing>
  </task>
  <sequenceFlow id="Flow_09r5bzs" sourceRef="Gateway_1kyo5dw" targetRef="Activity_04e0rhn" />
  <exclusiveGateway id="Gateway_0siot4f">
    <incoming>Flow_0zqwbx6</incoming>
    <outgoing>Flow_1l3ztqg</outgoing>
  </exclusiveGateway>
  <sequenceFlow id="Flow_0zqwbx6" sourceRef="Activity_04e0rhn" targetRef="Gateway_0siot4f" />
  <intermediateThrowEvent id="Event_0xzzs9y">
    <incoming>Flow_14svaw2</incoming>
    <outgoing>Flow_1y0838x</outgoing>
    <messageEventDefinition id="MessageEventDefinition_10puaxg" />
  </intermediateThrowEvent>
  <sequenceFlow id="Flow_14svaw2" sourceRef="Gateway_1kyo5dw" targetRef="Event_0xzzs9y" />
  <intermediateCatchEvent id="Event_1clrrar">
    <incoming>Flow_1y0838x</incoming>
    <outgoing>Flow_0jcoq4i</outgoing>
    <signalEventDefinition id="SignalEventDefinition_1wi7w58" />
  </intermediateCatchEvent>
  <intermediateCatchEvent id="Event_1y02qs1">
    <incoming>Flow_0jcoq4i</incoming>
    <outgoing>Flow_082ogs1</outgoing>
    <timerEventDefinition id="TimerEventDefinition_0kzy28i" />
  </intermediateCatchEvent>
  <intermediateCatchEvent id="Event_1280mty">
    <incoming>Flow_082ogs1</incoming>
    <incoming>Flow_1l3ztqg</incoming>
    <outgoing>Flow_0qjawbf</outgoing>
    <messageEventDefinition id="MessageEventDefinition_12aknhr" />
  </intermediateCatchEvent>
  <endEvent id="Event_1u4no1i">
    <incoming>Flow_0qjawbf</incoming>
    <messageEventDefinition id="MessageEventDefinition_0mespsh" />
  </endEvent>
  <sequenceFlow id="Flow_0qjawbf" sourceRef="Event_1280mty" targetRef="Event_1u4no1i" />
  <sequenceFlow id="Flow_082ogs1" sourceRef="Event_1y02qs1" targetRef="Event_1280mty" />
  <sequenceFlow id="Flow_0jcoq4i" sourceRef="Event_1clrrar" targetRef="Event_1y02qs1" />
  <sequenceFlow id="Flow_1y0838x" sourceRef="Event_0xzzs9y" targetRef="Event_1clrrar" />
  <sequenceFlow id="Flow_1l3ztqg" sourceRef="Gateway_0siot4f" targetRef="Event_1280mty" />
  <task id="Activity_1917ew2" name="分支">
    <incoming>Flow_0hxq9b5</incoming>
    <outgoing>Flow_0hv0gbr</outgoing>
  </task>
  <task id="Activity_1frdaj5" name="流程">
    <incoming>Flow_0hv0gbr</incoming>
    <outgoing>Flow_1v3qz7k</outgoing>
  </task>
  <sequenceFlow id="Flow_0hv0gbr" sourceRef="Activity_1917ew2" targetRef="Activity_1frdaj5" />
  <sequenceFlow id="Flow_1v3qz7k" sourceRef="Activity_1frdaj5" targetRef="Event_1jraug0" />
  <endEvent id="Event_1jraug0">
    <incoming>Flow_1v3qz7k</incoming>
    <terminateEventDefinition id="TerminateEventDefinition_00mz2jc" />
  </endEvent>
  <sequenceFlow id="Flow_0hxq9b5" sourceRef="Gateway_1kyo5dw" targetRef="Activity_1917ew2" />
  <textAnnotation id="TextAnnotation_0bb59jc">
    <text>工具</text>
  </textAnnotation>
  <association id="Association_1lw9dwa" sourceRef="Gateway_1kyo5dw" targetRef="TextAnnotation_0bb59jc" />
  <textAnnotation id="TextAnnotation_1l8ymrv">
    <text>备注</text>
  </textAnnotation>
  <association id="Association_1rie8dx" sourceRef="Event_0xzzs9y" targetRef="TextAnnotation_1l8ymrv" />
  <textAnnotation id="TextAnnotation_0aj23jm">
    <text>还原</text>
  </textAnnotation>
  <association id="Association_03g8af6" sourceRef="Event_1clrrar" targetRef="TextAnnotation_0aj23jm" />
  <textAnnotation id="TextAnnotation_19hp35q">
    <text>功能</text>
  </textAnnotation>
  <association id="Association_16oe3y0" sourceRef="Event_1y02qs1" targetRef="TextAnnotation_19hp35q" />
  <textAnnotation id="TextAnnotation_1krnofa">
    <text>进度</text>
  </textAnnotation>
  <association id="Association_1tjgctl" sourceRef="Event_1280mty" targetRef="TextAnnotation_1krnofa" />
</process>
<bpmndi:BPMNDiagram id="BPMNDiagram_leave">
  <bpmndi:BPMNPlane id="BPMNPlane_leave" bpmnElement="Process_18la5ob">
    <bpmndi:BPMNShape id="TextAnnotation_0bb59jc_di" bpmnElement="TextAnnotation_0bb59jc">
      <omgdc:Bounds x="280" y="390" width="100" height="30" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="TextAnnotation_1l8ymrv_di" bpmnElement="TextAnnotation_1l8ymrv">
      <omgdc:Bounds x="460" y="390" width="100" height="30" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="TextAnnotation_0aj23jm_di" bpmnElement="TextAnnotation_0aj23jm">
      <omgdc:Bounds x="610" y="390" width="100" height="30" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="TextAnnotation_19hp35q_di" bpmnElement="TextAnnotation_19hp35q">
      <omgdc:Bounds x="800" y="390" width="100" height="30" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="TextAnnotation_1krnofa_di" bpmnElement="TextAnnotation_1krnofa">
      <omgdc:Bounds x="970" y="390" width="100" height="30" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNEdge id="Flow_0dgggyy_di" bpmnElement="Flow_0dgggyy">
      <di:waypoint x="138" y="300" />
      <di:waypoint x="245" y="300" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_09r5bzs_di" bpmnElement="Flow_09r5bzs">
      <di:waypoint x="270" y="275" />
      <di:waypoint x="270" y="190" />
      <di:waypoint x="410" y="190" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_0zqwbx6_di" bpmnElement="Flow_0zqwbx6">
      <di:waypoint x="510" y="190" />
      <di:waypoint x="685" y="190" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_14svaw2_di" bpmnElement="Flow_14svaw2">
      <di:waypoint x="295" y="300" />
      <di:waypoint x="422" y="300" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_0qjawbf_di" bpmnElement="Flow_0qjawbf">
      <di:waypoint x="948" y="300" />
      <di:waypoint x="1122" y="300" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_082ogs1_di" bpmnElement="Flow_082ogs1">
      <di:waypoint x="778" y="300" />
      <di:waypoint x="912" y="300" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_0jcoq4i_di" bpmnElement="Flow_0jcoq4i">
      <di:waypoint x="608" y="300" />
      <di:waypoint x="742" y="300" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_1y0838x_di" bpmnElement="Flow_1y0838x">
      <di:waypoint x="458" y="300" />
      <di:waypoint x="572" y="300" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_1l3ztqg_di" bpmnElement="Flow_1l3ztqg">
      <di:waypoint x="735" y="190" />
      <di:waypoint x="930" y="190" />
      <di:waypoint x="930" y="282" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_0hxq9b5_di" bpmnElement="Flow_0hxq9b5">
      <di:waypoint x="270" y="325" />
      <di:waypoint x="270" y="490" />
      <di:waypoint x="410" y="490" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_0hv0gbr_di" bpmnElement="Flow_0hv0gbr">
      <di:waypoint x="510" y="490" />
      <di:waypoint x="560" y="490" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Flow_1v3qz7k_di" bpmnElement="Flow_1v3qz7k">
      <di:waypoint x="660" y="490" />
      <di:waypoint x="712" y="490" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNShape id="Event_07uivap_di" bpmnElement="Event_07uivap">
      <omgdc:Bounds x="102" y="282" width="36" height="36" />
      <bpmndi:BPMNLabel>
        <omgdc:Bounds x="109" y="325" width="22" height="14" />
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Gateway_14r4jyj_di" bpmnElement="Gateway_1kyo5dw">
      <omgdc:Bounds x="245" y="275" width="50" height="50" />
      <bpmndi:BPMNLabel>
        <omgdc:Bounds x="259" y="332" width="22" height="14" />
      </bpmndi:BPMNLabel>
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Activity_04e0rhn_di" bpmnElement="Activity_04e0rhn">
      <omgdc:Bounds x="410" y="150" width="100" height="80" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Event_0aaz6cx_di" bpmnElement="Event_0xzzs9y">
      <omgdc:Bounds x="422" y="282" width="36" height="36" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Event_14wf55s_di" bpmnElement="Event_1280mty">
      <omgdc:Bounds x="912" y="282" width="36" height="36" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Event_0bqnd1q_di" bpmnElement="Event_1u4no1i">
      <omgdc:Bounds x="1122" y="282" width="36" height="36" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Gateway_0siot4f_di" bpmnElement="Gateway_0siot4f" isMarkerVisible="true">
      <omgdc:Bounds x="685" y="165" width="50" height="50" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Event_094v3gu_di" bpmnElement="Event_1y02qs1">
      <omgdc:Bounds x="742" y="282" width="36" height="36" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Event_1xm949v_di" bpmnElement="Event_1clrrar">
      <omgdc:Bounds x="572" y="282" width="36" height="36" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Activity_1917ew2_di" bpmnElement="Activity_1917ew2">
      <omgdc:Bounds x="410" y="450" width="100" height="80" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Activity_1frdaj5_di" bpmnElement="Activity_1frdaj5">
      <omgdc:Bounds x="560" y="450" width="100" height="80" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="Event_0y5hkhe_di" bpmnElement="Event_1jraug0">
      <omgdc:Bounds x="712" y="472" width="36" height="36" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNEdge id="Association_1lw9dwa_di" bpmnElement="Association_1lw9dwa">
      <di:waypoint x="279" y="316" />
      <di:waypoint x="321" y="390" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Association_1rie8dx_di" bpmnElement="Association_1rie8dx">
      <di:waypoint x="450" y="315" />
      <di:waypoint x="500" y="390" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Association_03g8af6_di" bpmnElement="Association_03g8af6">
      <di:waypoint x="600" y="315" />
      <di:waypoint x="650" y="390" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Association_16oe3y0_di" bpmnElement="Association_16oe3y0">
      <di:waypoint x="772" y="314" />
      <di:waypoint x="837" y="390" />
    </bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="Association_1tjgctl_di" bpmnElement="Association_1tjgctl">
      <di:waypoint x="942" y="314" />
      <di:waypoint x="1007" y="390" />
    </bpmndi:BPMNEdge>
  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</definitions>
`
      };
    },
    methods: {
      newDiagram() {
        this.createNewDiagram(this.bpmnTemplate);
      },

      downloadBpmn() {
        this.bpmnModeler.saveXML({
          format: true
        }, (err, xml) => {
          if (!err) {
            // 获取文件名
            const name = `${this.getFilename(xml)}.bpmn`;
            // 将文件名以及数据交给下载方法
            this.download({
              name: name,
              data: xml
            });
          }
        });
      },
      downloadSvg() {
        this.bpmnModeler.saveXML({
          format: true
        }, (err, xml) => {
          if (!err) {
            // 获取文件名
            const name = `${this.getFilename(xml)}.svg`;

            // 从建模器画布中提取svg图形标签
            let context = "";
            const djsGroupAll = this.$refs.canvas.querySelectorAll(".djs-group");
            for (let item of djsGroupAll) {
              context += item.innerHTML;
            }
            // 获取svg的基本数据，长宽高
            const viewport = this.$refs.canvas
              .querySelector(".viewport")
              .getBBox();

            // 将标签和数据拼接成一个完整正常的svg图形
            const svg = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="${viewport.width}"
              height="${viewport.height}"
              viewBox="${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}"
              version="1.1"
              >
              ${context}
            </svg>
          `;
            // 将文件名以及数据交给下载方法
            this.download({
              name: name,
              data: svg
            });
          }
        });
      },

      openBpmn(file) {
        const reader = new FileReader();
        // 读取File对象中的文本信息，编码格式为UTF-8
        reader.readAsText(file, "utf-8");
        reader.onload = () => {
          //读取完毕后将文本信息导入到Bpmn建模器
          this.createNewDiagram(reader.result);
        };
        return false;
      },

      getFilename(xml) {
        let start = xml.indexOf("process");
        let filename = xml.substr(start, xml.indexOf(">"));
        filename = filename.substr(filename.indexOf("id") + 4);
        filename = filename.substr(0, filename.indexOf('"'));
        return filename;
      },

      download({
        name = "diagram.bpmn",
        data
      }) {
        // 这里就获取到了之前设置的隐藏链接
        const downloadLink = this.$refs.downloadLink;
        // 把输就转换为URI，下载要用到的
        const encodedData = encodeURIComponent(data);

        if (data) {
          // 将数据给到链接
          downloadLink.href =
            "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
          // 设置文件名
          downloadLink.download = name;
          // 触发点击事件开始下载
          downloadLink.click();
        }
      },

      async init() {
        // 获取画布 element
        this.canvas = this.$refs.canvas;
        //将汉化包装成一个模块
        var customTranslateModule = {
          translate: ['value', customTranslate]
        }


        // 创建Bpmn对象
        this.bpmnModeler = new BpmnModeler({
          // 设置bpmn的绘图容器为上门获取的画布 element
          container: this.canvas,

          // 加入工具栏支持
          propertiesPanel: {
            parent: "#js-properties-panel"
          },
          additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule,
            //汉化模块
            customTranslateModule

          ],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        });

        await this.createNewDiagram(this.bpmnTemplate);
      },
      async createNewDiagram(bpmn) {
        // 将字符串转换成图显示出来;
        this.bpmnModeler.importXML(bpmn, err => {
          if (err) {
            this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
          }
        });
      },
      deploy() {
        this.bpmnModeler.saveXML({
          format: true
        }, (err, xml) => {
          if (!err) {
            // 获取文件名
            const name = `${this.getFilename(xml)}.bpmn`;
            //xml的内容  
            console.log(xml);
            ////调用后端接口 在线部署
            //this.axios({
            //    url: 'http://localhost:8080/deployXml',//请求地址
            //    method:'POST',//请求方法
            //    responseType: 'json',//返回值类型
            //    params: {
            //      "name": name,
            //      "xml": xml  
            //    }
            //  }).then(res => {
            //    console.log(res)//请求成功
            //  }).catch(error => {
            //    console.log(error);//请求失败
            //  })
          }
        });
      },
    },
    mounted() {
      this.init();
    }
  };
</script>

<style>
  .bpmn-canvas {
    width: 100%;
    height: 100vh;
  }

  .action {
    position: fixed;
    bottom: 10px;
    left: 225px;
    display: flex;
  }

  .upload-demo {
    margin-right: 10px;
  }

  .bpmn-js-properties-panel {
    position: absolute;
    top: 0;
    right: 0px;
    width: 300px;
  }
</style>