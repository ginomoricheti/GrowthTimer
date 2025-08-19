/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TaskGet } from '@/shared/types';
import useGetAllData from '@/shared/hooks/useGetAllData';
import { invoke } from '@tauri-apps/api/core';

type TasksContextType = {
  tasks: TaskGet[];
  fetchTasks: () => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, fetchAllData } = useGetAllData();
  const [tasks, setTasks] = useState<TaskGet[]>([]);

  useEffect(() => {
    setTasks(data.tasks);
  }, [data.tasks]);

  const fetchTasks = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await invoke('delete_task', { taskId });
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TasksContext.Provider value={{ tasks, fetchTasks, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
