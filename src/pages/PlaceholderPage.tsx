import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Clock } from 'lucide-react';

export interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = 'Tính năng này nằm trong lộ trình phát triển giai đoạn tiếp theo.',
}) => {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <EmptyState
        title="Module Đang Trong Lộ Trình Phát Triển"
        description="Hiện tại hệ thống MVP đang tập trung tối ưu 10 module cốt lõi (Khách hàng, Đơn hàng, Sản phẩm, Tồn kho, Serial máy, Lắp đặt, Bảo hành...)."
        icon={<Clock className="h-8 w-8 text-amber-500 animate-pulse" />}
      />
    </PageContainer>
  );
};
