import { MOCK_SERIALS } from '@/data/mocks';
import { MachineSerial } from '@/types';

export const serialService = {
  async getSerials(): Promise<MachineSerial[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_SERIALS]), 200);
    });
  },

  async getSerialById(id: string): Promise<MachineSerial | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_SERIALS.find((s) => s.id === id || s.serialNumber === id);
        resolve(found ? { ...found } : undefined);
      }, 150);
    });
  },
};
