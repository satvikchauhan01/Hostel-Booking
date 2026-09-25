import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <Sun size={18} className={`icon-btn__swap ${isDark ? 'is-on' : ''}`} />
      <Moon size={18} className={`icon-btn__swap ${isDark ? '' : 'is-on'}`} />
    </button>
  );
}
