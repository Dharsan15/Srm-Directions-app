'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CampusPlace, PlaceCategory, CATEGORY_INFO } from '@/data/campusPlaces';
import { fetchCampusPlaces } from '@/lib/placesService';
import { Header } from '@/components/Header';
import { WelcomeModal } from '@/components/WelcomeModal';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PlaceCard } from '@/components/PlaceCard';
import { 
  Search, 
  MapPin, 
  RotateCcw,
  Footprints,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [places, setPlaces] = useState<CampusPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');

  // Modals
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load theme & welcome modal preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('srm_nav_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const welcomeDismissed = localStorage.getItem('srm_nav_welcome_dismissed');
    if (!welcomeDismissed) {
      const timer = setTimeout(() => {
        setIsWelcomeOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('srm_nav_theme', nextTheme);
  };

  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      const res = await fetchCampusPlaces();
      setPlaces(res.places);
    } catch (err) {
      console.error('Failed to load places:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<PlaceCategory | 'all', number> = {
      all: places.length,
      canteen: 0,
      academic: 0,
      hostel: 0,
      gate: 0,
      amenity: 0
    };
    places.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = place.name.toLowerCase().includes(q);
      const matchDesc = place.shortDescription ? place.shortDescription.toLowerCase().includes(q) : false;
      const matchLocation = place.floorOrBuilding?.toLowerCase().includes(q) || false;
      const matchTags = place.tags?.some((t) => t.toLowerCase().includes(q)) || false;
      const matchPopular = place.popularItems?.some((i) => i.toLowerCase().includes(q)) || false;

      return matchName || matchDesc || matchLocation || matchTags || matchPopular;
    });
  }, [places, selectedCategory, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header without QR or Admin buttons */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
      />

      <main style={{
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        padding: '1.75rem 1.5rem 5rem',
        flex: 1
      }}>
        {/* Institutional Hero Banner */}
        <section style={{
          background: 'linear-gradient(135deg, var(--srm-primary) 0%, var(--srm-primary-dark) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2.25rem',
          color: '#ffffff',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-xs)',
              background: 'rgba(197, 155, 39, 0.15)',
              border: '1px solid var(--srm-gold-border)',
              color: 'var(--srm-gold)',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              <Compass size={13} />
              SRM Institute of Science and Technology • Kattankulathur
            </div>

            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              color: '#ffffff'
            }}>
              Campus Navigation & Directory
            </h1>

            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '1.75rem',
              lineHeight: 1.6,
              fontWeight: 400
            }}>
              Select any campus landmark below to launch instant walking directions in Google Maps using your real-time device GPS.
            </p>

            {/* Clean Institutional Search Input */}
            <div style={{
              position: 'relative',
              maxWidth: '560px'
            }}>
              <Search
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search departments, canteens, hostels, or gates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem 0.9rem 2.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 600
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <div style={{ marginBottom: '1.75rem' }}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Directory Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedCategory === 'all' 
                ? 'All Campus Locations' 
                : CATEGORY_INFO[selectedCategory].label}
            </h2>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '0.15rem 0.55rem',
              borderRadius: 'var(--radius-xs)'
            }}>
              {filteredPlaces.length} locations
            </span>
          </div>

          <div style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Footprints size={14} color="var(--srm-gold)" />
            <span>Select any card to navigate in Google Maps</span>
          </div>
        </div>

        {/* Landmark Grid */}
        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                style={{
                  height: '200px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)'
                }} 
              />
            ))}
          </div>
        ) : filteredPlaces.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          /* Empty Search Results */
          <div style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <MapPin size={38} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No campus locations found for &quot;{searchQuery}&quot;
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Verify the landmark spelling, or browse by category above.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="btn-secondary"
            >
              <RotateCcw size={14} />
              <span>Reset Search Query</span>
            </button>
          </div>
        )}
      </main>

      {/* Clean University Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '1.75rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>SRM Institute of Science and Technology</strong> • Kattankulathur (KTR), Chengalpattu District, Tamil Nadu 603203
          </div>
          <div>
            Campus Navigation System • Walking Direction Guide
          </div>
        </div>
      </footer>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onSearchSubmit={(query) => setSearchQuery(query)}
      />
    </div>
  );
}
