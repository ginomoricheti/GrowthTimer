/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PomodoroRecordGet } from "@/shared/types";
import useGetAllData from "@/shared/hooks/useGetAllData";
import { invoke } from "@tauri-apps/api/core";

type PomodorosContextType = {
  pomodoros: PomodoroRecordGet[];
  fetchPomodoros: () => Promise<void>;
  addPomodoro: (pomodoro: Omit<PomodoroRecordGet, "id">) => Promise<void>;
  deletePomodoro: (pomodoroId: number) => Promise<void>;
};

const PomodorosContext = createContext<PomodorosContextType | undefined>(undefined);

export const PomodorosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, fetchAllData } = useGetAllData();
  const [pomodoros, setPomodoros] = useState<PomodoroRecordGet[]>([]);

  // Sincroniza el estado local cuando cambian los datos globales
  useEffect(() => {
    setPomodoros(data.pomodoros);
  }, [data.pomodoros]);

  const fetchPomodoros = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const addPomodoro = useCallback(async (pomodoro: Omit<PomodoroRecordGet, "id">) => {
    try {
      await invoke("create_pomodoro", { pomodoro });
      await fetchPomodoros();
    } catch (error) {
      console.error("Error creating pomodoro:", error);
    }
  }, [fetchPomodoros]);

  const deletePomodoro = useCallback(async (pomodoroId: number) => {
    try {
      await invoke("delete_pomodoro", { pomodoroId });
      await fetchPomodoros();
    } catch (error) {
      console.error("Error deleting pomodoro:", error);
    }
  }, [fetchPomodoros]);

  useEffect(() => {
    fetchPomodoros();
  }, [fetchPomodoros]);

  return (
    <PomodorosContext.Provider value={{ pomodoros, fetchPomodoros, addPomodoro, deletePomodoro }}>
      {children}
    </PomodorosContext.Provider>
  );
};

export const usePomodoros = (): PomodorosContextType => {
  const context = useContext(PomodorosContext);
  if (!context) {
    throw new Error("usePomodoros must be used within a PomodorosProvider");
  }
  return context;
};
