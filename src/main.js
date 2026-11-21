import { createApp } from "vue";
import { createPinia } from "pinia";
// 引入 Element Plus 组件库及其默认样式
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入所有图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";

const app = createApp(App);

// 注册所有图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia());
app.use(ElementPlus);
app.mount("#app");
