'use client'

import {useTheme} from "next-themes";
import {useColorModeValue} from "@/components/ui/color-mode";
import {useEffect, useState} from "react";
import * as React from "react";
import {
    Button,
    IconButton,
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
    Link as ChakraLink, ButtonGroup,
    Menu, Portal, Group
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from 'next/link'

import {
    useBalance,
    useWalletConnection,
} from "@solana/react-hooks";
import { solanaClient as client } from "@/components/ui/provider";

import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import {LuChevronDown} from "react-icons/lu";
import { address } from "@solana/addresses";
import { getUtf8Encoder } from '@solana/codecs-strings';
import axios, {AxiosProgressEvent} from "axios";

const MEDIA = '(prefers-color-scheme: dark)'

export default function TopStickyPanel(){
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

    return (
        <Box
              as="nav"
              pos="sticky"
              top="0"
              zIndex="sticky"
             // borderWidth="1px" borderColor="border.disabled"
             w="100%"
             // style={{paddingTop: "5px", paddingBottom: "5px"}}

             borderBottomWidth="1px"
             borderBottomColor={useColorModeValue("border.disabled","#343434")}
            // style={{backgroundColor: "#f00"}}
              backgroundGradient="to-b"
              backgroundImage="linear-gradient(to bottom, var(--background) 0%, color-mix(in srgb, var(--background), transparent 17%) 100%)"
             // bgImage="linear-gradient(to bottom, var(--background) 0%, color-mix(in srgb, var(--background), transparent 33%) 100%"
              // bgImage='linear-gradient(to bottom, "#ff0000" 0%, color-mix(in srgb, "#ff0000", transparent 33%) 100%'
        >
            <Flex w="full" justify="space-between">
                <Box textAlign="left" minW="0">
                    <Text as="div"><LeftPane /></Text>
                </Box>
                <Box textAlign="right" minW="0">
                    <Text as="div"><RightPane /></Text>
                </Box>
            </Flex>
        </Box>
    )
}

function LeftPane(){
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

    interface LeftPaneLinkProps {
        href: string;
        children: React.ReactNode;
        isActive?: boolean;
    }

    const LeftPaneLink = ({href, children, isActive} : LeftPaneLinkProps) => (
        <ChakraLink as={Link} href={href}
                    color={useColorModeValue("#575757","gray.400")}
                    style={{
                        fontWeight: 'normal',
                        fontFamily: 'Work Sans Medium',
                    }}
                    _hover={{
                        color: useColorModeValue("#1010bf","blue.400")
                    }}
                    fontSize={{'base': '15px', 'sm': '15px', 'md': '18px', 'lg': '19px', /*'topNavBreak': '55px',*/ 'xl': '21px', '2xl': '22px'} as any}

        >
            {children}
        </ChakraLink>
    );


    const fontSize = { base: "13px", sm: "12px", md: "16px", lg: "18px" };
    const boxLinkPaddingRight = {base: '3px', sm: 0, md: '5px', lg: '8px', xl: '12px', '2xl': '16px'};

    const menuItemDisplay = {base: 'none',topNavBreak: 'flex'};
    const menuHamburgerDisplay = {base: 'flex', topNavBreak: 'none'};

    const { connectors, connect, disconnect, wallet, status, currentConnector } =
        useWalletConnection();

    const testSignTransaction = async () => {
        console.log("Top Sticky Click. wallet is: ", wallet?.account.publicKey);

        //const pubKey1 = new PublicKey(wallet?.account.publicKey ? wallet?.account.publicKey : 0);
        //const programId = new PublicKey("FviQDovpzu6wRh9xeZESmVbMkNH6f6Tpn8QbAkLGw1um");



        const pubKey1 = new PublicKey("CCfU4Emc7kDt76XXHcs66CJxFuy8GQPQVC6pXyFAjnrm");
        const programId = new PublicKey("FviQDovpzu6wRh9xeZESmVbMkNH6f6Tpn8QbAkLGw1um");
        const data = Buffer.alloc(14,2);

        const keys = [
            {pubkey: pubKey1, isSigner: true, isWritable: false},
        ]
        // const ix = new TransactionInstruction({keys, programId , data});
        const ix = {
            data: getUtf8Encoder().encode("Hello, world"),
            programAddress: address("FviQDovpzu6wRh9xeZESmVbMkNH6f6Tpn8QbAkLGw1um"),
            feePayer: wallet?.account.address
        };

        console.log("ix", ix);

        const preparedTransaction = await client.helpers.transaction.prepare({
            authority: wallet, // Uses the logged-in session wallet
            instructions: [
                // Your array of target program instructions here
                ix
            ],
            feePayer: wallet?.account.address
        });

        console.log("ix2", preparedTransaction);

        // const signedTransaction = await client.helpers.transaction.sign(preparedTransaction);
        // console.log(signedTransaction);

        const rawWireBytes = await client.helpers.transaction.toWire(preparedTransaction);
        console.log("yomama1", preparedTransaction);

/*
        const base64TransactionString = btoa(
            String.fromCharCode(... new Uint8Array(rawWireBytes))
        );
*/
        const base64TransactionString = rawWireBytes;

        const controller = new AbortController();

        const formData = new FormData();
        formData.append('signedTransaction', base64TransactionString);

        axios.post('http://localhost:3000/signin', formData, {
            signal: controller.signal,
            onUploadProgress: (progress: AxiosProgressEvent) => {
                console.log("Signin request progress ", progress);
            }
        }).then(response => {})


    }


    return (
        <HStack
            fontSize={fontSize}
            paddingTop={{base: "0px", sm: "2px", md: "3px", lg: "5px", xl: "7px", '2xl': "25px"}}
            paddingBottom={{base: "0px", sm: "2px", md: "3px", lg: "5px", xl: "7px", '2xl': "29px"}}
        >
            <Box
                paddingLeft={{base: "2px", sm: "0px", md: 15, lg: 30, xl: "32px", '2xl': 55}}
                paddingRight={{base: "15px", sm: "9px", md: "25px", lg: "30px", xl: "45px", '2xl': "55px"}}
            >
            {mounted ?
                <ChakraImage src={imageSrc} height={{base: 50, sm: 57, md: 67, lg: 77, xl: 77, '2xl': 77}} layerStyle="topBarSty1" mx="auto" />
                : <Skeleton height={{base: 50, sm: 57, md: 67, lg: 77, xl: 77, '2xl': 77}} width={{base: 100, sm: 114, md: 134, lg: 154}} layerStyle="topBarSty1" mx="auto" /> }
            </Box>
            <Box paddingRight={boxLinkPaddingRight} display={menuItemDisplay}>
                <LeftPaneLink href="#">Videos</LeftPaneLink>
            </Box>
            <Box paddingRight={boxLinkPaddingRight} display={menuItemDisplay}>
                <LeftPaneLink href="#">Music</LeftPaneLink>
            </Box>
            <Box paddingRight={boxLinkPaddingRight} display={menuItemDisplay}>
                <LeftPaneLink href="#">PodCasts</LeftPaneLink>
            </Box>
            <Box paddingRight={boxLinkPaddingRight} display={menuItemDisplay}>
                <Button onClick={() => {testSignTransaction();}}>Sign transaction</Button>
            </Box>
            <Box display={menuItemDisplay}>
                <LeftPaneLink href="#">Dev Resources</LeftPaneLink>
            </Box>
            <Box display={menuHamburgerDisplay}>
                <IconButton aria-label="Menu" variant="surface" size="sm">
                    <HamburgerIcon />
                </IconButton>
            </Box>


        </HStack>
    )
}

function RightPane(){
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

    const { connectors, connect, disconnect, wallet, status, currentConnector } =
        useWalletConnection();
    const address = wallet?.account.address;
    const balance = useBalance(address);

    const htmlItemTextStyleColor = useColorModeValue("#010101","#f0f0f0");

    const htmlMenuButtonBorderColor = useColorModeValue("#679487","#565656");
    const htmlMenuButtonTextColor = useColorModeValue("#434343","#ababab");

    const htmlMenuContentBg = useColorModeValue("#fdfdfd","#212121");
    const htmlMenuContentBgHover = useColorModeValue("#f2f2f2","#2e2e2e");

    const ConnectorsHtmlItems = connectors.map((c) => (
        <Menu.Item key="connector" value={c.id} onSelect={() => connect(c.id)}
                   cursor="pointer"
                   bg={htmlMenuContentBg}
                   _hover={{bg: htmlMenuContentBgHover}}
        >
            <ChakraImage src={c?.icon} height="22px" />
            <Text
                // color={useColorModeValue("#010101","#f0f0ff")}
                style={{ 'color': htmlItemTextStyleColor }}

            >{c.name}</Text></Menu.Item>
    ));

    return (
        <Box paddingTop={{"base": "4px", "sm": "8px", "md": "10px", "lg": "19px", "xl": "20px", "2xl": "27px"}}
             paddingRight={{"base": "5px", sm:"10px", "md": "19px", "lg": "26px"}}
             >
            {status == 'connected' ?
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                    <Group attached>
                        <Menu.Trigger asChild>
                            <Button
                                size={{base: "xs", lg: "md"}}
                                variant="outline"
                                style={{color: htmlMenuButtonTextColor}}
                                borderColor={htmlMenuButtonBorderColor}
                                borderRadius={{base: "24px", md: "30px"}}
                                maxW="210px"
                            >
                                <ChakraImage src={currentConnector?.icon} height="27px" borderRadius="full" />
                                <Text truncate>{wallet?.account.address}</Text><Text style={{marginLeft: "-12px"}}>{wallet?.account.address.slice(-4)}</Text> <LuChevronDown />
                            </Button>
                        </Menu.Trigger>
                    </Group>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content zIndex="popover"
                                          bg={htmlMenuContentBg}
                                          color="fg"
                                          boxShadow="md"
                                          borderWidth="1px"
                            >
                                <Menu.ItemGroup>
                                    <Menu.Item
                                        key="my_videos" value="my_videos"
                                        bg={htmlMenuContentBg}
                                        // onSelect={disconnect}
                                        cursor="pointer"
                                        _hover={{bg: htmlMenuContentBgHover}}
                                    ><Text style={{ 'color': htmlItemTextStyleColor }}>My Videos</Text></Menu.Item>
                                    <Menu.Item
                                        key="my_channel" value="my_channel"
                                        bg={htmlMenuContentBg}
                                        // onSelect={disconnect}
                                        cursor="pointer"
                                        _hover={{bg: htmlMenuContentBgHover}}
                                    ><Text style={{ 'color': htmlItemTextStyleColor }}>My Channel</Text></Menu.Item>
                                </Menu.ItemGroup>
                                <Menu.Separator />
                                <Menu.ItemGroup>
                                    <Menu.Item
                                        key="disconnect" value="disconnect"
                                        bg={htmlMenuContentBg}
                                        onSelect={disconnect}
                                        cursor="pointer"
                                        _hover={{bg: htmlMenuContentBgHover}}
                                    ><Text style={{ 'color': htmlItemTextStyleColor }}>Disconnect</Text></Menu.Item>
                                </Menu.ItemGroup>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
                :
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                    <Group attached>
                        <Menu.Trigger asChild>
                            <Button
                                size={{base: "xs", lg: "md"}}
                                variant="outline"
                                style={{color: "#40af40"}}
                                borderColor={htmlMenuButtonBorderColor}
                                borderRadius={{base: "24px", md: "30px"}}
                            >Connect <LuChevronDown /></Button>
                        </Menu.Trigger>
                    </Group>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content zIndex="popover"
                                          bg={htmlMenuContentBg}
                                          color="fg"
                                          boxShadow="md"
                                          borderWidth="1px"
                            >
                                {ConnectorsHtmlItems}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            }
        </Box>
    )
}


export function TopStickyPanelOld(){
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
    return (
        <Box as="nav" pos="sticky" top="0" zIndex="sticky" borderWidth="1px" borderColor="border.disabled" w="100%" style={{paddingTop: "5px", paddingBottom: "5px"}}>
            <Box>
                <HStack>
                    {mounted ?
                        <ChakraImage src={imageSrc} height={{base: 50, sm: 57, md: 67, lg: 77, xl: 77, '2xl': 77}} layerStyle="topBarSty1" mx="auto" />
                        : <Skeleton height={{base: 50, sm: 57, md: 67, lg: 77, xl: 77, '2xl': 77}} width={{base: 100, sm: 114, md: 134, lg: 154}} layerStyle="topBarSty1" mx="auto" /> }

                </HStack>

            </Box>

            <Box>
                right sticky
            </Box>
        </Box>
    )
}
