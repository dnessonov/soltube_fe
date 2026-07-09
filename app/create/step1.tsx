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
import {useState} from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as WsEvents from 'reconnecting-websocket/events';
import {VolumeX, VideoOff} from "lucide-react";


dayjs.extend(duration);

interface MyWrapperProps {
    // children: React.ReactNode; // ReactNode is the standard type for anything React can render
    pathVideoId: string | undefined;
}


export default function Home({ pathVideoId } : MyWrapperProps) {

    const [ws, setWs] = useState<ReconnectingWebSocket | null>(null);

    const [unProcessedVideoState, setUnProcessedVideoState] = useState<any>(undefined);

    const ws_env_url = process.env.NEXT_PUBLIC_WS_URL;

    const stateRef = React.useRef(unProcessedVideoState);
    const wsRef = React.useRef(ws);

    const sckOnMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            console.log ('reçu un message:', data);
            if(data.duration !== undefined){
                //if(stateRef.current === undefined){
                setUnProcessedVideoState(data);
                console.log("updating to ", data);
                //}
            }else if(data?.event === "thumbnail-taken"){
                const newState = {... stateRef.current, thumbnail: data?.videoThumbResult?.path};
                setUnProcessedVideoState(newState);
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
    }, [pathVideoId, ws_env_url])

    return (
        <Layout1>
            <Heading size="homePageSlogan">Publish Video <sup>On-Chain</sup></Heading>
            <Box justifyContent="center" alignItems="center" display="flex">
                { unProcessedVideoState === undefined ? (
                    <></>
                 ) : (
                    unProcessedVideoState === null ? (
                       <>404 yomama</>
                    ) : (
                        <StepOneUi unProcessedVideoState={unProcessedVideoState} />
                    )
                )}
            </Box>
        </Layout1>
    )
}

function StepOneUi( props: any ) {

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
    })


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
                    (This information will be saved on-chain.)
                </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Field.Root required>
                    <Field.Label>Title <Field.RequiredIndicator /></Field.Label>
                    <Input name="title" />
                </Field.Root>

                <Field.Root required>
                    <Field.Label>Description <Field.RequiredIndicator /></Field.Label>
                    <Textarea name="description" />
                    <Field.HelperText>Max 300 characters.</Field.HelperText>
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

            <Button type="submit" alignSelf="flex-center">Create Video Account</Button>
        </Fieldset.Root>
    )
}