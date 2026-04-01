import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from './providers';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Sistema de gestión de tareas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
