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
  useFileUploadContext,
  useFileUpload,
  SkeletonCircle,
  Skeleton,
  Icon, IconButton,
  Progress
} from "@chakra-ui/react";

import axios, {AxiosProgressEvent} from 'axios';


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
import { useNavigate } from 'react-router-dom';

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
  const [uploadController, setUploadController] = useState<AbortController | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = async () => {
    console.log("Upload triggered!", files);
  }

  const navigate = useNavigate();


  const handleFileSelect = async (acceptedFiles: File[]) => {

    setFiles(acceptedFiles);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    const controller = new AbortController();
    setUploadController(controller);

    setUploadProgress(0);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        signal: controller.signal,
        headers: {
          'Authorization': 'Bearer AuthToken_prrremium_can_upload' // TODO: replace with signed string from
        },
        onUploadProgress: (progress: AxiosProgressEvent) => {
          // console.log("Upload progress ", progress);
          if(progress.progress !== undefined) {
            let intTo100Progress = Number((progress.progress * 100).toFixed(0));
            intTo100Progress = (intTo100Progress > 100) ? 100 : intTo100Progress;
            setUploadProgress(intTo100Progress);
          }
        }
      }).then((axiosResponse) => {
        if(axiosResponse.data.status === "success"){
          const not_processed_video_id = axiosResponse.data.not_processed_video;
          navigate(`/create/${not_processed_video_id}`);
        }
        console.log('axiosResponse:', axiosResponse);
      });
    } catch (error) {
      if(axios.isCancel(error)){
        console.log("Upload was successfully canceled by the user.");
        setUploadProgress(0);
      }else{
        console.error("Upload failed due to a network/server error:", error);
      }
    } finally {
      setUploadController(null);
      console.log("Upload was successfully completed.");
    }
  }

  const fileUpload = useFileUpload()

  const handleClearSelectedFile = () => {
    console.log("clear files clicked.");
    if(uploadController){
      uploadController.abort();
      setUploadController(null);
    }
    fileUpload.clearFiles();
    setFiles([]);
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


          <VStack gap="4">
              <Box display="flex" flexDirection="column" mx="auto" gap="3">

                <FileUpload.Root
                    maxW="xl"
                    alignItems="stretch"
                    maxFiles={1}
                    onFileChange={(details) => {handleFileSelect(details.acceptedFiles);} }
                    accept={[".mp4", ".mkv", ".avi", ".mov", "video/*"]}
                    value={fileUpload}
                >
                  <FileUpload.HiddenInput />
                  { files?.length === 0 ? (
                      <FileUpload.Dropzone>
                        <Icon size="md" color="fg.muted">
                          <LuUpload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                          <Box style={{paddingLeft: "48px", paddingRight: "48px"}}>Drag and drop video file here you would like to publish onchain.</Box>
                          <Box color="fg.muted">.mp4, .mkv, .avi up to 50MB*</Box>

                          <Box style={{paddingTop: "15px"}}>
                            <FileUpload.Trigger asChild>
                              <Button>Click to select file</Button>
                            </FileUpload.Trigger>
                          </Box>

                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                  ) : (
                      <FileUpload.ItemGroup>
                        <FileUpload.Context>
                          {({ acceptedFiles }) =>
                              acceptedFiles.map((file) => (
                                  <FileUpload.Item key={file.name} file={file} alignItems="center" justifyContent="space-between" width="full" p="2">

                                    <VStack gap="0" align="flex-start">
                                      <HStack gap="3" width="full">
                                        <FileUpload.ItemPreview />
                                        <VStack gap="0" align="flex-start">
                                          <FileUpload.ItemName />
                                          <FileUpload.ItemSizeText />
                                        </VStack>


                                      </HStack>

                                      <HStack gap="3" align="flex-start" width="full" style={{paddingLeft: "9px", paddingRight: "9px"}}>
                                        <Progress.Root colorPalette="cyan" size="lg" value={uploadProgress} width="full">
                                          <Progress.Label mb="2">
                                            Uploading
                                          </Progress.Label>
                                          <Progress.Track>
                                            <Progress.Range />
                                          </Progress.Track>
                                        </Progress.Root>
                                      </HStack>

                                      <HStack gap="3" width="full" align="center" justify="center" style={{paddingTop: "23px"}}>
                                        <Button onClick={() => {handleClearSelectedFile();}} size="sm">Cancel</Button>
                                      </HStack>

                                    </VStack>

                                  </FileUpload.Item>
                              ))
                          }
                        </FileUpload.Context>
                      </FileUpload.ItemGroup>
                  )}
                </FileUpload.Root>

              </Box>
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
