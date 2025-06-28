import { Notification } from "@/types/notifications";
import { generateNotifications } from "./mockData";

let mockNotifications = generateNotifications(20);

export const fetchNotifications = async (): Promise<Notification[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return mockNotifications;
};

export const deleteNotification = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  mockNotifications = mockNotifications.filter(notification => notification.id !== id);
};