<script setup>
// ================= 【需要你自己补充的逻辑】 =================
// 练习 1：使用 defineProps 接收父组件传进来的单个任务对象 task（类型为 Object，必填）
// 提示：const props = defineProps({ task: { type: Object, required: true } })
const props = defineProps({ task: { type: Object, required: true } });
// 练习 2：使用 defineEmits 声明一个名为 'delete' 的自定义事件，用来通知父组件删除当前卡片
// 提示：const emit = defineEmits(['delete'])
const emit = defineEmits(["delete", "edit"]);
// ==========================================================
//开始拖拽时，把当前卡片的 ID 存进浏览器拖拽数据包中
const handleDragStart = (e) => {
  e.dataTransfer.setData("taskId", props.task.id);
};
// 优先级对应的中文和 Element Plus 标签颜色映射（直接复用即可）
const priorityMap = {
  high: { text: "高优先级", type: "danger" },
  medium: { text: "中优先级", type: "warning" },
  low: { text: "低优先级", type: "info" },
};
</script>

<template>
  <div class="task-card" draggable="true" @dragstart="handleDragStart">
    <div class="card-header">
      <el-tag
        :type="priorityMap[task.priority]?.type || 'info'"
        size="small"
        effect="light"
      >
        {{ priorityMap[task.priority]?.text || "普通" }}
      </el-tag>
      <!-- 点击删除按钮时，通过 emit 触发 'delete' 事件并把 task.id 传出去 -->
      <div class="card-actions">
        <el-button type="primary" link size="small" @click="emit('edit', task)">
          编辑
        </el-button>
        <el-button
          type="danger"
          link
          size="small"
          @click="emit('delete', task.id)"
        >
          删除
        </el-button>
      </div>
    </div>

    <h4 class="card-title">{{ task.title }}</h4>
    <p v-if="task.description" class="card-desc">{{ task.description }}</p>

    <div class="card-footer">
      <span class="due-date" v-if="task.dueDate">截止：{{ task.dueDate }}</span>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: grab;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card-title {
  margin: 0 0 6px 0;
  font-size: 15px;
  color: #303133;
}
.card-desc {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}
.card-footer {
  font-size: 12px;
  color: #909399;
}
</style>
