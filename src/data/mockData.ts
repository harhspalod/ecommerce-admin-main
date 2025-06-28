import { faker } from '@faker-js/faker';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { Customer } from '@/types/customer';
import { Coupon } from '@/types/coupon';
import { Staff } from '@/types/staff';
import { Notification } from '@/types/notifications';

// Generate Categories
export const generateCategories = (count: number = 20): Category[] => {
  return Array.from({ length: count }, () => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.commerce.department(),
    slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
    icon: '/temp/notification-img.jpg',
    description: faker.commerce.productDescription(),
    published: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

// Generate Products
export const generateProducts = (count: number = 50): Product[] => {
  const categories = generateCategories(10);
  
  return Array.from({ length: count }, () => {
    const price = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
    const discount = faker.number.float({ min: 0, max: 0.5, fractionDigits: 2 });
    
    return {
      _id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      categories: [faker.helpers.arrayElement(categories)],
      prices: {
        price,
        discount,
      },
      stock: faker.number.int({ min: 0, max: 100 }),
      sales: faker.number.int({ min: 0, max: 1000 }),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      status: faker.helpers.arrayElement(['selling', 'out-of-stock']) as 'selling' | 'out-of-stock',
      images: [
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      published: faker.datatype.boolean(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      variants: [],
    };
  });
};

// Generate Orders
export const generateOrders = (count: number = 100): Order[] => {
  return Array.from({ length: count }, () => ({
    id: faker.database.mongodbObjectId(),
    invoiceNo: `#${faker.number.int({ min: 10000, max: 99999 })}`,
    orderTime: faker.date.past(),
    customerName: faker.person.fullName(),
    method: faker.helpers.arrayElement(['cash', 'card', 'credit']) as 'cash' | 'card' | 'credit',
    amount: faker.number.float({ min: 20, max: 1000, fractionDigits: 2 }).toString(),
    status: faker.helpers.arrayElement(['pending', 'processing', 'delivered', 'cancel']) as 'pending' | 'processing' | 'delivered' | 'cancel',
  }));
};

// Generate Customers
export const generateCustomers = (count: number = 80): Customer[] => {
  return Array.from({ length: count }, () => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    image: faker.image.avatar(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

// Generate Coupons
export const generateCoupons = (count: number = 30): Coupon[] => {
  return Array.from({ length: count }, () => ({
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName() + ' Sale',
    couponCode: faker.string.alphanumeric(8).toUpperCase(),
    minimumAmount: faker.number.float({ min: 50, max: 200, fractionDigits: 2 }),
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: faker.number.float({ min: 0.05, max: 0.5, fractionDigits: 2 }),
    startTime: faker.date.past().toISOString(),
    endTime: faker.date.future().toISOString(),
    published: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

// Generate Staff
export const generateStaff = (count: number = 25): Staff[] => {
  return Array.from({ length: count }, () => ({
    id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    image: faker.image.avatar(),
    role: faker.helpers.arrayElement(['admin', 'cashier', 'super-admin']) as 'admin' | 'cashier' | 'super-admin',
    status: faker.helpers.arrayElement(['active', 'inactive']) as 'active' | 'inactive',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

// Generate Notifications
export const generateNotifications = (count: number = 15): Notification[] => {
  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(['new-order', 'stock-out']);
    
    if (type === 'new-order') {
      return {
        id: faker.database.mongodbObjectId(),
        type: 'new-order',
        imageUrl: '/temp/notification-img.jpg',
        name: faker.person.fullName(),
        price: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
        timestamp: faker.date.recent().toLocaleString(),
        isRead: faker.datatype.boolean().toString(),
      };
    } else {
      return {
        id: faker.database.mongodbObjectId(),
        type: 'stock-out',
        imageUrl: '/temp/notification-img.jpg',
        item: faker.commerce.productName(),
        timestamp: faker.date.recent().toLocaleString(),
        isRead: faker.datatype.boolean().toString(),
      };
    }
  });
};

// Pagination helper
export const paginateData = <T>(data: T[], page: number, perPage: number) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = data.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(data.length / perPage);
  
  return {
    data: paginatedData,
    items: data.length,
    pages: totalPages,
    first: 1,
    last: totalPages,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
  };
};