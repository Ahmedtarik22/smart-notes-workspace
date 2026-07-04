import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BookOpen, Pin, FileText, CheckCircle2, Archive, Loader2, Plus, ArrowRight } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  // Fetch the first 100 notes to compute stats and display recent items
  const { data, isLoading, isError } = useNotes({ limit: 100 });
  const allNotes = data?.data?.notes || [];

  // Compute stat totals
  const totalNotes = allNotes.length;
  const pinnedNotes = allNotes.filter((n) => n.isPinned);
  const draftsCount = allNotes.filter((n) => n.status === 'draft').length;
  const archivedCount = allNotes.filter((n) => n.status === 'archived').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome back, {user?.name || 'User'}!</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
            Here is a quick overview of your workspace notes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/notes" className="btn btn-secondary flex-center">
            <span>View All Notes</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/notes/create" className="btn btn-primary flex-center">
            <Plus size={18} />
            <span>New Note</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid Layout */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <Loader2 className="spinning" size={32} color="var(--color-primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            .spinning { animation: spin 1s linear infinite; }
          `}</style>
        </div>
      ) : isError ? (
        <div className="glass-panel" style={{ padding: '1.5rem', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>
          Failed to load stats overview. Please try refreshing.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Card 1: Total */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Notes</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalNotes}</h3>
            </div>
          </div>

          {/* Card 2: Pinned */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Pin size={24} fill="currentColor" style={{ transform: 'rotate(45deg)' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Pinned Items</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pinnedNotes.length}</h3>
            </div>
          </div>

          {/* Card 3: Drafts */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Draft WIPs</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{draftsCount}</h3>
            </div>
          </div>

          {/* Card 4: Archived */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--color-bg-card)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <Archive size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Archived</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{archivedCount}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Pinned Notes Showcase Area */}
      {!isLoading && !isError && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Pin size={20} color="var(--color-primary)" fill="var(--color-primary)" style={{ transform: 'rotate(45deg)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Pinned Notes</h2>
          </div>

          {pinnedNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 'var(--border-radius-md)' }}>
              <p>You don't have any pinned notes. Pin important notes to see them here first!</p>
              <Link to="/notes" className="btn btn-link" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                Go pin some notes
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {pinnedNotes.slice(0, 3).map((note) => (
                <div key={note._id} className="glass-panel" style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  border: '1px solid var(--color-border)',
                  position: 'relative'
                }}>
                  <div className="flex-between">
                    <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.65rem' }}>
                      {note.category || 'General'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0.25rem 0' }}>{note.title}</h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}>
                      {note.content}
                    </p>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/notes/${note._id}`} className="btn btn-secondary flex-center" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                      <span>View</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
