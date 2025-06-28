import { Category } from "@/types/category";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { generateCategories, paginateData } from "./mockData";

const mockCategories = generateCategories(50);

export const fetchCategories = async ({
  page,
  perPage = 10,
}: PaginationQueryProps): Promise<PaginationData<Category>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return paginateData(mockCategories, page, perPage);
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return mockCategories;
};