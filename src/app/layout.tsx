import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Base World - Family & Personal Operating System',
  description: 'Quản trị công việc, quy trình, mục tiêu và tài chính cho gia đình & cá nhân',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased text-slate-800">{children}</body>
    </html>
  );
}
