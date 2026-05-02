import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CareerForge AI',
  description: 'Student career-prep copilot'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
