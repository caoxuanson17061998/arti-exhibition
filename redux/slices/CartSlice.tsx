import {Product} from "@app/types";
import {PayloadAction, createSlice} from "@reduxjs/toolkit";

export interface CartItem extends Product {
  quantity: number;
  selectedColors?: string[];
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<
        Product & {
          selectedColors?: string[];
          selectedSize?: string;
          quantity?: number;
        }
      >,
    ) => {
      const product = action.payload;
      // Compare id, selectedColors, and selectedSize for uniqueness
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedColors || []) ===
            JSON.stringify(product.selectedColors || []) &&
          item.selectedSize === product.selectedSize,
      );

      if (existingItemIndex >= 0) {
        // Update quantity for existing item
        state.items[existingItemIndex].quantity += product.quantity ?? 1;
      } else {
        // Add new item with quantity
        state.items.push({
          ...product,
          quantity: product.quantity ?? 1,
          selectedColors: product.selectedColors || [],
          selectedSize: product.selectedSize,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{id: string; type: "increase" | "decrease"}>,
    ) => {
      const {id, type} = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);

      if (itemIndex >= 0) {
        if (type === "increase") {
          state.items[itemIndex].quantity += 1;
        } else {
          state.items[itemIndex].quantity = Math.max(
            1,
            state.items[itemIndex].quantity - 1,
          );
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: {cart: CartState}) => state.cart.items;
export const selectCartTotal = (state: {cart: CartState}) =>
  state.cart.items.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0,
  );
export const selectCartItemCount = (state: {cart: CartState}) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectIsCartOpen = (state: {cart: CartState}) =>
  state.cart.isCartOpen;
