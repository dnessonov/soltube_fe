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
  FileUpload,
  SkeletonCircle,
  Skeleton,
  Icon, IconButton
} from "@chakra-ui/react";

import { useTheme } from "next-themes"
import * as React from 'react';

import TopStickyPanel from "@/components/my/topstickybar";

const MEDIA = '(prefers-color-scheme: dark)'

import {LuSearch, LuUpload} from "react-icons/lu";
import {BsUpload} from "react-icons/bs";
import {GrStorage} from "react-icons/gr";

import {useColorModeValue, ColorModeButton} from "../../components/ui/color-mode";
import {useEffect, useState} from "react";
import Undici from "undici-types";
import File = Undici.File;
import {FileAcceptDetails} from "@zag-js/file-upload";

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
  }

  // axios uploading
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = async () => {
    console.log("Upload triggered!", files);
  }

  const handleFileSelect = async (details: FileAcceptDetails) => {
    setFiles(details.files); console.log("files", details.files);
  }


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



          <Heading size="homePageSlogan">Publish Video <sup>On-Chain</sup></Heading>


          <Steps.Root
              defaultStep={0}
              count={2}
              /*orientation={{base: "vertical", md: 'horizontal'}}*/
              variant="solid"
          >
            <Steps.List>
              <Steps.Item key="one" index={0} title="Upload">
                <Steps.Indicator />
                <Box textAlign="left">
                  <Steps.Title>Upload</Steps.Title>
                  <Steps.Description> a video file</Steps.Description>
                </Box>
                <Steps.Separator />
              </Steps.Item>

              <Steps.Item key="two" index={1} title="2nd step">
                <Steps.Indicator />
                <Box textAlign="left">
                  <Steps.Title>Choose codec</Steps.Title>
                </Box>
                <Steps.Separator />
              </Steps.Item>
            </Steps.List>

            <Steps.Content key="one" index={0}>
              <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} onFileAccept={(details) => {handleFileSelect(details);} } >
                <FileUpload.HiddenInput />
                { files?.length === 0 ? (
                      <FileUpload.Dropzone>
                        <Icon size="md" color="fg.muted">
                          <LuUpload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                          <Box>Drag and drop files here</Box>
                          <Box color="fg.muted">.mp4, .mkv, .avi up to 50MB</Box>
                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                ) : (
                    <>
                      Yoyo
                    </>
                )}



                <FileUpload.ItemGroup>
                  <FileUpload.Context>
                    {({ acceptedFiles }) =>
                        acceptedFiles.map((file) => (
                            <FileUpload.Item key={file.name} file={file} alignItems="center" justifyContent="space-between" width="full" p="2">
                              <HStack gap="3">
                                <FileUpload.ItemPreview />
                                <VStack gap="0" align="flex-start">
                                  <FileUpload.ItemName />
                                  <FileUpload.ItemSizeText />
                                </VStack>
                              </HStack>
                              <FileUpload.ItemDeleteTrigger>
                                <LuX />
                              </FileUpload.ItemDeleteTrigger>
                            </FileUpload.Item>
                        ))
                    }
                  </FileUpload.Context>
                </FileUpload.ItemGroup>
              </FileUpload.Root>
            </Steps.Content>

            <Steps.Content key="two" index={1}>
              Step two content.
            </Steps.Content>

            <Steps.CompletedContent>
              This is complete!
            </Steps.CompletedContent>

            <ButtonGroup size="sm" variant="outline">
              <Steps.PrevTrigger asChild>
                <Button>Prev</Button>
              </Steps.PrevTrigger>
              <Steps.NextTrigger asChild>
                <Button>Next</Button>
              </Steps.NextTrigger>
            </ButtonGroup>
          </Steps.Root>


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
                    <Box><Button size={{base: "sm", md: "md", lg: "lg"}}>Upload Video <BsUpload /></Button></Box>
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
