'use client'
import Image from "next/image";
import Link from 'next/link'
import { LuX } from "react-icons/lu"
import {
    Button,
    Steps,
    ButtonGroup,
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
} from "@chakra-ui/react";

import { useTheme } from "next-themes"
import * as React from 'react';

import TopStickyPanel from "@/components/my/topstickybar";

const MEDIA = '(prefers-color-scheme: dark)'

import {useColorModeValue, ColorModeButton} from "../../components/ui/color-mode";
import {useEffect, useState} from "react";

// 1. Define an interface for your component's props
interface MyWrapperProps {
    children: React.ReactNode; // ReactNode is the standard type for anything React can render
}

export default function Layout1({ children }: MyWrapperProps) {

    const { resolvedTheme, setTheme, forcedTheme } = useTheme();
    const [mounted,setMounted] = useState(false);

    const handleMediaQuery = React.useCallback(
        (e: MediaQueryListEvent | MediaQueryList) => {
            const resolved = getSystemTheme(e)
            setTheme(resolved)
        },
        [resolvedTheme, forcedTheme]
    )

    const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
        if (!e) e = window.matchMedia(MEDIA)
        const isDark = e.matches
        const systemTheme = isDark ? 'dark' : 'light'
        return systemTheme
    }

    useEffect(() => {
        setMounted(true);

        const e = window.matchMedia(MEDIA)
        const isDark = e.matches
        const systemTheme = isDark ? 'dark' : 'light'

        setTheme(systemTheme)


        e.addListener(handleMediaQuery)
        handleMediaQuery(e)

        return () => e.removeListener(handleMediaQuery)
    }, [mounted]);


    return (
        <Flex direction="column" minH="100vh" w="full">
            {/* Header */}

            <TopStickyPanel />

            <Box
                as="main"
                w="100%"
                py={4}
                px={6}
                textAlign="center"
                flex="1"
            >
                {children}
            </Box>

            <Box as="footer" p="4" layerStyle="footerBarBox1">
                <Container maxW="container.xl">

                    <HStack
                        gap="4"             // Spacing between links and separators
                        px="6"              // Horizontal padding for the entire group
                        separator={<Separator orientation="vertical" height="4" colorPalette="cyan" color="#ff0000" />}
                        justify="center"
                        wrap="wrap"
                    >
                        <Text>© 2026 SolTube</Text>
                        {mounted ? <ColorModeButton /> : <>...</> }
                        <Link href="#">About</Link>
                        <Link href="#">Terms</Link>
                        <Link href="#">Tokenomics</Link>
                        <Link href="#">Contact</Link>

                    </HStack>

                </Container>
            </Box>
        </Flex>
    );
}
