import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeState {
  current: Theme;
}

// Получаем тему из localStorage или системных настроек
const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme') as Theme;
  if (saved) return saved;
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'auto';
  }
  
  return 'light';
};

const initialState: ThemeState = {
  current: getInitialTheme()
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.current = action.payload;
      localStorage.setItem('theme', action.payload);
      
      // Применяем тему сразу
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.current === 'light' ? 'dark' : 'light';
      state.current = newTheme;
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  }
});

// Функция применения темы
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Удаляем предыдущие темы
  root.removeAttribute('data-theme');
  
  if (theme === 'auto') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
document.body.style.backgroundColor = 'var(--bg-body)';
  document.body.style.color = 'var(--text-primary)';
};
// Применяем тему при загрузке
applyTheme(initialState.current);

export interface User {
  id: number;
  email: string;
  name: string;
}

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;