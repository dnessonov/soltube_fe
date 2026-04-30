import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import {useTheme} from "next-themes";
import {useColorModeValue} from "@/components/ui/color-mode";
import * as React from "react";

import {
  Button,
  Heading,
  Container,
  Box,
  Flex,
  Image as ChakraImage,
  Text,
  Input,
  InputGroup,
  HStack,
  Separator,
  VStack,
  SkeletonCircle,
  Skeleton
} from "@chakra-ui/react";

import TopStickyPanel from "@/components/my/topstickybar";

const MEDIA = '(prefers-color-scheme: dark)'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolTube - DeVi",
  description: "Watch videos decentralizedly",
  icons: [
    { rel: 'icon', url: '/icon.png', media: '(prefers-color-scheme: light)' }, // may use different icons depending on system theme
    { rel: 'icon', url: '/icon.png', media: '(prefers-color-scheme: dark)' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

function StandardLayoutWrapper({children}: Readonly<{children: React.ReactNode}>) {
  <Flex direction="column" minH="100vh" w="full">

  </Flex>
}
