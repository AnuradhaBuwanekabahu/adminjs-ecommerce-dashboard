import React from "react";
import { useSettings } from "../contexts/SettingsContext";

export default function GlobalFooter() {
  const { settings } = useSettings();
  
  return (
    <footer style={{ background: 'rgba(11, 15, 25, 0.9)', padding: '2rem 0', marginTop: 'auto', borderTop: '1px solid var(--surface-border)' }}>
      <div className="container text-center">
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{settings.siteName || 'TechStore'}</h4>
        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>{settings.footerText || '© 2026 Premium E-Commerce. All rights reserved.'}</p>
        {settings.contactEmail && (
          <p className="text-secondary mt-1">
            Support: <a href={`mailto:${settings.contactEmail}`} className="text-gradient hover-underline">{settings.contactEmail}</a>
          </p>
        )}
      </div>
    </footer>
  );
}
