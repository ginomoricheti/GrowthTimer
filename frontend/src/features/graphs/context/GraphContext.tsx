import { createContext, useContext } from 'react';
import { ProjectGet } from '@/shared/types';

export const GraphContext = createContext<ProjectGet | null>(null);

export const useGraphContext = () => {
  const context = useContext(GraphContext);

  if(!context) throw new Error("useGraphContext must be used within GraphProvider");
  return context;
}