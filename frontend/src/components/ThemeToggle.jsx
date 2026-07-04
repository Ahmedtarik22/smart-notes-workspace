import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme } from '../store/themeSlice';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="btn btn-secondary flex-center"
      style={{
        padding: '0.5rem',
        borderRadius: 'var(--border-radius-full)',
        width: '40px',
        height: '40px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="animate-fade-in" size={20} color="#f59e0b" />
      ) : (
        <Moon className="animate-fade-in" size={20} color="#4f46e5" />
      )}
    </button>
  );
}
