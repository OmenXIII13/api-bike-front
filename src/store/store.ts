import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cart.slice';
import userSlice from './user.slice';
import themeSlice from './theme.slice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    user: userSlice,
    theme: themeSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;