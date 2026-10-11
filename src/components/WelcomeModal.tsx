'use client';

import React, { useState } from 'react';
import { PlaceCategory, CATEGORY_INFO } from '@/data/campusPlaces';
import { 
  X, 
  Search, 
  Navigation2, 
  ArrowRight, 
  Utensils, 
  GraduationCap, 
  Building, 
  DoorOpen, 
  HeartPulse,
  Compass
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: PlaceCategory) => void;
  onSearchSubmit: (query: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSearchSubmit
}) => {
  const [modalSearch, setModalSearch] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleCategoryClick = (cat: PlaceCategory) => {
    onSelectCategory(cat);
    handleClose();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && modalSearch.trim()) {
      onSearchSubmit(modalSearch.trim());
      handleClose();
    }
  };

  const handleSearchButtonClick = () => {
    if (modalSearch.trim()) {
      onSearchSubmit(modalSearch.trim());
    }
    handleClose();
  };

  const getCategoryIcon = (cat: PlaceCategory) => {
    switch (cat) {
      case 'canteen': return <Utensils size={18} />;
      case 'academic': return <GraduationCap size={18} />;
      case 'hostel': return <Building size={18} />;
      case 'gate': return <DoorOpen size={18} />;
      case 'amenity': return <HeartPulse size={18} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '2.25rem 2rem'
        }}
      >
        {/* Dismiss Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.15s'
          }}
          aria-label="Close welcome modal"
        >
          <X size={16} />
        </button>

        {/* Header Branding */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-subtle)',
            marginBottom: '1rem'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/srm-logo.png"
              alt="SRM Institute of Science and Technology"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem'
          }}>
            Welcome to SRM Campus
          </h2>

          <p style={{
            fontSize: '0.96rem',
            color: 'var(--text-secondary)',
            fontWeight: 400,
            lineHeight: 1.5
          }}>
            Where would you like to go? Search a department, canteen, or block to get instant walking directions via Google Maps.
          </p>
        </div>

        {/* Elegant Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={17} 
              color="var(--text-light)" 
              style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder="e.g. Java Canteen, Tech Park, UB, Gate 1..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 2.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, background-color 0.15s'
              }}
            />
          </div>

          {modalSearch.trim() && (
            <button
              onClick={handleSearchButtonClick}
              className="btn-primary-gold"
              style={{ padding: '0.8rem 1.1rem' }}
            >
              <span>Search</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>

        {/* Clean Category Selection Grid */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}>
            Campus Zones & Categories
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.65rem'
          }}>
            {(['canteen', 'academic', 'hostel', 'gate', 'amenity'] as PlaceCategory[]).map((cat) => {
              const info = CATEGORY_INFO[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--srm-gold)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  }}
                >
                  <div style={{
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getCategoryIcon(cat)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>
                      {info.label.split('&')[0].trim()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main CTA */}
        <button
          onClick={handleClose}
          className="btn-primary-navy"
          style={{
            width: '100%',
            padding: '0.9rem 1.4rem',
            fontSize: '0.96rem',
            marginBottom: '1.25rem'
          }}
        >
          <span>Explore All Campus Places</span>
          <ArrowRight size={17} />
        </button>

        {/* Institutional Campus Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <span>Kattankulathur (KTR) Main Campus</span>
        </div>
      </div>
    </div>
  );
};
