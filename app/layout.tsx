import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

import ReduxProvider from '@/redux/redux-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Headstart Admin',
  description: '',
  icons: {
    icon: '/icons/icon.png',
  },
};

// Load DM Sans
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang='en' className={dmSans.variable}>
        <ConfettiProvider />
        <ToastProvider />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <body className={dmSans.className}>{children}</body>
        </ThemeProvider>
      </html>
    </ReduxProvider>
  );
}
