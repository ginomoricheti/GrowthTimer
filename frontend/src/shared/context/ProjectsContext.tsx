// ProjectsContext.tsx - Contexto unificado
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GoalGet, GoalPost, ProjectGet, ProjectPost } from '@/shared/types';
import useGetAllData from '@/shared/hooks/useGetAllData';

type ProjectsContextType = {
  // Projects
  projects: ProjectGet[];
  fetchProjects: () => Promise<void>;
  createProject: (project: ProjectPost) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  
  // Goals
  goals: GoalGet[];
  fetchGoals: () => Promise<void>;
  createGoal: (goal: GoalPost) => Promise<void>;
  deleteGoal: (goalId: number) => Promise<void>;
  
  // Shared
  refreshAllData: () => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, fetchAllData } = useGetAllData();
  const [projects, setProjects] = useState<ProjectGet[]>([]);
  const [goals, setGoals] = useState<GoalGet[]>([]);

  useEffect(() => {
    setProjects(data.projects || []);
    
    if (data.projects) {
      const allGoals = data.projects.flatMap(project => project.goals ?? []);
      setGoals(allGoals);
    }
  }, [data.projects]);

  const refreshAllData = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  // Projects methods
  const fetchProjects = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const createProject = useCallback(async (project: ProjectPost) => {
    try {
      await invoke('create_project', { project });
      await fetchAllData();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }, [fetchAllData]);

  const deleteProject = useCallback(async (projectId: number) => {
    try {
      await invoke('delete_project', { projectId });
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }, [fetchAllData]);

  // Goals methods
  const fetchGoals = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const createGoal = useCallback(async (goal: GoalPost) => {
    try {
      const newGoal = await invoke<GoalGet>('create_goal', { goal });
      setGoals(prev => [...prev, newGoal]);
      // Actualizamos todos los datos para mantener consistencia entre projects y goals
      await fetchAllData();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  }, [fetchAllData]);

  const deleteGoal = useCallback(async (goalId: number) => {
    try {
      await invoke('delete_goal', { goalId });
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  }, [fetchAllData]);

  return (
    <ProjectsContext.Provider value={{ 
      projects,
      fetchProjects,
      createProject,
      deleteProject,
      goals,
      fetchGoals,
      createGoal,
      deleteGoal,
      refreshAllData
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Hook principal que expone toda la funcionalidad
export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

// Hook específico solo para Goals (mantiene compatibilidad con código existente)
export const useGoals = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useGoals must be used within a ProjectsProvider');
  }
  
  return {
    goals: context.goals,
    fetchGoals: context.fetchGoals,
    createGoal: context.createGoal,
    deleteGoal: context.deleteGoal,
  };
};