import React, { createContext, useContext, useState, useEffect } from "react";
import { request } from "../services/api";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await request("/settings");
        if (Array.isArray(data)) {
          // Flatten array of {key, settingValue} to {key: settingValue}
          const settingsMap = data.reduce((acc, curr) => {
            acc[curr.key] = curr.settingValue || curr.value;
            return acc;
          }, {});
          setSettings(settingsMap);
        }
      } catch (error) {
        console.error("Failed to fetch settings globally", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, settingsLoading: loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
