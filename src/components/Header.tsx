'use client';

import React from 'react';
import { Moon, Sun, HelpCircle } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenWelcome
}) => {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Brand & University Identity */}
        <div className="header-brand">
          {/* Official SRM Logo */}
          <div className="header-logo-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/srm-logo.png"
              alt="SRM Institute of Science and Technology"
              className="header-logo-img"
            />
          </div>

          <div className="header-text-block">
            <div className="header-title-row">
              <span className="header-title">
                SRM <span style={{ color: 'var(--srm-gold)' }}>Directions</span>
              </span>
              <span className="header-badge">
                KTR
              </span>
            </div>
            <div className="header-subtitle">
              SRM Institute of Science and Technology • Walking Guide
            </div>
          </div>
        </div>

        {/* Minimal, Professional Header Actions */}
        <div className="header-actions">
          <button
            onClick={onOpenWelcome}
            className="btn-secondary header-guide-btn"
            title="Campus Welcome Guide"
            aria-label="Open Welcome Guide"
          >
            <HelpCircle size={16} color="var(--srm-gold)" />
            <span>Guide</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="header-theme-btn"
            aria-label="Toggle light and dark theme"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#071e48" />}
          </button>
        </div>
      </div>
    </header>
  );
};
