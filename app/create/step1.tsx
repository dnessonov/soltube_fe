"use client"

import { useRouter } from 'next/navigation';
import Layout1 from '@/components/my/layout1';
import * as React from "react";
import {
    Heading,
    Fieldset,
    Field,
    Input,
    Textarea,
    NativeSelect,
    Stack, Button, Text,
    Box,
    HStack, Icon, RadioCard,
    ProgressCircle, Spinner,
    Alert,
    Image, Skeleton,
    Select, Portal, createListCollection,
    Collapsible
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip"
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import {LuArrowRight, LuScanEye} from "react-icons/lu";
import {useImperativeHandle, useState} from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as WsEvents from 'reconnecting-websocket/events';
import {VolumeX, VideoOff} from "lucide-react";
import {useWalletConnection} from "@solana/react-hooks";
import {getUtf8Encoder} from "@solana/codecs-strings";
import {address} from "@solana/addresses";
import { getProgramDerivedAddress } from '@solana/kit';
import * as borsh from "borsh";
import {solanaClient as client} from "@/components/ui/provider";
import {SystemProgram} from "@solana/web3.js";
import bs58 from 'bs58';
import {prev} from "@zag-js/utils";




dayjs.extend(duration);

interface MyWrapperProps {
    // children: React.ReactNode; // ReactNode is the standard type for anything React can render
    pathVideoId: string | undefined;
}


export default function Home({ pathVideoId } : MyWrapperProps) {

    const childOneUiRef = React.useRef<StepOneUiRefActions>(null);

    const [ws, setWs] = useState<ReconnectingWebSocket | null>(null);

    const [unProcessedVideoState, setUnProcessedVideoState] = useState<any>(undefined);

    const ws_env_url = process.env.NEXT_PUBLIC_WS_URL;

    const stateRef = React.useRef(unProcessedVideoState);
    const wsRef = React.useRef(ws);

    const sckOnMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            console.log ('reçu un message:', data);
            if(data?.event === "init") {
                delete data.event;
                setUnProcessedVideoState(data);
                console.log("updating to ", data);
            }else if(data?.event === "duration-updated"){
                const newState = {... stateRef.current, duration: data?.duration};
                setUnProcessedVideoState(newState);
            }else if(data?.event === "thumbnail-taken"){
                const newState = {... stateRef.current, thumbnail: data?.videoThumbResult?.path};
                setUnProcessedVideoState(newState);
            }else if(data?.event === "recommended-description"){
                console.log ('reçu un recommended-description message:', data, childOneUiRef.current);
                childOneUiRef.current?.pushRecommendedDescription(data?.value);
            }


        } catch (err) {
            console.error("Failed to parse WS message", err);
        }
    }

    const sckOnClose = (event: WsEvents.CloseEvent) => {
        if(stateRef.current === undefined){
            console.log('unProcessedVideoState CP1', stateRef.current);
            if(wsRef.current){
                console.log('do not reconnect ws', stateRef.current);
                wsRef.current.close();
                setWs(null);
                return;
            }else{
                console.log('wsRef CP3', wsRef.current, ws);
            }
            setUnProcessedVideoState(null);
        }else{
            console.log('unProcessedVideoState CP2', stateRef.current);
            // TODO: reconnect the socket
        }
        console.log('socket closed by server.');
    }

    React.useEffect(() => {
        stateRef.current = unProcessedVideoState;
    }, [unProcessedVideoState]);

    React.useEffect(() => {
        const socket = new ReconnectingWebSocket(`${ws_env_url}/${pathVideoId}`);

        socket.onopen = () => { console.log('socket opened.'); }
        socket.onmessage = sckOnMessage;
        socket.onclose = sckOnClose;
        wsRef.current = socket;
        setWs(socket);

        return () => {
            console.log('socket closed.');
            socket.close();
        }
    }, [pathVideoId, ws_env_url]);

    return (
        <Layout1>
            <Heading size="homePageSlogan">Publish Video <sup>On-Chain</sup></Heading>
            <Box justifyContent="center" alignItems="center" display="flex">
                { unProcessedVideoState === undefined ? (
                    <></>
                 ) : (
                    unProcessedVideoState === null ? (
                       <>404 Not found! yomama</>
                    ) : (
                        <StepOneUi ref={childOneUiRef} unProcessedVideoState={unProcessedVideoState} />
                    )
                )}
            </Box>
        </Layout1>
    )
}

