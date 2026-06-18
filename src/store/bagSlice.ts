import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BagItem, Product } from '../types';

interface BagState {
  items: BagItem[];
}

const initialState: BagState = {
  items: [],
};

const bagSlice = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    addToBag: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromBag: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    clearBag: (state) => {
      state.items = [];
    },
  },
});

export const { addToBag, removeFromBag, increaseQuantity, decreaseQuantity, clearBag } = bagSlice.actions;

// Selectors
export const selectBagItems = (state: { bag: BagState }) => state.bag.items;
export const selectTotalItems = (state: { bag: BagState }) => 
  state.bag.items.reduce((total, item) => total + item.quantity, 0);
export const selectGrandTotal = (state: { bag: BagState }) => 
  state.bag.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default bagSlice.reducer;
