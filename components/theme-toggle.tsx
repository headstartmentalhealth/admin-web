// components/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from './ui/Button';

export function ThemeToggle() {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Prevent rendering until mounted on client
  if (!isMounted) {
    return (
      <Button
        type='button'
        variant='ghost'
        size='icon'
        aria-label='Loading theme'
      >
        <div className='h-[1.2rem] w-[1.2rem]' />
      </Button>
    );
  }

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      className='rounded-full'
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className='h-[1.2rem] w-[1.2rem] transition-all text-black-1' />
      ) : (
        <Sun className='h-[1.2rem] w-[1.2rem] transition-all text-white' />
      )}
    </Button>
  );
}
