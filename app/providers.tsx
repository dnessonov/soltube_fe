'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="data-theme" // Adds 'data-theme="dark"' to <html> instead of a class
            defaultTheme="system"
            enableSystem
        >
            {children}
        </NextThemesProvider>
    )
}