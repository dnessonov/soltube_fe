"use client"

import Layout1 from "@/components/my/layout1";
import { Button, Icon, Box, HStack } from "@chakra-ui/react"
import {JSX} from "react";
import * as borsh from "borsh";

import {Copy, Check} from "lucide-react"
import * as React from "react";
import Hls from 'hls.js';

import {solanaClient, solanaClient as client} from "@/components/ui/provider";

interface WatchVideoPageProps {
    // children: React.ReactNode; // ReactNode is the standard type for anything React can render
    address: string | undefined;
}

/*
const videoAccountLayout = borsh.struct([
    borsh.u8('bump'),
    borsh.u64('config_var1'),
    borsh.u64('config_var2'),
    borsh.publicKey('payer'), // Maps the 32-byte public key
]);
*/

export default function WatchVideoPage({address}: WatchVideoPageProps): JSX.Element {

    React.useEffect(() => {

        if(address !== undefined) {
            console.log("x1", solanaClient.config.rpcClient)
// @ts-ignore
            const x = solanaClient.runtime.rpc.getAccountInfo(address, {encoding: "base64"}).send();

            console.log("x", x);
        }

    }, [address]);

    return (
        <Layout1>
            <Box>{address}
                <Icon size="sm">
                    {/*<Check color="#38A169" />*/}
                    <Copy />
                </Icon>
            </Box>


            <Box>
                <VideoPlayer2 src="http://localhost:3001/data/temp/output5.mp4" mimeCodec="avc1.64001E,mp4a.40.2" duration={147.5} fileSize={4323810}></VideoPlayer2>
            </Box>

        </Layout1>
    );
}

interface VideoPlayerProps {
    src: string; // Your .m3u8 stream URL
    duration: number;
    fileSize: number;
    mimeCodec: string;
}

