import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carl Balansag | Full Stack Developer',
  description: 'Portfolio of Carl Balansag - Full Stack Developer specializing in modern web technologies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
