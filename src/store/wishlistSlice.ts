import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        // Remove if exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        state.items.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state: any) => state.wishlist.items;
export const selectIsWishlisted = (state: any, productId: number) => 
  state.wishlist.items.some((item: Product) => item.id === productId);

export default wishlistSlice.reducer;
