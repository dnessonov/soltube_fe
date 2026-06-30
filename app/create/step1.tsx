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
    Alert
} from "@chakra-ui/react";
import {LuArrowRight, LuScanEye} from "react-icons/lu";
import {useState} from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as WsEvents from 'reconnecting-websocket/events';


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
                if(stateRef.current === undefined){
                    setUnProcessedVideoState(data);
                }
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
                        <StepOneUi />
                    )
                )}
            </Box>
        </Layout1>
    )
}

function StepOneUi() {
    return (
        <Fieldset.Root size="2xl" maxW="md" style={{borderWidth: "1px", borderColor: "#cecece", borderRadius: "10px", padding: "43px"}}>

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

                <Field.Root style={{paddingTop: "23px"}} required>
                    <RadioCard.Root defaultValue="public">
                        <RadioCard.Label>Visibility &amp; permissions</RadioCard.Label>
                        <HStack align="stretch">
                            <RadioCard.Item key="public" value="public">
                                <RadioCard.ItemHiddenInput />
                                <RadioCard.ItemControl>
                                    <RadioCard.ItemContent>
                                        <Icon size="xl" color="fg.muted" mb="2">
                                            <LuArrowRight />
                                        </Icon>
                                        <RadioCard.ItemText>Public</RadioCard.ItemText>
                                        <RadioCard.ItemDescription>Video will be available to all by link</RadioCard.ItemDescription>
                                    </RadioCard.ItemContent>
                                    <RadioCard.ItemIndicator />
                                </RadioCard.ItemControl>
                            </RadioCard.Item>
                            <RadioCard.Item key="private" value="private">
                                <RadioCard.ItemHiddenInput />
                                <RadioCard.ItemControl>
                                    <RadioCard.ItemContent>
                                        <Icon size="xl" color="fg.muted" mb="2">
                                            <LuScanEye />
                                        </Icon>
                                        <RadioCard.ItemText>Private</RadioCard.ItemText>
                                        <RadioCard.ItemDescription>Video will be available to specific Solana addresses only</RadioCard.ItemDescription>
                                    </RadioCard.ItemContent>
                                    <RadioCard.ItemIndicator />
                                </RadioCard.ItemControl>
                            </RadioCard.Item>
                        </HStack>
                    </RadioCard.Root>
                </Field.Root>

            </Fieldset.Content>


            <Button type="submit" alignSelf="flex-start">Submit</Button>

        </Fieldset.Root>
    )
}