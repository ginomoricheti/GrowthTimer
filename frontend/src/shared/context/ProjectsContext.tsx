/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectGet, ProjectPost } from '@/shared/types';
import useGetAllData from '@/shared/hooks/useGetAllData';
import { invoke } from '@tauri-apps/api/core';

type ProjectsContextType = {
  projects: ProjectGet[];
  fetchProjects: () => Promise<void>;
  createProject: (project: ProjectPost) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, fetchAllData } = useGetAllData();
  const [projects, setProjects] = useState<ProjectGet[]>([]);

  // Sincronize with data.projects
  useEffect(() => {
    setProjects(data.projects);
  }, [data.projects]);

  const fetchProjects = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const createProject = useCallback(async (project: ProjectPost) => {
    try {
      await invoke('create_project', { project });
      await fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (projectId: number) => {
    try {
      await invoke('delete_project', { projectId });
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }, [fetchProjects]);

  return (
    <ProjectsContext.Provider value={{ projects, fetchProjects, createProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
