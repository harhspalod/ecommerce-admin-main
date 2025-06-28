import { Order } from "@/types/order";
import { PaginationData, PaginationQueryProps } from "@/types/pagination";
import { generateOrders } from "./mockData";

const mockOrders = generateOrders(200);

export const fetchOrders = async ({
  page,
  perPage = 10,
}: PaginationQueryProps): Promise<PaginationData<Order>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = mockOrders.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(mockOrders.length / perPage);
  
  return {
    data: paginatedData,
    items: mockOrders.length,
    pages: totalPages,
    first: 1,
    last: totalPages,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
  };
};

export const fetchOrder = async ({ id }: { id: string }): Promise<Order> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const order = mockOrders.find(order => order.id === id) || mockOrders[0];
  return order;
};