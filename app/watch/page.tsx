"use client";
import Image from "next/image";

import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Home from "@/app/page";
import { useEffect, useState } from "react";



function RootOne(){
    return (<>
        <h1>Hello from root!</h1>
        </>
    );
}


function VariantTwo(){

    const { slugId } = useParams();

    return (<>
            <h1>Hello from two! {slugId}</h1>
        </>
    );
}

function VariantTwoComments(){

    const { slugId } = useParams();

    return (<>
            <h1>Hello from two! These are comments for {slugId}</h1>
        </>
    );
}


function Path404(){

    const { slugId } = useParams();

    return (<>
            <h1>404. Oops. {slugId} not found.</h1>
        </>
    );
}

export default function SPage1Watch(params : {slug: string[]}) {

    const {slug} = /*await*/ params;
    console.log("root slug is ", slug);

    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client after mounting
    useEffect( () => {
        setMounted(true);
    }, []);


    if (!mounted) return (
        <></>
    );

    return (
        <Router>
            <Routes>
                <Route path="/watch" element={<RootOne />} />
                <Route path="/watch/:slugId" element={<VariantTwo />} />
                <Route path="/watch/:slugId/comments" element={<VariantTwoComments />} />
                <Route path="/" element={<Home />} />

                <Route path="*" element={<Path404 />} />
            </Routes>
        </Router>
    );
}
