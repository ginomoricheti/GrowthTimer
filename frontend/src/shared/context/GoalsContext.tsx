/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GoalGet, GoalPost } from '@/shared/types';

type GoalsContextType = {
  goals: GoalGet[];
  fetchGoals: () => Promise<void>;
  createGoal: (goal: GoalPost) => Promise<void>;
  deleteGoal: (goalId: number) => Promise<void>;
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<GoalGet[]>([]);

  const fetchGoals = useCallback(async () => {
    try {
      const data = await invoke<GoalGet[]>('fetch_all_goals');
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }, []);

  const createGoal = useCallback(async (goal: GoalPost) => {
    try {
      await invoke('create_goal', { goal });
      await fetchGoals(); // refresca la lista
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (goalId: number) => {
    try {
      await invoke('delete_goal', { goalId });
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  }, [fetchGoals]);

  return (
    <GoalsContext.Provider value={{ goals, fetchGoals, createGoal, deleteGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};
