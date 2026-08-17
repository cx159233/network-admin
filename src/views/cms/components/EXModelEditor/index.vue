<template>
  <div>
    <a-form-item
      v-for="field in fieldList"
      :key="field.fieldName"
      :label="field.label"
    >
      <a-input v-if="field.controlType==='input'" v-model:value="field.value" />
      <a-textarea v-if="field.controlType==='textarea'" v-model:value="field.value" />
      <a-radio-group v-if="field.controlType==='radio'" v-model:value="field.value">
        <a-radio v-for="item in field.options" :key="item.value" :value="item.value">{{ item.name }}</a-radio>
      </a-radio-group>
      <a-checkbox-group v-if="field.controlType==='checkbox'" v-model:value="field.value">
        <a-checkbox v-for="item in field.options" :key="item.value" :value="item.value">{{ item.name }}</a-checkbox>
      </a-checkbox-group>
      <a-select
        v-if="field.controlType==='select'"
        v-model:value="field.value"
        allow-clear
        style="width: 100%"
      >
        <a-select-option
          v-for="item in field.options"
          :key="item.value"
          :value="item.value"
        >{{ item.name }}</a-select-option>
      </a-select>
      <a-date-picker
        v-if="field.controlType==='date'"
        v-model:value="field.value"
        value-format="YYYY-MM-DD"
      />
      <a-time-picker
        v-if="field.controlType==='time'"
        v-model:value="field.value"
        value-format="HH:mm:ss"
      />
      <a-date-picker
        v-if="field.controlType==='datetime'"
        v-model:value="field.value"
        show-time
        value-format="YYYY-MM-DD HH:mm:ss"
      />
      <cms-logo-view v-if="field.controlType==='CMSImage'"
        v-model="field.value"
        :src="field.valueObj"
        :width="210"
        :height="150">
      </cms-logo-view>
      <ueditor v-if="field.controlType==='UEditor'"
        :editorId="'ex-'+field.fieldName"
        :height="200"
        :configs="ueConfigs"
        v-model="field.value">
      </ueditor>
      <cms-content-selector v-if="field.controlType==='CMSContentSelect'"
        v-model="field.value"
        :selected="field.valueObj">
      </cms-content-selector>
    </a-form-item>
  </div>
</template>
<script>
import CMSLogoView from '@/views/cms/components/LogoView';
import CMSContentSelector from '@/views/cms/components/ContentSelector';
import UEditor from '@/views/cms/components/UEditorPlus'
import { getXModelFieldData } from "@/api/contentcore/exmodel";

export default {
  name: "CMSEXModelEditor",
  components: {
    "cms-logo-view": CMSLogoView,
    "cms-content-selector": CMSContentSelector,
    'ueditor': UEditor,
  },
  props: {
    xmodel: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: false
    }
  },
  watch: {
    type(newVal) {
      this.dataType = newVal;
    },
    id(newVal) {
      this.dataId = newVal;
    },
    dataId(newVal) {
      if (newVal && newVal != null && newVal.length > 0) {
        this.loadModelFieldData();
      }
    },
  },
  data () {
    return {
      modelId: this.xmodel,                                   
      dataId: this.id,
      dataType: this.type,
      fieldList: [],
      ueConfigs: {
        elementPathEnabled: false,
        wordCount: false,
        toolbars: [
          [
            "bold",         // 加粗
            "italic",       // 斜体
            "underline",    // 下划线
            "strikethrough",// 删除线
            "blockquote",   // 引用
            "|",
            "forecolor",    // 字体颜色
            "insertorderedlist",   // 有序列表
            "insertunorderedlist", // 无序列表
            "|",
            "indent",              // 首行缩进
            "lineheight",          // 行间距
            "paragraph",           // 段落格式
            "fontsize",            // 字号
            "|",
            "link",                // 超链接
            "xy-third-video",         // 视频
            'xy-resource',
            "xy-check-word",
            "horizontal",          // 分隔线
            "inserttable",         // 插入表格
          ]
        ],
      }
    };
  },
  created() {
    this.loadModelFieldData();
  },
  methods: {
    loadModelFieldData() {
      this.fieldList = []
      getXModelFieldData(this.modelId, this.dataType, this.dataId).then(response => {
        response.data.forEach(item => {
          let field = {};
          Object.keys(item).forEach(key => field[key] = (key === 'value' || key === 'valueObj') ? '' : item[key])
          this.fieldList.push(field);
        })
        this.$nextTick(() => {
          response.data.forEach(item => {
            let field = this.fieldList.find(f => item.fieldName == f.fieldName);
            if (field) {
              field.value = item.value
              field.valueObj = item.valueObj
            }
          })
        })
      });
    },
    getDatas() {
      let fdatas = {};
      this.fieldList.forEach(f => {
        fdatas[f.fieldName] = f.value;
      })
      return fdatas;
    }
  }
};
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>