import { MOCK_INVENTORY, MOCK_WAREHOUSES } from '@/data/mocks';
import { InventoryItem, Warehouse } from '@/types';

export const inventoryService = {
  async getInventory(): Promise<InventoryItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_INVENTORY]), 200);
    });
  },

  async getWarehouses(): Promise<Warehouse[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_WAREHOUSES]), 200);
    });
  },
};
