import { MOCK_ORDERS } from '@/data/mocks';
import { Order } from '@/types';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_ORDERS]), 200);
    });
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_ORDERS.find((o) => o.id === id);
        resolve(found ? { ...found } : undefined);
      }, 150);
    });
  },
};
