import { Coupon } from "@/types/coupon";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { generateCoupons, paginateData } from "./mockData";

const mockCoupons = generateCoupons(60);

export const fetchCoupons = async ({
  page,
  perPage = 10,
}: PaginationQueryProps): Promise<PaginationData<Coupon>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return paginateData(mockCoupons, page, perPage);
};