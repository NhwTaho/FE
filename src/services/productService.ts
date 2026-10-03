import { MOCK_PRODUCTS } from '@/data/mocks';
import { Product } from '@/types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_PRODUCTS]), 200);
    });
  },

  async getProductById(id: string): Promise<Product | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_PRODUCTS.find((p) => p.id === id);
        resolve(found ? { ...found } : undefined);
      }, 150);
    });
  },
};
