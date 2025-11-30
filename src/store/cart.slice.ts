// src/store/cart.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  count: number;
}

interface CartState {
  items: CartItem[];
}

const getInitialCart = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [] };
  }
  
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    try {
      return JSON.parse(cartData);
    } catch (e) {
      console.error('Error parsing cart from localStorage:', e);
    }
  }
  return { items: [] };
};

const initialState: CartState = getInitialCart();
const showNotification = (message: string) => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--accent);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{id: string; name: string; image: string; price: number}>) => {
    const { id, name, image, price } = action.payload;
    const existingItem = state.items.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.count += 1;
    } else {
      state.items.push({
        id,
        name,
        image,
        price,
        count: 1
      });
    }
    
    // Показываем уведомление
    if (typeof window !== 'undefined') {
      showNotification(`${name} добавлен в корзину!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(state));
  },
    remove: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        if (existingItem.count > 1) {
          existingItem.count -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    delete: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clear: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    }
  }
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;