export const VideoPlayer2: React.FC<VideoPlayerProps> = ({ src, duration, fileSize, mimeCodec }) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const mediaSourceRef = React.useRef<MediaSource | null>(null);
    const sourceBufferRef = React.useRef<SourceBuffer | null>(null);

    const sourceBufferMoofsRef = React.useRef<number[][] | null>([[0,1333],[40,647958],[63,959320],[92,1407296],[132,1975391],[156,2263568],[185,2724990],[225,3262232],[258,3735382],[287,4157310]]);
    const currentlyDownloadingMoofIndex = React.useRef<number | null | undefined>(undefined);
    const nextDownloadingMoofIndex = React.useRef<number | null>(null);
    const currentPositionTimeUnitsBeforeWorryAboutNextInterval = React.useRef<number | null | undefined>(undefined);
    const currentPositionTimeUnits = React.useRef<number | null>(null);
    const addedMoofs = React.useRef<Set<number>>(new Set());


    const currentByteRef = React.useRef<number>(0);
    const isAppendingRef = React.useRef<boolean>(false);
    const isSeekingRef = React.useRef<boolean>(false);

    const CHUNK_SIZE = 812 * 1024; // 1 MB chunks

    React.useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const mediaSource = new MediaSource();
        mediaSourceRef.current = mediaSource;
        videoElement.src = URL.createObjectURL(mediaSource);

        console.log("w1",mediaSource.readyState);

        const onSourceOpen = () => {
             console.log('The mediaSource is open and ready to receive a sourceBuffer');
             // The mediaSource is open and ready to receive a sourceBuffer

             const mimeCodecStr = `video/mp4; codecs="${mimeCodec}"`;

             if (!MediaSource.isTypeSupported(mimeCodecStr)) {
                 console.error("The specified codec string is not supported by this browser.");
                 return;
             }

            currentPositionTimeUnitsBeforeWorryAboutNextInterval.current = 16; // 3 seconds before next fragment will start loading

             mediaSource.duration = duration === undefined ? 0 : duration; // seconds

             const bufferVideo = mediaSource.addSourceBuffer(mimeCodecStr);
             sourceBufferRef.current = bufferVideo;
             // bufferVideo.appendBuffer(buf);

             bufferVideo.addEventListener('updateend', () => {
                 console.log("updateend CB CP initial");
                 isAppendingRef.current = false;
                 if (isSeekingRef.current) {
                     isSeekingRef.current = false;
                     return;
                 }
                 if(nextDownloadingMoofIndex.current !== null){
                     fetchNextSequentialChunk(nextDownloadingMoofIndex.current);
                 }

                 // fetchNextSequentialChunk();

                 /*if(!bufferVideo.updating && mediaSource.readyState === "open") {
                     mediaSource.endOfStream();

                     videoElement.currentTime = 0;
                 }*/
             });
             currentPositionTimeUnits.current = 0;
             addedMoofs.current.clear();
             fetchNextSequentialChunk(null);
        };

        mediaSource.addEventListener('sourceopen', onSourceOpen);

        return () => {
            mediaSource.removeEventListener('sourceopen', onSourceOpen);
            if(mediaSource.readyState === 'open'){
                mediaSource.endOfStream();
            }
        }
    }, [src,duration,fileSize,mimeCodec]);


    const fetchNextSequentialChunk = async (moofIndex :number | null) => {
        console.log("moofIndex passed: (CP1)", moofIndex);
        if(!sourceBufferRef.current || !mediaSourceRef.current) return;

        if(isAppendingRef.current) {
            if((moofIndex !== null) && (sourceBufferMoofsRef.current?.[moofIndex] !== undefined)){
                nextDownloadingMoofIndex.current = moofIndex;
            }
            return;
        }

        nextDownloadingMoofIndex.current = null;

        let start, end :number | undefined | null;

        console.log("moofIndex passed: (CP2)", moofIndex);

        let _moofIndexTo :number;
        if(moofIndex === null) {
            start = 0;
            currentlyDownloadingMoofIndex.current = 0;
            _moofIndexTo = 1;
        }else{
            console.log("moofIndex passed(CP3):", moofIndex);
            while(addedMoofs.current.has(moofIndex)){
                console.log("moofIndex passed(CP4):", moofIndex);
                moofIndex++;
                if((typeof currentPositionTimeUnitsBeforeWorryAboutNextInterval.current === 'number') && (typeof sourceBufferMoofsRef.current?.[moofIndex][0] === 'number') && (sourceBufferMoofsRef.current?.[moofIndex][0] <= ((currentPositionTimeUnits.current ?? 0) + currentPositionTimeUnitsBeforeWorryAboutNextInterval.current))){
                    console.log("moofIndex passed(CP4.1):", moofIndex);
                }else{
                    //isAppendingRef.current = false;
                    console.log("moofIndex passed(CP4.2):", moofIndex);
                    return;
                }
                if(moofIndex > ((sourceBufferMoofsRef.current?.length ?? 0) - 1)){
                    console.log("moofIndex passed(CP4.3):", moofIndex);
                    //isAppendingRef.current = false;
                    return; // data is already downloaded
                }
            }
            start = sourceBufferMoofsRef.current?.[moofIndex][1];
            _moofIndexTo = moofIndex + 1;
        }

        isAppendingRef.current = true;
        while(true) {
            console.log("moofIndex passed(CP5.1):", moofIndex, _moofIndexTo);
            end = (sourceBufferMoofsRef.current?.[_moofIndexTo][1] ?? 1) - 1;
            if(end === undefined){
                if(start === 0) { start = null; }
                end = null; // query whole file without http bytes ranges header
                break;
            }else{
                if((sourceBufferMoofsRef.current?.[_moofIndexTo][0] !== undefined) && (typeof currentPositionTimeUnitsBeforeWorryAboutNextInterval.current === 'number') && (sourceBufferMoofsRef.current?.[_moofIndexTo][0] <= ((currentPositionTimeUnits.current ?? 0) + currentPositionTimeUnitsBeforeWorryAboutNextInterval.current)) && (!addedMoofs.current.has(_moofIndexTo))){
                    _moofIndexTo++;
                }else{
                    break;
                }
            }
        }


        console.log("fetchNextSequentialChunk start,end bytes ranges", start, end);

        console.log("fetchNextSequentialChunk CP1");


        try {
            const use_bytes_header :boolean = ((start !== null) && (start !== undefined)) || (end !== null && end !== undefined);
            const endHttpHeaderStr = (end !== null && end !== undefined) ? `${end}` : "";
            const response = await fetch(src, { headers: use_bytes_header ? { 'Range': `bytes=${start}-${endHttpHeaderStr}` } : {} });
            if ((response.status !== 206) && use_bytes_header) throw new Error("Server must support HTTP 206 Range requests");

            const buffer = await response.arrayBuffer();

            // console.log("for loop:", moofIndex ?? 0, _moofIndexTo);
            for(let _i = moofIndex ?? 0; _i < (_moofIndexTo ?? ((sourceBufferMoofsRef.current?.length ?? 1) - 1) ) ; _i++){
                console.log("addedMoofs push", _i);
                if(!addedMoofs.current.has(_i)){addedMoofs.current.add(_i);}
            }
            //currentByteRef.current += buffer.byteLength;

            sourceBufferRef.current.appendBuffer(buffer);
            console.log("fetchNextSequentialChunk appendBuffer called ", /*currentByteRef.current,*/ buffer.byteLength);
        } catch (err) {
            console.error("Chunk retrieval failed:", err);
            isAppendingRef.current = false;
        }
    }

    const handleSeek = async () => {
        const video = videoRef.current;

        const sb = sourceBufferRef.current;
        if (!video || !sb || sb.updating) return;

        isSeekingRef.current = true;

        //const tmp_time_marks = [[0,1334],[7,180459],[18,376553],[38,755594],[50,961489],[63,1152048],[83,1534823],[92,1714581],[108,1947269],[128,2325342],[136,2481406],[156,2734754],[176,3133210],[185,3316144],[203,3557945],[223,3921481],[234,4113065],[239,4189780],[258,4533861],[268,4674451],[276,4820795],[287,5031265]];
        //const tmp_time_marks = [[0,1333],[7,148844],[18,314430],[38,623987],[50,792268],[63,958259],[83,1271204],[92,1417127],[108,1615528],[128,1922642],[136,2049701],[156,2272924],[176,2597101],[185,2744674],[203,2956899],[223,3254378],[234,3411466],[239,3477385],[258,3757339],[268,3880844],[276,4002156],[287,4179644]];
        // const tmp_time_marks = [[0,1333],[40,647958],[63,959320],[92,1407296],[132,1975391],[156,2263568],[185,2724990],[225,3262232],[258,3735382],[287,4157310]];

        // Linear ratio math formula: (T_seek / T_total) * Size_total
        // console.log('seeking at ',video.currentTime);

        const time_marks_units_time = Math.floor(video.currentTime * 2);
        currentPositionTimeUnits.current = time_marks_units_time;
        let safeSeekByte :number | undefined = undefined;
        let safeSeekMoofIndex :number | null = null;
        sourceBufferMoofsRef.current?.forEach( (val, val_index, val1) => {
            if((safeSeekByte === undefined) && (val[0] > time_marks_units_time) && (val_index > 0)){
                safeSeekByte = val1[val_index-1][1];
                safeSeekMoofIndex = val_index-1;
            }
        });
        if(safeSeekByte === undefined){
            safeSeekMoofIndex = (sourceBufferMoofsRef.current?.length ?? 0) -1;
            safeSeekByte = (sourceBufferMoofsRef?.current?.[safeSeekMoofIndex]?.[1] ?? 0);
        }

        console.log(`seeking at ${video.currentTime} (in units ${time_marks_units_time}) safeSeekByte is ${safeSeekByte}`);

        // Keyframe cluster alignment correction (Grounding step to closest chunk boundary)
        // const safeSeekByte = Math.floor(targetByteEstimate / CHUNK_SIZE) * CHUNK_SIZE;

        console.log('onSeeking CP1: ', video?.currentTime, safeSeekByte, mediaSourceRef.current?.readyState);

        // Direct byte pointer redirection bypasses linear queueing sequence
        currentByteRef.current = safeSeekByte;

        if(mediaSourceRef.current?.readyState === 'ended'){

        }else{
            // Clear out browser multimedia engine buffers entirely
            console.log("SourceBuffer to Abort CP0");
            sb.abort();
            console.log("SourceBuffer Aborted CP1");
            if (sb.buffered.length > 0) {
                console.log("SourceBuffer to remove 0, ", duration);
                // sb.remove(0, duration);
                console.log("SourceBuffer removed 0, ", duration);
            }

            //return;

            console.log("Proceeding to hopefully fetching data at the seek position: ", safeSeekByte, mediaSourceRef.current?.readyState);
            await fetchNextSequentialChunk(safeSeekMoofIndex);
            return;

            // Wait until buffer clearing ends before requesting the new chunk
            /*const resumeLoading = async () => {
                console.log("updateend CB CP1");
                sb?.removeEventListener('updateend', resumeLoading);
                isAppendingRef.current = false;
                await fetchNextSequentialChunk();
            };
            sb?.addEventListener('updateend', resumeLoading);*/
        }
    };

    const handleOnStalled = (event) => {
        console.log("onStalled", event);
    }

    const handleOnSuspend = (event) => {
        console.log("onSuspend", event);
    }

    const handleTimeUpdate = (event) => {
        currentPositionTimeUnits.current = (videoRef.current?.currentTime ?? 0) * 2;

        let _atMoofIndex :number | null = null;
        for(let _i=0;_i < (sourceBufferMoofsRef.current?.length ?? 0); _i++ ){
            if(currentPositionTimeUnits.current >= (sourceBufferMoofsRef.current?.[_i][0] ?? 0)){
                _atMoofIndex = _i;
            }else{
                break;
            }
        }

        if ( ((_atMoofIndex ?? 0) < ((sourceBufferMoofsRef.current?.length ?? 0) - 1))
            && ( (currentPositionTimeUnits.current ?? 0) + ( currentPositionTimeUnitsBeforeWorryAboutNextInterval.current ?? 2) >
                  (sourceBufferMoofsRef.current?.[(_atMoofIndex ?? 0)+1][0] ?? 0) ) ) {

            // console.log("About to fetch", _atMoofIndex+1);
            if(typeof _atMoofIndex === 'number'){
                if(!isAppendingRef.current && !addedMoofs.current.has(_atMoofIndex + 1)) {
                    console.log("About to fetch", _atMoofIndex+1);
                    fetchNextSequentialChunk(_atMoofIndex + 1);
                }
            }
        }


        console.log("onTimeUpdate", videoRef.current?.currentTime);
    }

    return (
        <>
            <video
            ref={videoRef}
            controls
            onSeeking={handleSeek}
            onStalled={handleOnStalled}
            onSuspend={handleOnSuspend}
            onTimeUpdate={handleTimeUpdate}
            style={{ width: '100%', maxWidth: '800px' }}
            />
        </>
    )
}


export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const hlsRef = React.useRef<Hls | null>(null);

    React.useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // 1. Check if the file is a standard MP4
        const isMp4 = src.toLowerCase().endsWith('.mp4');

        if (isMp4) {
            // Let the browser handle standard HTTP Range Requests natively
            videoElement.src = src;
        }else
        // 1. Check if hls.js is supported by the browser
        if (Hls.isSupported()) {
            const hls = new Hls({
                maxBufferLength: 30, // Tweak low-level buffer constraints here
                enableWorker: true,
            });

            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(videoElement);

            // Example: Intercepting binary fragment loading events
            hls.on(Hls.Events.FRAG_LOADING, (_, data) => {
                console.log('Fetching next binary segment:', data.frag.url);
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad(); // Attempt recovery
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            break;
                    }
                }
            });
        }
        // 2. Native Safari fallback (Safari handles HLS natively without hls.js)
        else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = src;
        }

        // 3. Clean up memory and destroy the instance when the component unmounts
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src]); // Re-run if the stream source URL changes

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                controls
                style={{ width: '100%', maxWidth: '800px' }}
            />
        </div>
    );
};