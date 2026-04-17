import React from "react";
import { useSettings } from "../contexts/SettingsContext";

export default function GlobalBanner() {
  const { settings } = useSettings();
  if (!settings.bannerMessage) return null;

  return (
    <div style={{ background: 'var(--accent-glow)', color: 'white', textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
      {settings.bannerMessage}
    </div>
  );
}
