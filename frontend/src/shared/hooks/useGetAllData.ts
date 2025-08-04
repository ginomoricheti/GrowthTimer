import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

const useGetAllData = () => {
  const [data, setData] = useState({
    categories: [],
    goals: [],
    projects: [],
    tasks: [],
    pomodoros: []
  });

  const fetchAllData = async () => {
    try {
      const categories = await invoke('get_all_categories');
      const goals = await invoke('get_all_goals');
      const projects = await invoke('get_all_projects');
      const tasks = await invoke('get_all_tasks');
      const pomodoros = await invoke('get_all_pomodoros');
      
      setData({ categories, goals, projects, tasks, pomodoros });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return { data, fetchAllData, loading, error };
};