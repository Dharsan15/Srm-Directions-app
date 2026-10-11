'use client';

import React, { useState } from 'react';
import { CampusPlace, CATEGORY_INFO, getGoogleMapsWalkingUrl } from '@/data/campusPlaces';
import { 
  Navigation2, 
  MapPin, 
  ExternalLink, 
  Share2, 
  Check, 
  Building2, 
  Utensils, 
  GraduationCap, 
  Building, 
  DoorOpen, 
  HeartPulse 
} from 'lucide-react';

interface PlaceCardProps {
  place: CampusPlace;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [copied, setCopied] = useState(false);
  const categoryMeta = CATEGORY_INFO[place.category];

  const handleCardClick = () => {
    const url = getGoogleMapsWalkingUrl(place.latitude, place.longitude, place.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getGoogleMapsWalkingUrl(place.latitude, place.longitude, place.name);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = () => {
    switch (place.category) {
      case 'canteen': return <Utensils size={13} />;
      case 'academic': return <GraduationCap size={13} />;
      case 'hostel': return <Building size={13} />;
      case 'gate': return <DoorOpen size={13} />;
      case 'amenity': return <HeartPulse size={13} />;
      default: return <MapPin size={13} />;
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="place-card-container"
      style={{
        padding: '1.35rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div>
        {/* Top Status & Category Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.85rem'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: `var(--cat-${place.category}-bg)`,
            color: `var(--cat-${place.category})`,
            border: `1px solid var(--cat-${place.category}-border)`
          }}>
            {getCategoryIcon()}
            <span>{categoryMeta.label}</span>
          </span>
        </div>

        {/* Place Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          marginBottom: '0.35rem'
        }}>
          {place.name}
        </h3>

        {/* Floor & Location details */}
        {place.floorOrBuilding && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--srm-gold)',
            marginBottom: '0.65rem'
          }}>
            <Building2 size={13} />
            <span>{place.floorOrBuilding}</span>
          </div>
        )}

        {/* Short Description */}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {place.shortDescription}
        </p>

        {/* Highlights / Tags */}
        {((place.popularItems && place.popularItems.length > 0) || (place.tags && place.tags.length > 0)) && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginBottom: '1.25rem'
          }}>
            {(place.popularItems || place.tags).slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem'
      }}>
        {/* Navigation Prompt */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--srm-gold)'
        }}>
          <Navigation2 size={14} fill="currentColor" />
          <span>Start Directions in Google Maps</span>
          <ExternalLink size={13} />
        </div>

        {/* Copy / Share Button */}
        <button
          onClick={handleCopyLink}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.35rem 0.6rem',
            cursor: 'pointer',
            color: copied ? '#059669' : 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            transition: 'all 0.15s'
          }}
          title="Copy Google Maps direction link"
        >
          {copied ? <Check size={12} /> : <Share2 size={12} />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>
    </article>
  );
};