interface StepOneUiRefActions {
    pushRecommendedTitle: ( recommendedTitle: string ) => void;
    pushRecommendedDescription: ( recommendedDescription: string ) => void;
}


const StepOneUi = React.forwardRef(StepOneUiComponent);
function StepOneUiComponent( props: any, ref: React.Ref<StepOneUiRefActions> ) {

    const resolutions = createListCollection({
        items: [
            { label: "360p", value: "react" },
            { label: "720p", value: "vue" },
            { label: "1080p", value: "angular" },
        ],
    });

    const audioVariants = createListCollection({
        items: [
            { label: "mono (44kHz)", value: "1" },
            { label: "stereo (44kHz)", value: "2" },
        ],
    });


    //
    // Create Video Account Smart Contract call
    //


    class InitializeNewVideoArgs {
        h : number;
        w : number;
        duration_seconds: number;
        filesize: number;
        bin_data_type: number;
        codec: number;
        metadata_type: number;
        title: string;
        youtube_id: string;
        key1: number;

        constructor(fields: any) {
            this.h = fields.h;
            this.w = fields.w;
            this.duration_seconds = fields.duration_seconds;
            this.filesize = fields.filesize;
            this.bin_data_type = fields.bin_data_type;
            this.codec = fields.codec;
            this.metadata_type = fields.metadata_type;
            this.title = fields.title;
            this.youtube_id = fields.youtube_id;
            this.key1 = fields.key1;
        }
    }

    const InstructionSchema2 = {
        struct: {
            h: 'u16',
            w: 'u16',
            duration_seconds: 'u16',
            filesize: 'u32',
            bin_data_type: 'u8',
            codec: 'u8',
            metadata_type: 'u8',
            title: 'string',
            youtube_id: 'string',
            key1: 'u8',
        }
    }

    function encodeNewVideoInstructionData(h :number, w :number, duration_seconds:number,filesize:number, bin_data_type :number, codec :number, metadata_type: number, title: string, youtube_id: string, key1 :number) {
        const variant = Buffer.from([0]); // enum variant index = 0
        const payload = borsh.serialize(
            InstructionSchema2,
            new InitializeNewVideoArgs({ h, w, duration_seconds, filesize, bin_data_type, codec, metadata_type, title, youtube_id, key1 })
        );
        console.log('new video instruction data', { h, w, duration_seconds, filesize, bin_data_type, codec, metadata_type, title, youtube_id, key1 });
        return Buffer.concat([variant, Buffer.from(payload)]);
    }



    const { connectors, connect, disconnect, wallet, status, currentConnector } = useWalletConnection();

    const onCreateVideoAccountClick = async () => {


        const _random_seedkey1_buffer = new Uint8Array(1);
        window.crypto.getRandomValues(_random_seedkey1_buffer);

        const _seed_codec : number = 0;
        const _seed_key1 : number = _random_seedkey1_buffer[0];
        const _seed_metadata_type : number = 0;

        const title = "some_G";

        let duration_seconds :number | undefined = props?.unProcessedVideoState?.duration;
        if(duration_seconds !== undefined) { duration_seconds = Math.floor(duration_seconds / 1000); }


        const data = encodeNewVideoInstructionData(600,800, // TODO: populate
            typeof duration_seconds === 'number' ? duration_seconds : 0,
            0, // may be updated later
            0,
            0,0,
            title,
            "", // youtube id (if applicable)
            _seed_key1);

        const _seed_codec_buf = Buffer.alloc(1);
        _seed_codec_buf.writeUInt8(_seed_codec);

        const _seed_metadata_type_buf = Buffer.alloc(1);
        _seed_metadata_type_buf.writeUInt8(_seed_metadata_type);

        const _seed_key1_buf = Buffer.alloc(1);
        _seed_key1_buf.writeUInt8(_seed_key1);


        const titleBytes = new TextEncoder().encode(title);
        const titleHash = await crypto.subtle.digest('SHA-256', titleBytes );
        const titleHashArray = new Uint8Array(titleHash);

        const _owner_addr_buf = bs58.decode(typeof wallet?.account.address !== 'undefined' ? wallet?.account.address : '' );  // feePayer.publicKey.toBytes();
        const seeds = [Buffer.from("video"), _owner_addr_buf, _seed_codec_buf, _seed_metadata_type_buf, titleHashArray, _seed_key1_buf ];

        const seeds_service_fee_wallet = [Buffer.from("service_fee_wallet")];

        if(typeof process.env.NEXT_PUBLIC_SOLANA_PROGRAM === 'string') {
            const [pda_account_address, bump] = await getProgramDerivedAddress({
                programAddress: address(process.env.NEXT_PUBLIC_SOLANA_PROGRAM),
                seeds: seeds
            });

            const [pda_service_fee_wallet_address, service_fee_wallet_bump] = await getProgramDerivedAddress({
                programAddress: address(process.env.NEXT_PUBLIC_SOLANA_PROGRAM),
                seeds: seeds_service_fee_wallet
            });

            console.log("PDA for Video is ", pda_account_address.toString(), bump.toString());

            const ixAccounts = [
                {address: wallet?.account.address, role: 0}, // owner
                {address: wallet?.account.address, role: 3}, // payer
                {address: pda_account_address, role: 1}, // video account
                {address: pda_service_fee_wallet_address, role: 1}, // global config (service fee wallet)
                {address: SystemProgram.programId.toString(), role: 0},
            ];

            console.log("ixAccounts:", ixAccounts);

            const ix = {
                data: data,
                programAddress: address(process.env.NEXT_PUBLIC_SOLANA_PROGRAM),
                accounts: ixAccounts,
                // feePayer: wallet?.account.address
            };

            const zeroPriorityFeeIx = {
                programAddress: 'ComputeBudget111111111111111111111111111111',
                accounts: [], // The compute budget program requires no accounts

                // THE MAGIC: Manually compile the byte discriminator and value.
                // Index 3 represents the "SetComputeUnitPrice" command discriminator.
                // The next 8 bytes represent your price value (0) as a 64-bit unsigned integer (u64).
                data: new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 0])
            };

            const preparedTransaction = await client.helpers.transaction.prepare({
                authority: wallet, // Uses the logged-in session wallet
                instructions: [
                    // instructions
                    // zeroPriorityFeeIx, // this in practice really adds some 3'ish to priority fee on top of what solflare adds by default
// @ts-ignore
                    ix
                ],
                feePayer: wallet?.account.address
            });


            let sentTransaction: any = undefined;
            try {
                sentTransaction = await client.helpers.transaction.send(preparedTransaction);
            } catch (error: any) {
                const errorCauseLowerCase = error?.cause.toString().toLowerCase();
                if (errorCauseLowerCase.includes("transaction cancelled")) {
                    console.log("cancelled (by user)");
                } else if (errorCauseLowerCase.includes("cancelled")) {
                    console.log("cancelled (popup closed)");
                } else {
                    console.log("other err happened", error, sentTransaction);

                    console.log("other err happened", error.cause);
                    console.log("other err happened", error.transactionPlanResult);
                }
            }

            console.log("signed transaction:", sentTransaction);
        }

        // console.log('create account clicked', ix);
    }

    const [videoTitleValue,setVideoTitleValue] = useState(props?.unProcessedVideoState?.proposed_title ? props?.unProcessedVideoState?.proposed_title : "");
    const [videoDescriptionValue,setVideoDescriptionValue] = useState(props?.unProcessedVideoState?.proposed_description ? props?.unProcessedVideoState?.proposed_description : "");

    useImperativeHandle(ref, () => ({

        pushRecommendedTitle( recommendedTitle: string ) {
            setVideoTitleValue( (prevTitle :string) => ( prevTitle.trim() === "" ? recommendedTitle : prevTitle ) );
        },

        pushRecommendedDescription(recommendedDescription: string ) {
            console.log("pushRecommendedDescription called!", recommendedDescription);
            setVideoDescriptionValue( (prevDescription :string) => ( prevDescription.trim() === "" ? recommendedDescription : null) )
        }
    }));

    return (
        <Fieldset.Root size="sm" maxW="md" style={{borderWidth: "1px", borderColor: "#cecece", borderRadius: "10px", padding: "43px"}}>

            <Stack style={{paddingBottom: "23px"}}>
                <Alert.Root status="info">
                    <Alert.Indicator />
                    <Alert.Title>Converting the Video file...</Alert.Title>
                    <Spinner size="sm" style={{opacity: 0.1}} />
                </Alert.Root>
                {/*<ProgressCircle.Root value={null} size="sm">
                            <ProgressCircle.Circle>
                                <ProgressCircle.Track />
                                <ProgressCircle.Range />
                            </ProgressCircle.Circle>
                        </ProgressCircle.Root>*/}

            </Stack>

            <Stack>
                <Fieldset.Content>
                    <HStack gap="2" alignItems="center">
                        {props?.unProcessedVideoState?.thumbnail ? (
                            <>
                                <Image src={`/video-thumb/${props?.unProcessedVideoState?.thumbnail}`} width="50%" objectFit="contain" />
                            </>
                        ) : (
                            <Skeleton width="50%" height="127px" borderRadius="6px" />
                        )}

                        <Fieldset.HelperText>
                            <HStack gap="1.5">
                                <Tooltip content="This video has no sound" showArrow positioning={{ placement: "top" }}>
                                    <Box display="inline-block" cursor="help">
                                        <Icon color="red.500" size="md"><VolumeX /></Icon>
                                    </Box>
                                </Tooltip>
                                <Tooltip content="Audio only" showArrow positioning={{ placement: "top" }}>
                                    <Box display="inline-block" cursor="help">
                                        <Icon color="red.500" size="md"><VideoOff /></Icon>
                                    </Box>
                                </Tooltip>
                            </HStack>
                            <Box>
                                <strong>Duration: </strong>
                                {props?.unProcessedVideoState?.duration === undefined ?
                                  <>
                                    N/A
                                  </>
                                : (() => {
                                    const totalSeconds = Number(props?.unProcessedVideoState?.duration) / 1000;
                                    const formatPattern = totalSeconds >= 3600 ? 'HH:mm:ss' : 'mm:ss';

                                    return dayjs.duration(props?.unProcessedVideoState?.duration / 1000, 'seconds').format(formatPattern);
                                })()}
                            </Box>
                        </Fieldset.HelperText></HStack>
                </Fieldset.Content>
            </Stack>

            <Stack>
                <Fieldset.Legend>Video details</Fieldset.Legend>
                <Fieldset.HelperText>
                    Please title your video and provide a short description.<br />
                    (This information will be used to index your video for search engines such as Google.)
                </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Field.Root required>
                    <Field.Label>Title <Field.RequiredIndicator /></Field.Label>
                    <Input name="title" value={videoTitleValue} onChange={(e) => setVideoTitleValue(e.target.value)} />
                </Field.Root>

                <Field.Root required>
                    <Field.Label>Description</Field.Label>
                    <Textarea name="description" value={videoDescriptionValue} onChange={(e) => setVideoDescriptionValue(e.target.value)} />
                    <Field.HelperText>Max 1500 characters.</Field.HelperText>
                </Field.Root>
            </Fieldset.Content>

            <Collapsible.Root>
                <Collapsible.Trigger display="inline-flex" background="transparent" border="none" padding="0" color="blue.500" _hover={{ textDecoration: "underline", color: "blue.600"}} cursor="pointer">Advanced Settings</Collapsible.Trigger>
                <Collapsible.Content>
                    <Stack style={{paddingTop: "18px"}}>
                        <Fieldset.Legend>Codec &amp; Technicals</Fieldset.Legend>
                        <Fieldset.HelperText>
                            You can leave the default settings or choose different ones to optimize the video for online streaming.
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root required>
                            <Field.Label>Resolution <Field.RequiredIndicator /></Field.Label>
                            <Select.Root collection={resolutions} size="sm" width="320px">
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select resolution" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {resolutions.items.map((res) => (
                                                <Select.Item item={res} key={res.value}>
                                                    {res.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Audio <Field.RequiredIndicator /></Field.Label>
                            <Select.Root collection={audioVariants} size="sm" width="320px">
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select resolution" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {audioVariants.items.map((audioVariant) => (
                                                <Select.Item item={audioVariant} key={audioVariant.value}>
                                                    {audioVariant.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Field.Root>
                    </Fieldset.Content>
                </Collapsible.Content>
            </Collapsible.Root>

            <Button type="submit" alignSelf="flex-center" onClick={onCreateVideoAccountClick}>Create Video Account</Button>
            <Fieldset.HelperText style={{paddingTop: '15px', color: '#888'}}>
                At the time your video account is created, you will be charged a small service fee of 0.005SOL to cover the computational resources used by SolTube to convert and process your video.
                Soon, you will be able to avoid this fee by using an advanced node client for SolTube or a CLI tool that performs conversion on your computer and is currently under active development. <a href="#">Learn more</a>.
            </Fieldset.HelperText>
        </Fieldset.Root>
    )
}