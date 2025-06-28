import { Product } from "@/types/product";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { generateProducts, paginateData } from "./mockData";

const mockProducts = generateProducts(100);

export const fetchProducts = async ({
  page,
  perPage = 10,
}: PaginationQueryProps): Promise<PaginationData<Product>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return paginateData(mockProducts, page, perPage);
};