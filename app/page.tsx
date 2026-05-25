'use client'
import Image from "next/image";
import Link from 'next/link'
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
  Skeleton,
  Link as ChakraLink,
} from "@chakra-ui/react";

import { useTheme } from "next-themes"
import * as React from 'react';

const MEDIA = '(prefers-color-scheme: dark)'

import {LuSearch} from "react-icons/lu";
import {BsUpload} from "react-icons/bs";
import {GrStorage} from "react-icons/gr";

import {useColorModeValue, ColorModeButton} from "../components/ui/color-mode";
import {useEffect, useState} from "react";

export default function Home() {

  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const imageSrc = useColorModeValue("/logo_light1.svg","/logo_dark1.svg");
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

  if(mounted) {
    // console.log("page has mounted.");
    // imageSrc = useColorModeValue("/logo_light1.svg","/logo_dark1.svg");
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing
    console.log("Search triggered!");
  };

  return (
      <Flex direction="column" minH="100vh" w="full">

        <Box
            as="main"
            w="100%"
            py={4}
            px={6}
            textAlign="center"
            flex="1"
        >

          {mounted ?
              <ChakraImage src={imageSrc} height={{base: 100, sm: 125, md: 160, lg: 228}} layerStyle="topBarSty1" mx="auto" />
             : <Skeleton height={{base: 100, sm: 125, md: 160, lg: 228}} width={{base: 200, sm: 210, md: 230, lg: 396}} layerStyle="topBarSty1" mx="auto" /> }


          <Heading size="homePageSlogan">Play and Publish Videos in Decentralized Way</Heading>

          <VStack gap="4">
            <form onSubmit={handleSearch}>
              <Box display="flex" flexDirection="column" mx="auto" gap="3">

                <Box mx="auto" layerStyle="frontPageSearchBoxContainer">
                  <InputGroup flex="1" startElement={<LuSearch/>}>
                    <Input variant="outline" layerStyle="frontPageSearchBoxInput"
                           size={{base: "md", lg: "lg"}} autoFocus/>
                  </InputGroup>
                </Box>
                <Box mx="auto">
                  <Box display="flex" flexDirection={{ base: "column", sm: "row" }}  gap="3">
                    <Box><Button type="submit" size={{base: "sm", md: "md", lg: "lg"}} variant="surface">Search Videos</Button></Box>
                    <Box><Button
                        size={{base: "sm", md: "md", lg: "lg"}}
                        as="a" href="/create"
                        bg="var(--button-background-color)" color="var(--foreground)"

                        borderWidth="1px"

                        transitionProperty="all"
                        transitionDuration="normal"

                        _hover={{
                          // Change these to your desired hover colors
                          borderColor: "var(--button-hover-border-color)",
                          color: "var(--foreground)",
                          // bg: "var(--button-background-hover-color)", // If you have a hover variable

                          // If you want it to look like a standard Chakra button:
                          textDecoration: "none", // Removes default Link underline
                        }}

                        borderColor="var(--chakra-colors-border)"
                    >Publish Video <BsUpload /></Button> <a href="/create">Publish Video</a> </Box>
                  </Box>
                </Box>
              </Box>
            </form>

            <Box mx="auto"><Button variant="ghost" size={{base: "sm", md: "md", lg: "lg"}}>Provide Storage and Bandwidth and earn $ST tokens <GrStorage /></Button></Box>

          </VStack>

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
              <Text>© 2025 SolTube</Text>
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
