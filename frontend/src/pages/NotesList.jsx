import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Plus, RotateCcw, AlertCircle, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useNotes, useDeleteNote } from '../hooks/useNotes';
import useDebounce from '../hooks/useDebounce';
import DeleteModal from '../components/DeleteModal';
import NoteCard from '../components/NoteCard';
import {
  setSearch,
  setCategory,
  setStatus,
  setSort,
  setPage,
  resetFilters,
} from '../store/notesUiSlice';

export default function NotesList() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load filters from Redux UI store state
  const { search, category, status, sort, page } = useSelector((state) => state.notesUi);

  // Local input search buffer (debounced shortly after typing)
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Delete modal state
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const deleteMutation = useDeleteNote();

  // 1. Sync URL parameters to Redux UI store on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlStatus = searchParams.get('status') || '';
    const urlSort = searchParams.get('sort') || '-createdAt';
    const urlPage = parseInt(searchParams.get('page'), 10) || 1;

    dispatch(setSearch(urlSearch));
    dispatch(setCategory(urlCategory));
    dispatch(setStatus(urlStatus));
    dispatch(setSort(urlSort));
    dispatch(setPage(urlPage));
    setSearchInput(urlSearch);
  }, [dispatch]);

  // 2. Dispatch updated debounced search text input to Redux
  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // 3. Keep URL search parameters matching the Redux filters
  useEffect(() => {
    const newParams = {};
    if (search) newParams.search = search;
    if (category) newParams.category = category;
    if (status) newParams.status = status;
    if (sort !== '-createdAt') newParams.sort = sort;
    if (page !== 1) newParams.page = page.toString();

    setSearchParams(newParams, { replace: true });
  }, [search, category, status, sort, page, setSearchParams]);

  // Fetch paginated query
  const { data, isLoading, isError, error, refetch } = useNotes({
    search,
    category,
    status,
    sort,
    page,
    limit: 6,
  });

  const notesList = data?.data?.notes || [];
  const totalPages = data?.data?.totalPages || 1;

  const handleDeleteConfirm = async () => {
    if (deleteNoteId) {
      try {
        await deleteMutation.mutateAsync(deleteNoteId);
        setDeleteNoteId(null);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchInput('');
  };

  const categoriesList = ['Personal', 'Work', 'Ideas', 'Shopping', 'Study', 'Finance', 'General'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header bar controls */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Notes List</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Browse through your workspace notes with filtering and search options.
          </p>
        </div>
        <Link to="/notes/create" className="btn btn-primary">
          <Plus size={18} />
          <span>New Note</span>
        </Link>
      </div>

      {/* Filter Options */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-bg-card)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search notes..."
              className="form-input"
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Category:</span>
            <select
              value={category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
              className="form-input"
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Success/Draft state */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Status:</span>
            <select
              value={status}
              onChange={(e) => dispatch(setStatus(e.target.value))}
              className="form-input"
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sorted direction */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Sort:</span>
            <select
              value={sort}
              onChange={(e) => dispatch(setSort(e.target.value))}
              className="form-input"
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-title">Title (Z-A)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Reset filters link */}
        {(search || category || status || sort !== '-createdAt') && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleReset} className="btn btn-secondary flex-center" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid states */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
          <div className="spinning" style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Retrieving notes...</p>
        </div>
      ) : isError ? (
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid var(--color-danger)' }}>
          <AlertCircle color="var(--color-danger)" size={48} />
          <h3 style={{ fontWeight: 700 }}>Operation Failed</h3>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
            {error?.response?.data?.message || error?.message || 'Error occurred while loading notes.'}
          </p>
          <button onClick={() => refetch()} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
            Retry
          </button>
        </div>
      ) : notesList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', gap: '1rem', borderStyle: 'dashed' }}>
          <Inbox size={48} color="var(--color-text-muted)" />
          <h3 style={{ fontWeight: 700 }}>No Notes Found</h3>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: '400px' }}>
            {search || category || status 
              ? "We couldn't find any notes matching your filters."
              : "Your notes workspace is empty."
            }
          </p>
          {(search || category || status) && (
            <button onClick={handleReset} className="btn btn-secondary">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Notes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {notesList.map((note) => (
              <div key={note._id} className="animate-fade-in">
                <NoteCard note={note} onDeleteClick={(id) => setDeleteNoteId(id)} />
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex-center" style={{ gap: '1rem', marginTop: '1.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => dispatch(setPage(page - 1))}
                className="btn btn-secondary flex-center"
                style={{ padding: '0.5rem' }}
              >
                <ChevronLeft size={18} />
              </button>
              
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => dispatch(setPage(page + 1))}
                className="btn btn-secondary flex-center"
                style={{ padding: '0.5rem' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteNoteId}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Notes Item"
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
