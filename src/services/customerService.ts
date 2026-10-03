import { MOCK_CUSTOMERS } from '@/data/mocks';
import { Customer } from '@/types';

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_CUSTOMERS]), 200);
    });
  },

  async getCustomerById(id: string): Promise<Customer | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_CUSTOMERS.find((c) => c.id === id);
        resolve(found ? { ...found } : undefined);
      }, 150);
    });
  },
};
