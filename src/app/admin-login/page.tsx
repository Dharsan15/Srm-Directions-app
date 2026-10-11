'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  Navigation2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Database
} from 'lucide-react';
import { verifyAdminCredentials, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const supabaseActive = isSupabaseConfigured();

  useEffect(() => {
    // Check if user is already authenticated in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('srm_admin_auth') === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsAuthenticating(true);

    try {
      const res = await verifyAdminCredentials(username, password);

      if (res.success && res.user) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('srm_admin_auth', 'true');
          sessionStorage.setItem('srm_admin_user', res.user.username);
        }
        router.push('/admin');
      } else {
        setErrorMessage(res.error || 'Invalid administrator username or password.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during verification.';
      setErrorMessage(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: 'var(--bg-app)'
    }}>
      {/* Container Card */}
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-modal)',
        padding: '2.5rem 2.25rem'
      }}>
        {/* Institutional Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#ffffff',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-subtle)',
            margin: '0 auto 1.25rem'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/srm-logo.png"
              alt="SRM Institute of Science and Technology"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '0.4rem'
          }}>
            Campus Admin Portal
          </h1>

          <p style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)'
          }}>
            Sign in with your administrator username and password.
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            fontSize: '0.82rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Admin Username */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.4rem'
            }}>
              Administrator Username
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={16} 
                color="var(--text-light)" 
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type="text"
                placeholder="Enter username (e.g. admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Password
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Default: <code>srm123</code>
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={16} 
                color="var(--text-light)" 
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="btn-primary-navy"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.94rem',
              marginBottom: '1.25rem'
            }}
          >
            <span>{isAuthenticating ? 'Verifying with Database...' : 'Sign In to Admin Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Database Verification Note */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          padding: '0.75rem 0.9rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem'
        }}>
          <Database size={14} color="var(--srm-gold)" style={{ flexShrink: 0 }} />
          <div>
            Verified against the <strong>admin_users</strong> table in Supabase.
          </div>
        </div>

        {/* Back to Home link */}
        <div style={{
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem'
        }}>
          <Link
            href="/"
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Navigation2 size={13} />
            <span>Return to Campus Navigation Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
