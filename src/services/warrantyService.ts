import { MOCK_WARRANTIES } from '@/data/mocks';
import { Warranty } from '@/types';

export const warrantyService = {
  async getWarranties(): Promise<Warranty[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_WARRANTIES]), 200);
    });
  },
};
