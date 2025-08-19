/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ReportGet } from "@/shared/types";
import useGetAllData from "@/shared/hooks/useGetAllData";
import { invoke } from "@tauri-apps/api/core";

type ReportsContextType = {
  summary: ReportGet;
  fetchReports: () => Promise<void>;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useGetAllData();
  const [summary, setSummary] = useState<ReportGet>({
    byProject: [],
    byCategory: [],
    byTask: [],
  });

  useEffect(() => {
    setSummary(data.summary);
  }, [data.summary]);

  const fetchReports = useCallback(async () => {
    try {
      const report = await invoke<ReportGet>("get_summary_report");
      setSummary(report);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <ReportsContext.Provider value={{ summary, fetchReports }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
};
