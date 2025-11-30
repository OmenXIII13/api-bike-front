// src/store/user.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PREFIX } from '../helpers/API';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  profile: UserProfile | null;
  jwt: string | null;
  loginErrorMessage?: string;
  registerErrorMessage?: string;
}

const initialState: UserState = {
  profile: null,
  jwt: localStorage.getItem('jwt')
};

// Получение профиля
export const getProfile = createAsyncThunk<UserProfile, void, { state: { user: UserState } }>(
  'user/getProfile',
  async (_, thunkAPI) => {
    const jwt = thunkAPI.getState().user.jwt;
    if (!jwt) {
      throw new Error('Нет токена');
    }
    
    console.log('🔐 JWT Token:', jwt);
    
    try {
      // Декодируем JWT токен
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      
      console.log('📋 JWT Payload:', payload);
      
      const userEmail = payload.email || 'Не указан';
      
      // Пробуем получить имя в порядке приоритета:
      // 1. Из localStorage (сохраненное при регистрации)
      const savedName = localStorage.getItem(`userName_${userEmail}`);
      if (savedName) {
        console.log('👤 Found saved name in localStorage:', savedName);
        return {
          id: payload.id || payload.userId || payload.sub || 1,
          name: savedName,
          email: userEmail
        };
      }
      
      // 2. Из JWT payload (если есть)
      const userName = payload.name || 
                      payload.username || 
                      payload.fullName ||
                      payload.displayName;
      
      if (userName) {
        console.log('👤 Found name in JWT:', userName);
        return {
          id: payload.id || payload.userId || payload.sub || 1,
          name: userName,
          email: userEmail
        };
      }
      
      // 3. Fallback - из email
      const fallbackName = userEmail.split('@')[0];
      console.log('👤 Using fallback name from email:', fallbackName);
      
      return {
        id: payload.id || payload.userId || payload.sub || 1,
        name: fallbackName,
        email: userEmail
      };
    } catch (error) {
      console.error('❌ Error decoding JWT:', error);
      return {
        id: 1,
        name: 'Пользователь',
        email: 'user@example.com'
      };
    }
  }
);

// Логин
export const login = createAsyncThunk<string, { email: string; password: string }>(
  'user/login',
  async ({ email, password }) => {
    try {
      console.log('Sending login request to:', `${PREFIX}/auth/login`);
      
      const { data } = await axios.post<{ token: string }>(`${PREFIX}/auth/login`, {
        email,
        password
      });

      console.log('Login response:', data);

      if (!data.token) {
        throw new Error('Токен не получен');
      }

      return data.token;
    } catch (error: any) {
      console.error('Login error details:', error.response?.data);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Неверный email или пароль');
      } else if (error.response?.status === 400) {
        throw new Error('Неверные данные для входа');
      }
      throw new Error('Ошибка авторизации');
    }
  }
);

// Регистрация
export const register = createAsyncThunk<string, { email: string; password: string; name: string }>(
  'user/register',
  async ({ email, password, name }) => {
    try {
      console.log('Sending register request to:', `${PREFIX}/auth/register`);
      console.log('Register data:', { email, password, name });

      const { data } = await axios.post<{ token: string }>(`${PREFIX}/auth/register`, {
        email,
        password,
        name
      });

      console.log('Register response:', data);

      if (!data.token) {
        throw new Error('Токен не получен');
      }

      // Сохраняем имя с привязкой к email сразу после успешной регистрации
      localStorage.setItem(`userName_${email}`, name);
      console.log('✅ Name saved to localStorage:', name);

      return data.token;
    } catch (error: any) {
      console.error('Register error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 400) {
        throw new Error('Пользователь с таким email уже существует');
      } else if (error.response?.status === 401) {
        throw new Error('Ошибка регистрации: неверные данные');
      } else if (error.response?.status === 422) {
        throw new Error('Ошибка валидации данных');
      }
      throw new Error('Ошибка регистрации');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.jwt = null;
      state.profile = null;
      localStorage.removeItem('jwt');
    },
    clearLoginError: (state) => {
      state.loginErrorMessage = undefined;
    },
    clearRegisterError: (state) => {
      state.registerErrorMessage = undefined;
    },
    updateProfileName: (state, action) => {
      if (state.profile) {
        state.profile.name = action.payload;
        // Также обновляем в localStorage
        if (state.profile.email) {
          localStorage.setItem(`userName_${state.profile.email}`, action.payload);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.jwt = action.payload;
        state.loginErrorMessage = undefined;
        localStorage.setItem('jwt', action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loginErrorMessage = action.error.message;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.jwt = action.payload;
        state.registerErrorMessage = undefined;
        localStorage.setItem('jwt', action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.registerErrorMessage = action.error.message;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        console.error('Profile error:', action.error);
      });
  }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;