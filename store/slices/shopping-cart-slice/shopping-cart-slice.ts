import { createSlice } from "@reduxjs/toolkit";
import {
  delShoppingCart,
  fetchShoppingCart,
  postShoppingCart,
} from "./actions";
import { ShoppingCart } from "./types";
import { FETCH_STATUS, ErrorResponse } from "@/shared";

export type ShoppingCartState = {
  shoppingCart: ShoppingCart;
  fetchShoppingCartStatus: FETCH_STATUS;
  fetchShoppingCartError: ErrorResponse | null;
};

const initialState: ShoppingCartState = {
  shoppingCart: { items: [], quantity: 0, totalPrice: 0 },
  fetchShoppingCartStatus: FETCH_STATUS.IDLE,
  fetchShoppingCartError: null,
};

export const shoppingCart = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postShoppingCart.pending, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.LOADING;
      })
      .addCase(postShoppingCart.fulfilled, (state, action) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.SUCCESS;
        state.shoppingCart = action.payload || { items: [] };
      })
      .addCase(postShoppingCart.rejected, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.ERROR;
      })

      .addCase(fetchShoppingCart.pending, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchShoppingCart.fulfilled, (state, action) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.SUCCESS;
        state.shoppingCart = action.payload || { items: [] };
      })
      .addCase(fetchShoppingCart.rejected, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.ERROR;
      })

      .addCase(delShoppingCart.pending, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.LOADING;
      })
      .addCase(delShoppingCart.fulfilled, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.SUCCESS;
        state.shoppingCart = { items: [], quantity: 0, totalPrice: 0 };
      })
      .addCase(delShoppingCart.rejected, (state) => {
        state.fetchShoppingCartStatus = FETCH_STATUS.ERROR;
      });
  },
});
