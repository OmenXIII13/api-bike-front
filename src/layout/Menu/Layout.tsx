// src/layout/Menu/Layout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import Button from '../../components/Button/Button';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProfile, userActions } from '../../store/user.slice';
import { themeActions } from '../../store/theme.slice';
import { useEffect } from 'react';

export function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((s: RootState) => s.user.profile);
  const items = useSelector((s: RootState) => s.cart.items);
  const jwt = useSelector((s: RootState) => s.user.jwt);
  const theme = useSelector((s: RootState) => s.theme.current);

  useEffect(() => {
    if (jwt && !profile) {
      console.log('Загружаем профиль...');
      dispatch(getProfile());
    }
  }, [jwt, profile, dispatch]);

  // Функция для получения отображаемого имени
  const getDisplayName = (): string => {
    // 1. Из профиля (основной источник)
    if (profile?.name) {
      return profile.name;
    }
    
    // 2. Из localStorage с привязкой к email
    if (profile?.email) {
      const savedName = localStorage.getItem(`userName_${profile.email}`);
      if (savedName) {
        return savedName;
      }
      
      // 3. Fallback - из email
      const username = profile.email.split('@')[0];
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    return 'Гость';
  };

  const logout = () => {
    dispatch(userActions.logout());
    navigate('/auth/login');
  };

  const login = () => {
    navigate('/auth/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const toggleTheme = () => {
    dispatch(themeActions.toggleTheme());
  };

  return (
    <div className={styles['layout']}>
      <div className={styles['sidebar']}>
        <div className={styles['user']} onClick={goToProfile}>
          <div className={styles['avatar']}>
            <img src="/avatar.png" alt="Аватар пользователя" />
          </div>
          <div className={styles['user-details']}>
            <div className={styles['user-name']}>
              {getDisplayName()}
            </div>
            <div className={styles['user-email']}>
              {profile?.email || 'Войдите в аккаунт'}
            </div>
          </div>
        </div>

        <div className={styles['menu']}>
          <NavLink to='/' className={({ isActive }) => cn(styles['link'], {
            [styles.active]: isActive
          })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Меню
          </NavLink>
          <NavLink to='/cart' className={({ isActive }) => cn(styles['link'], {
            [styles.active]: isActive
          })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Корзина <span className={styles['cart-count']}>{items.reduce((acc, item) => acc + item.count, 0)}</span>
          </NavLink>
          {jwt && (
            <NavLink to='/profile' className={({ isActive }) => cn(styles['link'], {
              [styles.active]: isActive
            })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Профиль
            </NavLink>
          )}
        </div>

        {/* Переключатель темы */}
        <div className={styles['theme-switcher']}>
          <button 
            onClick={toggleTheme}
            className={styles['theme-toggle']}
            title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
            <span>{theme === 'light' ? 'Темная тема' : 'Светлая тема'}</span>
          </button>
        </div>

        {jwt ? (
          <Button className={styles['exit']} onClick={logout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Выход
          </Button>
        ) : (
          <Button className={styles['exit']} onClick={login}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Войти
          </Button>
        )}
      </div>
      <div className={styles['content']}>
        <Outlet />
      </div>
    </div>
  );
}