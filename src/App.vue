<script setup>
import { ref, computed } from "vue";
import { useTaskStore } from "./stores/taskStore";
import BoardColumn from "./components/BoardColumn.vue";

// 1. 初始化 Pinia 仓库
const taskStore = useTaskStore();

// ================= 【练习 1：用 computed 拆分三列数据】 =================
// 提示：从 taskStore.tasks 中使用 .filter() 筛选出对应 status 的任务
// 1) todoTasks：筛选 status === 'todo'
const todoTasks = computed(() => {
  return taskStore.tasks.filter((t) => t.status === "todo");
});

// 2) doingTasks：筛选 status === 'doing'
const doingTasks = computed(() => {
  return taskStore.tasks.filter((t) => t.status === "doing");
});

// 3) doneTasks：筛选 status === 'done'
const doneTasks = computed(() => {
  return taskStore.tasks.filter((t) => t.status === "done");
});

// ================= 【练习 2：控制弹窗与表单数据】 =================
// 提示：定义 dialogVisible（布尔值 ref，默认 false）和 form（对象 ref，包含 title, description, priority, dueDate）
const dialogVisible = ref(false);
const form = ref({
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
});

// 打开弹窗函数：把 form.value 重置为初始空值，并把 dialogVisible.value 设为 true
const openAddDialog = () => {
  form.value = {
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  };
  dialogVisible.value = true;
};

// ================= 【练习 3：表单校验与提交】 =================
// 提示：
// 1) 判断 form.value.title.trim() 是否为空，为空则直接 return 阻止提交
// 2) 调用 taskStore.addTask(...) 把表单数据传进去
// 3) 关闭弹窗（把 dialogVisible.value 设为 false）
const handleCreate = () => {
  if (!form.value.title.trim()) {
    return;
  }
  taskStore.addTask(form.value);
  dialogVisible.value = false;
};
</script>

<template>
  <div class="app-container">
    <!-- 顶部栏 -->
    <header class="app-header">
      <div class="logo-area">
        <h2>TaskFlow Pro</h2>
        <span class="subtitle">敏捷任务看板</span>
      </div>
      <el-button type="primary" @click="openAddDialog">+ 新建任务</el-button>
    </header>

    <!-- 核心三列看板区 -->
    <main class="board-wrapper">
      <BoardColumn
        title="待办 (To Do)"
        :tasks="todoTasks"
        @delete-task="taskStore.deleteTask"
      />
      <BoardColumn
        title="进行中 (In Progress)"
        :tasks="doingTasks"
        @delete-task="taskStore.deleteTask"
      />
      <BoardColumn
        title="已完成 (Done)"
        :tasks="doneTasks"
        @delete-task="taskStore.deleteTask"
      />
    </main>

    <!-- 新建任务弹窗 -->
    <el-dialog v-model="dialogVisible" title="新建任务" width="460px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="任务标题" required>
          <el-input v-model="form.title" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="可选填具体细节"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="form.priority" style="width: 100%">
            <el-option label="高优先级" value="high" />
            <el-option label="中优先级" value="medium" />
            <el-option label="低优先级" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="form.dueDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择截止日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #ffffff;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.app-container {
  padding: 20px 32px;
  min-height: 100vh;
  box-sizing: border-box;
}
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.logo-area {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.logo-area h2 {
  margin: 0;
  color: #1f2329;
}
.subtitle {
  font-size: 13px;
  color: #909399;
}
.board-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  overflow-x: auto;
}
</style>
