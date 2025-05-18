// context/SettingsContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "../lib/axios";
import { Setting } from "../types/Settings";

interface SettingsContextType {
  settings: Setting[] | null;
  getSetting: (key: string) => string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Setting[] | null>(null);

  useEffect(() => {
    axios.get("/v1/settings").then(res => {
      setSettings(res.data?.settings || []);
    }).catch(err => {
      console.error("Failed to load settings:", err);
    });
  }, []);

  const getSetting = (key: string): string | null => {
    return settings?.find(s => s.key === key)?.value ?? null;
  };

  return (
    <SettingsContext.Provider value={{ settings, getSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
