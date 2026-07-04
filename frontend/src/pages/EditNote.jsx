import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Tags, AlertCircle } from 'lucide-react';
import { useNote, useUpdateNote } from '../hooks/useNotes';

const noteSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).trim(),
  content: z.string().min(1, { message: 'Content cannot be empty' }),
  category: z.string().min(1, { message: 'Category is required' }).trim(),
  tagsString: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  isPinned: z.boolean().default(false),
});

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateNote();
  const [apiError, setApiError] = useState(null);

  // Load Note detail query
  const { data: note, isLoading, isError, error } = useNote(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
  });

  // Prepopulate form when note loads
  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content,
        category: note.category || 'General',
        tagsString: note.tags ? note.tags.join(', ') : '',
        status: note.status || 'active',
        isPinned: note.isPinned || false,
      });
    }
  }, [note, reset]);

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      
      const tags = data.tagsString
        ? data.tagsString.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

      await updateMutation.mutateAsync({
        id,
        fields: {
          title: data.title,
          content: data.content,
          category: data.category,
          tags,
          status: data.status,
          isPinned: data.isPinned,
        }
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.errors?.[0] || err.response?.data?.message || 'Error occurred while saving modifications.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
        <Loader2 className="spinning" size={40} color="var(--color-primary)" style={{ animation: 'spin 1.2s linear infinite' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Retrieving note information...</p>
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

  if (isError || !note) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid var(--color-danger)', maxWidth: '600px', margin: '4rem auto' }}>
        <AlertCircle color="var(--color-danger)" size={48} />
        <h3 style={{ fontWeight: 700 }}>Note Not Found</h3>
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {error?.response?.data?.message || error?.message || "The note you are trying to edit doesn't exist or you don't have access to it."}
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', background: 'var(--color-bg-card)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Workspace Note</h2>

        {apiError && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--border-radius-md)', color: 'var(--color-danger)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Note Title</label>
            <input
              type="text"
              className="form-input"
              {...register('title')}
            />
            {errors.title && <span className="form-error">{errors.title.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="General"
                {...register('category')}
              />
              {errors.category && <span className="form-error">{errors.category.message}</span>}
            </div>

            {/* Status Select */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Workflow Status</label>
              <select className="form-input" {...register('status')}>
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (WIP)</option>
                <option value="archived">Archived (Stored)</option>
              </select>
              {errors.status && <span className="form-error">{errors.status.message}</span>}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Tags size={16} />
              <span>Tags (comma-separated list)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. key-results, study-material"
              {...register('tagsString')}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Separate tags with commas. E.g. "todo, personal, shopping"
            </p>
          </div>

          {/* Content */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Content Body</label>
            <textarea
              className="form-input"
              rows={8}
              style={{ resize: 'vertical', minHeight: '150px' }}
              {...register('content')}
            />
            {errors.content && <span className="form-error">{errors.content.message}</span>}
          </div>

          {/* Pin Choice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <input
              type="checkbox"
              id="isPinned"
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--color-primary)',
                cursor: 'pointer'
              }}
              {...register('isPinned')}
            />
            <label htmlFor="isPinned" style={{ fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', userSelect: 'none' }}>
              Pin this note to the top of your stack
            </label>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={updateMutation.isPending} className="btn btn-primary">
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="spinning" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
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
