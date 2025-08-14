/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CategoryGet } from '@/shared/types';
import useGetAllData from '@/shared/hooks/useGetAllData';
import { invoke } from '@tauri-apps/api/core';


type CategoriesContextType = {
  categories: CategoryGet[];
  fetchCategories: () => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, fetchAllData } = useGetAllData();
  const [categories, setCategories] = useState<CategoryGet[]>([]);

  useEffect(() => {
    setCategories(data.categories);
  }, [data.categories]);

  const fetchCategories = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const deleteCategory = useCallback(async (categoryId: number) => {
    try {
      await invoke('delete_category', { categoryId });
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoriesContext.Provider value={{ categories, fetchCategories, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
