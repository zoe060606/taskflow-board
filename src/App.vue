<script setup>
import { Search } from "@element-plus/icons-vue";
import { useTaskStore } from "./stores/taskStore";
import BoardColumn from "./components/BoardColumn.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";

// 1. 初始化 Pinia 仓库
const taskStore = useTaskStore();

// 1. 新增：搜索关键词与优先级筛选状态
const searchQuery = ref("");
const filterPriority = ref("all"); // 'all' | 'high' | 'medium' | 'low'

// ================= 【练习：编写多条件过滤计算属性】 =================
// 提示：返回 taskStore.tasks.filter((t) => { ... })
// 条件 1（优先级匹配）：filterPriority.value === 'all' || t.priority === filterPriority.value
// 条件 2（关键词匹配）：标题 t.title 或描述 t.description（注意可能为空，用 (t.description || '')）转小写 .toLowerCase() 后，是否 .includes(searchQuery.value.trim().toLowerCase())
// 两个条件用 && 连接返回即可
const filteredTasks = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  return taskStore.tasks.filter((t) => {
    const matchPriority =
      filterPriority.value === "all" || t.priority === filterPriority.value;
    const matchKeyword =
      !keyword ||
      t.title.toLowerCase().includes(keyword) ||
      (t.description || "").toLowerCase().includes(keyword);
    return matchPriority && matchKeyword;
  });
});
// ===================================================================

// ================= 【练习 1：用 computed 拆分三列数据】 =================
// 提示：从 taskStore.tasks 中使用 .filter() 筛选出对应 status 的任务
// 1) todoTasks：筛选 status === 'todo'
const todoTasks = computed(() => {
  return filteredTasks.value.filter((t) => t.status === "todo");
});

// 2) doingTasks：筛选 status === 'doing'
const doingTasks = computed(() => {
  return filteredTasks.value.filter((t) => t.status === "doing");
});

// 3) doneTasks：筛选 status === 'done'
const doneTasks = computed(() => {
  return filteredTasks.value.filter((t) => t.status === "done");
});

// ================= 【练习 2：控制弹窗与表单数据】 =================
// 提示：定义 dialogVisible（布尔值 ref，默认 false）和 form（对象 ref，包含 title, description, priority, dueDate）
const dialogVisible = ref(false);
const editingId = ref(null);
const form = ref({
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
});

// 打开弹窗函数：把 form.value 重置为初始空值，并把 dialogVisible.value 设为 true
const openAddDialog = () => {
  editingId.value = null;
  form.value = {
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  };
  dialogVisible.value = true;
};
//新增：打开编辑弹窗并回填原数据
const openEditDialog = (task) => {
  editingId.value = task.id;
  form.value = { ...taask }; // 浅拷贝一份数据进表单，避免还没点保存页面卡片就跟着变
  dialogVisible.value = true;
};
// ================= 【练习 3：表单校验与提交】 =================
// 提示：
// 1) 判断 form.value.title.trim() 是否为空，为空则直接 return 阻止提交
// 2) 调用 taskStore.addTask(...) 把表单数据传进去
// 3) 关闭弹窗（把 dialogVisible.value 设为 false）
const handleSave = () => {
  if (!form.value.title.trim()) return;
  if (editingId.value) {
    taskStore.updateTask({ ...form.value, id: editingId.value });
  } else {
    // 新建模式
    taskStore.addTask(form.value);
  }
  dialogVisible.value = false;
};

const handleUndo = () => {
  const success = useTaskStore.undo();
  if (success) {
    ElMessage.success("已撤销上一步操作");
  }
};

const handleKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    handleUndo();
  }
};

onMounted(() => window.addEventListener("keydown", handleKeyDown));
onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
</script>

<template>
  <div class="app-container">
    <!-- 顶部栏 -->
    <header class="app-header">
      <div class="logo-area">
        <h2>TaskFlow Pro</h2>
        <span class="subtitle">敏捷任务看板</span>
      </div>
      <div class="toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索任务标题或描述"
          clearable
          style="width: 240px"
          :prefix-icon="Search"
        />
        <el-select v-model="filterPriority" style="width: 130px">
          <el-option label="全部优先级" value="all" />
          <el-option label="高优先级" value="high" />
          <el-option label="中优先级" value="medium" />
          <el-option label="低优先级" value="low" />
        </el-select>
        <el-button
          :disabled="taskStore.historyStack.length === 0"
          @click="handleUndo"
        >
          撤销 (Ctrl+Z)
        </el-button>
        <el-button type="primary" @click="openAddDialog">+ 新建任务</el-button>
      </div>
    </header>

    <!-- 核心三列看板区 -->
    <main class="board-wrapper">
      <BoardColumn
        title="待办 "
        status="todo"
        :tasks="todoTasks"
        @delete-task="taskStore.deleteTask"
        @drop-task="taskStore.changeTaskStatus"
        @edit-task="openEditDialog"
      />
      <BoardColumn
        title="进行中 "
        status="doing"
        :tasks="doingTasks"
        @delete-task="taskStore.deleteTask"
        @drop-task="taskStore.changeTaskStatus"
        @edit-task="openEditDialog"
      />
      <BoardColumn
        title="已完成 (Done)"
        status="done"
        :tasks="doneTasks"
        @delete-task="taskStore.deleteTask"
        @drop-task="taskStore.changeTaskStatus"
        @edit-task="openEditDialog"
      />
    </main>

    <!-- 新建任务弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑任务' : '新建任务'"
      width="460px"
    >
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
        <el-button type="primary" @click="handleSave">确认保存</el-button>
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
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
