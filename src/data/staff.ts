import { Staff } from "@/types/staff";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { generateStaff, paginateData } from "./mockData";

const mockStaff = generateStaff(40);

export const fetchStaff = async ({
  page,
  perPage = 10,
}: PaginationQueryProps): Promise<PaginationData<Staff>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return paginateData(mockStaff, page, perPage);
};