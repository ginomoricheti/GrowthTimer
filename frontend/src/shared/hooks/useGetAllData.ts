import { invoke } from '@tauri-apps/api/core';
import { useState, useCallback } from 'react';
import { CategoryGet, PomodoroRecordGet, ProjectGet, ReportGet, TaskGet } from '../types';

interface DataProps {
  categories: CategoryGet[],
  projects: ProjectGet[],
  tasks: TaskGet[],
  pomodoros: PomodoroRecordGet[],
  summary: ReportGet,
}

const useGetAllData = () => {
  const [data, setData] = useState<DataProps>({
    categories: [],
    projects: [],
    tasks: [],
    pomodoros: [],
    summary: {
      byProject: [],
      byCategory: [],
      byTask: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const projects = await invoke<ProjectGet[]>('get_projects');
      const categories = await invoke<CategoryGet[]>('get_categories');
      const pomodoros = await invoke<PomodoroRecordGet[]>('get_pomodoros');
      const tasks = await invoke<TaskGet[]>('get_tasks');
      const summary = await invoke<ReportGet>('get_summary_report');
      
      setData({ categories, summary, projects, tasks, pomodoros });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, fetchAllData, loading, error };
};

export default useGetAllData;
