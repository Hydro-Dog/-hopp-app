import { Category } from "./category";
import { ProductImage } from "./product-image";
import { PRODUCT_STATE } from "../enums/product-state";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: ProductImage[];
  category: Category;
  state: PRODUCT_STATE;
  categoryId: number;
  imagesOrder: number[];
  createdAt: string;
  updatedAt: string;
};
