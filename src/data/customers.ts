import { Customer } from "@/types/customer";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { generateCustomers, paginateData } from "./mockData";

const mockCustomers = generateCustomers(150);

export const fetchCustomers = async ({
  page,
  perPage = 10,
}: PaginationQueryProps): Promise<PaginationData<Customer>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return paginateData(mockCustomers, page, perPage);
};