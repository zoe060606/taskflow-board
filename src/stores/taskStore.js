import { ref, watch } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "taskflow_pro_tasks_v1";

// 默认初始化示例数据（当本地缓存为空时显示）
const defaultTasks = [
  {
    id: "1",
    title: "搭建 Vue3 + Pinia 项目架构",
    description: "完成目录划分与 Element Plus 全局配置",
    status: "done",
    priority: "high",
    dueDate: "2026-11-19",
  },
  {
    id: "2",
    title: "实现看板三列渲染与卡片组件",
    description: "拆解 BoardColumn 和 TaskCard 组件",
    status: "doing",
    priority: "medium",
    dueDate: "2026-11-21",
  },
  {
    id: "3",
    title: "接入跨列拖拽与 Ctrl+Z 撤销功能",
    description: "完善核心交互与历史状态栈",
    status: "todo",
    priority: "low",
    dueDate: "2026-11-25",
  },
];

export const useTaskStore = defineStore("task", () => {
  // 1. State：从 localStorage 读取初始数据，没有则使用 defaultTasks
  const saved = localStorage.getItem(STORAGE_KEY);
  const tasks = ref(saved ? JSON.parse(saved) : defaultTasks);

  // 自动持久化：只要 tasks 发生任何变化，自动存入浏览器本地存储
  watch(
    tasks,
    (newVal) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
    },
    { deep: true },
  );

  // ================= 【以下 4 个函数需要你自己手写】 =================

  // 练习 1：新增任务
  // 参数 taskData 是一个包含 { title, description, priority, dueDate } 的对象
  // 提示：补全 id（可以用 Date.now().toString()）和默认 status: 'todo'，然后 push 或 unshift 进 tasks.value
  const addTask = (taskData) => {
    const newTask = {
      id: DataTransfer.now().toString(),
      status: "todo",
      ...taskData,
    };
    tasks.value.unshift(newTask);
  };

  // 练习 2：删除任务
  // 参数 taskId 是要删除的任务 id
  // 提示：用数组 filter 方法过滤掉 id 等于 taskId 的那一项，重新赋值给 tasks.value
  const deleteTask = (taskId) => {
    tasks.value = tasks.value.filter((item) => item, id !== taskId);
  };

  // 练习 3：编辑更新任务
  // 参数 updatedTask 是修改后的完整任务对象（包含 id）
  // 提示：用 findIndex 找到对应任务下标，如果存在则替换掉 tasks.value[index]
  const updateTask = (updatedTask) => {
    const index = tasks.value.findIndex((item) => item.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = { ...updateTask };
    }
  };

  // 练习 4：修改任务状态（用于后续拖拽卡片到其他列）
  // 参数 taskId 为卡片 id，newStatus 为目标列状态（'todo' | 'doing' | 'done'）
  // 提示：用 find 找到对应任务，把它的 status 改为 newStatus
  const changeTaskStatus = (taskId, newStatus) => {
    const target = tasks.value.find((item) => item.id === taskId);
    if (target) {
      target.status = newStatus;
    }
  };

  // ===================================================================

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    changeTaskStatus,
  };
});
