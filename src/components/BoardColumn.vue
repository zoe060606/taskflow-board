<script setup>
import { ref, computed } from "vue";
import TaskCard from "./TaskCard.vue";

// ================= 【需要你自己补充的逻辑】 =================
// 练习 1：使用 defineProps 接收两个参数：
// 1) title：列标题（String，必填）
// 2) tasks：当前列的任务数组（Array，默认为空数组 () => []）
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    default: () => [],
  },
});

// 练习 2：使用 defineEmits 声明一个 'delete-task' 事件，把卡片触发的删除事件继续往外抛给 App.vue
const emit = defineEmits(["delete-task", "drop-task", "edit-task"]);
//控制拖拽悬停在当前列上方时的边框高亮效果
const isDragOver = ref(false);

const handleDrop = (e) => {
  isDragOver.value = false;
  const taskId = e.dataTransfer.getData("taskId");
  if (taskId) {
    emit("drop-task", taskId, props.status);
  }
};
// 练习 3：用 computed 计算当前列的任务总数 taskCount（返回 props.tasks.length）
const taskCount = computed(() => props.tasks.length);
// ==========================================================
</script>

<template>
  <div
    class="board-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop="handleDrop"
  >
    <div class="column-header">
      <span class="column-title">{{ title }}</span>
      <span class="task-count">{{ taskCount }}</span>
    </div>

    <div class="column-body">
      <TaskCard
        v-for="item in tasks"
        :key="item.id"
        :task="item"
        @delete="(id) => emit('delete-task', id)"
        @edit="(task) => emit('edit-task', task)"
      />
      <div v-if="tasks.length === 0" class="empty-tip">暂无任务</div>
    </div>
  </div>
</template>

<style scoped>
.board-column {
  flex: 1;
  min-width: 300px;
  background: #f4f5f7;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 120px);
}
.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}
.column-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f2329;
}
.task-count {
  background: #e4e7ed;
  color: #606266;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
}
.column-body {
  flex: 1;
  overflow-y: auto;
}
.empty-tip {
  text-align: center;
  color: #909399;
  font-size: 13px;
  padding: 30px 0;
}
.board-column.drag-over {
  background-color: #ecf5ff;
  outline: 2px dashed #409eff;
}
</style>
