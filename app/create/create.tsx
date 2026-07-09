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

import Layout1 from '@/components/my/layout1';

import axios, {AxiosProgressEvent} from 'axios';
import * as React from 'react';

import {LuUpload} from "react-icons/lu";
import {useState} from "react";
import Undici from "undici-types";
import File = Undici.File;
import { useRouter } from 'next/navigation';

export default function Home() {

  // axios uploading
  const [files, setFiles] = useState<File[]>([]);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = async () => {
    console.log("Upload triggered!", files);
  }

  const nextRouter = useRouter();

  const handleFileSelect = async (acceptedFiles: File[]) => {

    setFiles(acceptedFiles);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    const controller = new AbortController();
    setUploadController(controller);

    setUploadProgress(0);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
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
          nextRouter.push(`/create/${not_processed_video_id}`);
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
      <Layout1>
          <Heading size="homePageSlogan">Publish Video <sup>On-Chain</sup></Heading>

          <VStack gap="4">
              <Box display="flex" flexDirection="column" mx="auto" gap="3">

                <FileUpload.Root
                    maxW="xl"
                    alignItems="stretch"
                    maxFiles={1}
                    onFileChange={(details) => {handleFileSelect(details.acceptedFiles);} }
                    accept={[".mp4", ".mkv", ".avi", ".mov", "video/*"]}
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
              <Box style={{fontSize: '13px'}}>
                By uploading you agree to Terms of Service.
              </Box>
          </VStack>

        </Layout1>
  );
}
