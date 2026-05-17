import type { Metadata } from 'next';

import './globals.css';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

import ReduxProvider from '@/redux/redux-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TokenValidator } from '@/components/auth/token-validator';

export const metadata: Metadata = {
  title: 'HeadStart Connect Admin',
  description: '',
  icons: {
    icon: '/icons/icon.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang='en' suppressHydrationWarning>
        <body>
          <ConfettiProvider />
          <ToastProvider />
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <TokenValidator />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ReduxProvider>
  );
}
