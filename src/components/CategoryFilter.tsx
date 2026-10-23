'use client';

import React, { useMemo } from 'react';
import { PlaceCategory, getCategoryMeta } from '@/data/campusPlaces';
import { 
  Compass, 
  Utensils, 
  GraduationCap, 
  Building, 
  DoorOpen, 
  HeartPulse,
  MapPin
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: PlaceCategory | 'all';
  onSelectCategory: (category: PlaceCategory | 'all') => void;
  counts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts
}) => {
  const categories = useMemo(() => {
    const base: Array<{ id: string; label: string; icon: React.ReactNode }> = [
      { id: 'all', label: 'All Landmarks', icon: <Compass size={15} /> },
      { id: 'canteen', label: 'Food & Canteens', icon: <Utensils size={15} /> },
      { id: 'academic', label: 'Academic Blocks', icon: <GraduationCap size={15} /> },
      { id: 'hostel', label: 'Student Hostels', icon: <Building size={15} /> },
      { id: 'gate', label: 'Campus Gates', icon: <DoorOpen size={15} /> },
      { id: 'amenity', label: 'Healthcare & Services', icon: <HeartPulse size={15} /> }
    ];

    const knownIds = new Set(base.map(c => c.id));
    const extra: Array<{ id: string; label: string; icon: React.ReactNode }> = [];

    Object.keys(counts).forEach(key => {
      if (!knownIds.has(key) && counts[key] > 0) {
        const meta = getCategoryMeta(key);
        extra.push({
          id: key,
          label: meta.label,
          icon: <MapPin size={15} />
        });
      }
    });

    return [...base, ...extra];
  }, [counts]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.45rem',
      overflowX: 'auto',
      paddingBottom: '0.4rem',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              border: isSelected ? '1px solid var(--srm-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
              color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: isSelected ? 600 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: isSelected ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
          >
            <span style={{ color: isSelected ? 'var(--srm-gold)' : 'inherit', display: 'flex' }}>
              {cat.icon}
            </span>
            <span>{cat.label}</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.1rem 0.4rem',
              borderRadius: 'var(--radius-xs)',
              background: isSelected ? 'var(--srm-gold-subtle)' : 'var(--bg-subtle)',
              color: isSelected ? 'var(--srm-gold)' : 'var(--text-muted)'
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
