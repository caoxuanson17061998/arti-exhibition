import {PayloadAction, createSlice} from "@reduxjs/toolkit";

export interface AddressInfo {
  fullName: string;
  phone: string;
  country: string;
  province?: string;
  district?: string;
  ward?: string;
  address: string;
  isDefault: boolean;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
  shippingFee: number;
  finalTotal: number;
}

export interface PaymentState {
  addressInfo: AddressInfo;
  orderSummary: OrderSummary;
  shippingMethod: "standard" | "express";
  paymentMethod: "cod" | "online" | "vietqr";
}

const initialState: PaymentState = {
  addressInfo: {
    fullName: "",
    phone: "",
    country: "Vietnam",
    province: "",
    district: "",
    ward: "",
    address: "",
    isDefault: false,
  },
  orderSummary: {
    subtotal: 0,
    discount: 0,
    discountPercentage: 0,
    total: 0,
    shippingFee: 0,
    finalTotal: 0,
  },
  shippingMethod: "standard",
  paymentMethod: "cod",
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setAddressInfo: (state, action: PayloadAction<AddressInfo>) => {
      state.addressInfo = action.payload;
    },
    setOrderSummary: (state, action: PayloadAction<OrderSummary>) => {
      state.orderSummary = action.payload;
    },
    setShippingMethod: (
      state,
      action: PayloadAction<"standard" | "express">,
    ) => {
      state.shippingMethod = action.payload;
      // Note: Shipping fee calculation is now handled in PaymentStep2 component
      // based on address and weight, not just method
    },
    setPaymentMethod: (
      state,
      action: PayloadAction<"cod" | "online" | "vietqr">,
    ) => {
      state.paymentMethod = action.payload;
    },
    resetPayment: () => initialState,
  },
});

export const {
  setAddressInfo,
  setOrderSummary,
  setShippingMethod,
  setPaymentMethod,
  resetPayment,
} = paymentSlice.actions;

// Selectors
export const selectAddressInfo = (state: {payment: PaymentState}) =>
  state.payment.addressInfo;
export const selectOrderSummary = (state: {payment: PaymentState}) =>
  state.payment.orderSummary;
export const selectShippingMethod = (state: {payment: PaymentState}) =>
  state.payment.shippingMethod;
export const selectPaymentMethod = (state: {payment: PaymentState}) =>
  state.payment.paymentMethod;

export default paymentSlice.reducer;
