'use client';

import React from 'react';
import { X, Download, Printer, QrCode, MapPin, Compass, ExternalLink } from 'lucide-react';

interface QRPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRPosterModal: React.FC<QRPosterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: '2rem 1.75rem',
          textAlign: 'center'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={16} />
        </button>

        {/* Printable Poster Container */}
        <div 
          id="printable-poster"
          style={{
            background: '#ffffff',
            color: '#041226',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1.5rem',
            border: '3px solid #071d49',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            marginBottom: '1.5rem'
          }}
        >
          {/* SRM Header Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '0.6rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#071d49',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5a623'
            }}>
              <Compass size={22} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#071d49', lineHeight: 1.1 }}>
                SRM UNIVERSITY
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#666', letterSpacing: '0.04em' }}>
                KATTANKULATHUR (KTR) CAMPUS
              </div>
            </div>
          </div>

          <div style={{
            background: '#f4f7fb',
            borderRadius: '8px',
            padding: '0.45rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#071d49',
            marginBottom: '1.25rem',
            border: '1px solid #e2e8f0'
          }}>
            📍 INSTANT CAMPUS GPS WALKING DIRECTIONS
          </div>

          {/* QR Code Graphic */}
          <div style={{
            display: 'inline-block',
            padding: '1rem',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '2px dashed #071d49',
            marginBottom: '1rem'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/srm-campus-qr.png" 
              alt="SRM Campus Universal QR Code" 
              style={{
                width: '230px',
                height: '230px',
                display: 'block',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#071d49', marginBottom: '0.25rem' }}>
            SCAN FOR LIVE DIRECTIONS
          </div>
          <div style={{ fontSize: '0.82rem', color: '#555', maxWidth: '300px', margin: '0 auto' }}>
            Open your smartphone camera to find Canteens, Academic Blocks, Hostels & Medical Services.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <a
            href="/srm-campus-qr.png"
            download="srm-campus-universal-qr.png"
            className="btn-gold"
            style={{ textDecoration: 'none', padding: '0.75rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Download size={16} />
            <span>Download High-Res QR</span>
          </a>

          <button
            onClick={handlePrint}
            className="btn-outline"
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Printer size={16} />
            <span>Print Poster</span>
          </button>
        </div>
      </div>
    </div>
  );
};
