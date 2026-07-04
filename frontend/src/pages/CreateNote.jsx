import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import {ArrowLeft, Loader2, Save, Tags} from 'lucide-react';
import { useCreateNote } from '../hooks/useNotes';

const noteSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).trim(),
  content: z.string().min(1, { message: 'Content cannot be empty' }),
  category: z.string().min(1, { message: 'Category is required' }).trim(),
  tagsString: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  isPinned: z.boolean().default(false),
});

export default function CreateNote() {
  const navigate = useNavigate();
  const createMutation = useCreateNote();
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'General',
      tagsString: '',
      status: 'active',
      isPinned: false,
    }
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      
      // Split tags by comma, trim whitespace
      const tags = data.tagsString
        ? data.tagsString.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

      await createMutation.mutateAsync({
        title: data.title,
        content: data.content,
        category: data.category,
        tags,
        status: data.status,
        isPinned: data.isPinned,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.errors?.[0] || err.response?.data?.message || 'Error occurred while saving note.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', background: 'var(--color-bg-card)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Create Workspace Note</h2>

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
              placeholder="Give your note a title..."
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
              placeholder="e.g. key-results, study-material, project-alpha"
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
              placeholder="Write your note content here..."
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
            <button type="submit" disabled={createMutation.isPending} className="btn btn-primary">
              {createMutation.isPending ? (
                <>
                  <Loader2 className="spinning" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Create Note</span>
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
