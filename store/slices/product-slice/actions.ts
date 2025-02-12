import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "./types";
import { axiosPrivate } from "@/services";
import { SearchResponse, SearchRequestParams, ErrorResponse } from "@/shared";
import { PRODUCT_STATE } from "@/shared/enums/product-state";

export const fetchProducts = createAsyncThunk<
  SearchResponse<Product>,
  { categoryId: number } & SearchRequestParams,
  { rejectValue: ErrorResponse }
>("products/fetchProducts", async ({ categoryId, pageNumber, limit, search, sort, order }, thunkAPI) => {
  try {
    const params = new URLSearchParams({
      pageNumber: String(pageNumber || 1),
      limit: String(limit || 10),
      search: search || "",
      sort: sort || "",
      order: order || "asc",
      categoryId: String(categoryId),
      state: PRODUCT_STATE.DEFAULT,
    });

    const response = await axiosPrivate.get<SearchResponse<Product>>("/products", { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({
        message: "An unknown error occurred",
      });
    }
  }
});
