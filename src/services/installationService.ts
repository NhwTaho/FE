import { MOCK_INSTALLATIONS } from '@/data/mocks';
import { Installation } from '@/types';

export const installationService = {
  async getInstallations(): Promise<Installation[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_INSTALLATIONS]), 200);
    });
  },
};
