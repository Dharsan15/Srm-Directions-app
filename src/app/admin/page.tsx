'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CampusPlace, PlaceCategory, CATEGORY_INFO, getGoogleMapsWalkingUrl } from '@/data/campusPlaces';
import { 
  fetchCampusPlaces, 
  addCampusPlace, 
  updateCampusPlace, 
  deleteCampusPlace 
} from '@/lib/placesService';
import { isSupabaseConfigured, getAdminUser, signOutAdmin } from '@/lib/supabase';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Search, 
  MapPin, 
  ExternalLink, 
  AlertCircle, 
  Download, 
  Check, 
  X, 
  Navigation2, 
  Building2, 
  Compass,
  QrCode
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState('Administrator');

  const [places, setPlaces] = useState<CampusPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PlaceCategory | 'all'>('all');

  // Modals & form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<CampusPlace | null>(null);
  const [showQRStudio, setShowQRStudio] = useState(false);
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'canteen' as PlaceCategory,
    latitude: '12.8235',
    longitude: '80.0450',
    shortDescription: '',
    floorOrBuilding: '',
    tags: '',
    popularItems: ''
  });

  // Action statuses
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabaseConnected = isSupabaseConfigured();

  // Supabase Authentication check
  useEffect(() => {
    async function verifyAuth() {
      const user = await getAdminUser();
      const hasSessionAuth = typeof window !== 'undefined' && sessionStorage.getItem('srm_admin_auth') === 'true';

      if (user) {
        setIsAuthenticated(true);
        setAdminUser(user.email || 'Administrator');
      } else if (hasSessionAuth) {
        setIsAuthenticated(true);
        const stored = sessionStorage.getItem('srm_admin_user');
        if (stored) setAdminUser(stored);
      } else {
        router.push('/admin-login');
      }
    }
    verifyAuth();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchCampusPlaces();
      setPlaces(res.places);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await signOutAdmin();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('srm_admin_auth');
      sessionStorage.removeItem('srm_admin_user');
    }
    router.push('/admin-login');
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'canteen',
      latitude: '12.8235',
      longitude: '80.0450',
      shortDescription: '',
      floorOrBuilding: '',
      tags: '',
      popularItems: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (place: CampusPlace) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      category: place.category,
      latitude: place.latitude.toString(),
      longitude: place.longitude.toString(),
      shortDescription: place.shortDescription,
      floorOrBuilding: place.floorOrBuilding || '',
      tags: place.tags ? place.tags.join(', ') : '',
      popularItems: place.popularItems ? place.popularItems.join(', ') : ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.latitude || !formData.longitude || !formData.shortDescription.trim()) {
      setStatusModal({
        isOpen: true,
        message: 'Please fill out all required fields.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const parsedPopular = formData.popularItems ? formData.popularItems.split(',').map(t => t.trim()).filter(Boolean) : [];

      if (editingPlace) {
        await updateCampusPlace(editingPlace.id, {
          name: formData.name.trim(),
          category: formData.category,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          shortDescription: formData.shortDescription.trim(),
          floorOrBuilding: formData.floorOrBuilding.trim() || undefined,
          tags: parsedTags,
          popularItems: parsedPopular
        });
        setEditingPlace(null);
      } else {
        await addCampusPlace({
          name: formData.name.trim(),
          category: formData.category,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          shortDescription: formData.shortDescription.trim(),
          floorOrBuilding: formData.floorOrBuilding.trim() || undefined,
          tags: parsedTags,
          popularItems: parsedPopular
        });
        setShowAddModal(false);
      }

      await loadData();
      setStatusModal({
        isOpen: true,
        message: 'updated successfully',
        type: 'success'
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setStatusModal({
        isOpen: true,
        message: msg,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the database?`)) {
      try {
        await deleteCampusPlace(id);
        await loadData();
        setStatusModal({
          isOpen: true,
          message: 'deleted successfully',
          type: 'success'
        });
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : 'Failed to delete';
        setStatusModal({
          isOpen: true,
          message: msg,
          type: 'error'
        });
      }
    }
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.floorOrBuilding && p.floorOrBuilding.toLowerCase().includes(q))
      );
    });
  }, [places, categoryFilter, searchQuery]);

  if (!isAuthenticated) {
    return null; // Protected route loading
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Navigation Bar */}
      <header className="admin-header">
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div style={{
              height: '42px',
              backgroundColor: '#ffffff',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-subtle)',
              flexShrink: 0
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/srm-logo.png"
                alt="SRM Institute of Science and Technology"
                style={{
                  height: '32px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  SRM Admin
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  Portal
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={() => setShowQRStudio(true)}
              className="btn-secondary admin-nav-btn"
              title="Campus Universal QR Poster"
            >
              <QrCode size={15} color="var(--srm-gold)" />
              <span>QR Poster</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="btn-secondary admin-nav-btn"
              style={{ textDecoration: 'none' }}
              title="View Live Public App"
            >
              <Navigation2 size={14} />
              <span>Public App</span>
              <ExternalLink size={12} />
            </Link>

            <button
              onClick={handleLogout}
              className="btn-secondary admin-nav-btn"
              style={{ color: '#ef4444' }}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '2rem 1.75rem 4rem', flex: 1 }}>
        {/* Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Locations
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {places.length}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Food & Canteens
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cat-canteen)', marginTop: '0.25rem' }}>
              {places.filter(p => p.category === 'canteen').length}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Academic Blocks
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cat-academic)', marginTop: '0.25rem' }}>
              {places.filter(p => p.category === 'academic').length}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Student Hostels
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cat-hostel)', marginTop: '0.25rem' }}>
              {places.filter(p => p.category === 'hostel').length}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Gates & Transit
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--cat-gate)', marginTop: '0.25rem' }}>
              {places.filter(p => p.category === 'gate').length}
            </div>
          </div>
        </div>

        {/* Directory Controls */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Filter database locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as PlaceCategory | 'all')}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            >
              <option value="all">All Categories</option>
              <option value="canteen">Food & Canteens</option>
              <option value="academic">Academic Blocks</option>
              <option value="hostel">Hostels</option>
              <option value="gate">Gates & Transit</option>
              <option value="amenity">Healthcare & Amenities</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleOpenAdd}
            className="btn-primary-navy"
            style={{ padding: '0.65rem 1.1rem', fontSize: '0.86rem' }}
          >
            <Plus size={16} />
            <span>Add New Campus Landmark</span>
          </button>
        </div>

        {/* Data Table */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderTop: 'none',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Landmark Name</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Building / Floor</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Coordinates (GPS)</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <tr
                    key={place.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{place.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {place.shortDescription}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        backgroundColor: `var(--cat-${place.category}-bg)`,
                        color: `var(--cat-${place.category})`,
                        border: `1px solid var(--cat-${place.category}-border)`
                      }}>
                        {CATEGORY_INFO[place.category].label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {place.floorOrBuilding || '—'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={getGoogleMapsWalkingUrl(place.latitude, place.longitude, place.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.35rem',
                            color: 'var(--text-muted)',
                            borderRadius: 'var(--radius-xs)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Preview in Google Maps"
                        >
                          <ExternalLink size={15} />
                        </a>

                        <button
                          onClick={() => handleOpenEdit(place)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--srm-gold)',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Edit Location"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(place.id, place.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete Location"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No landmarks matching the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add / Edit Location Modal Dialog */}
      {(showAddModal || editingPlace) && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingPlace(null); }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '2.25rem 2rem' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {editingPlace ? 'Edit Campus Landmark' : 'Add New Campus Landmark'}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setEditingPlace(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Landmark Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Java Green Canteen, Tech Park"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PlaceCategory })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="canteen">Food & Canteen</option>
                    <option value="academic">Academic Block</option>
                    <option value="hostel">Hostel</option>
                    <option value="gate">Gate & Transit</option>
                    <option value="amenity">Healthcare & Amenity</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Latitude (e.g. 12.8235) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Longitude (e.g. 80.0450) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Building & Floor Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Park Ground Floor, Near Lawn"
                  value={formData.floorOrBuilding}
                  onChange={(e) => setFormData({ ...formData, floorOrBuilding: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Accurate description of departments, services, or dining options..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Tags / Popular Highlights (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shawarma, Juices, CSE Labs, Placement Cell"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingPlace(null); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary-navy"
                >
                  {isSubmitting ? 'Saving...' : (editingPlace ? 'Update Landmark' : 'Save to Database')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Poster Studio Modal for Administrators */}
      {showQRStudio && (
        <div className="modal-overlay" onClick={() => setShowQRStudio(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '2.25rem 2rem', textAlign: 'center' }}
          >
            <button
              onClick={() => setShowQRStudio(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              background: '#ffffff',
              color: '#071e48',
              borderRadius: 'var(--radius-md)',
              padding: '1.75rem 1.25rem',
              border: '2px solid #071e48',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                SRM UNIVERSITY CAMPUS
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Kattankulathur (KTR) Main Campus
              </div>

              <div style={{
                display: 'inline-block',
                padding: '0.85rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                marginBottom: '1rem'
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/srm-campus-qr.png"
                  alt="SRM Universal Campus QR"
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                SCAN FOR WALKING DIRECTIONS
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '280px', margin: '0 auto' }}>
                Post at Main Gates, Tech Park, Canteens, and Student Hostels.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a
                href="/srm-campus-qr.png"
                download="srm-campus-qr.png"
                className="btn-primary-gold"
                style={{ textDecoration: 'none', fontSize: '0.86rem' }}
              >
                <Download size={15} />
                <span>Download Poster</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Status Modal */}
      {statusModal?.isOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setStatusModal(null)}
          style={{ zIndex: 10000 }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '360px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: statusModal.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${statusModal.type === 'error' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: statusModal.type === 'error' ? '#ef4444' : '#10b981'
            }}>
              {statusModal.type === 'error' ? <AlertCircle size={26} /> : <Check size={26} />}
            </div>

            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem'
            }}>
              {statusModal.message}
            </h3>

            <button
              onClick={() => setStatusModal(null)}
              className="btn-primary-navy"
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                fontSize: '0.88rem'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
