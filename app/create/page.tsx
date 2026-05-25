"use client";

import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Home from "@/app/create/create";


function VariantTwo(){

    const { NotConvertedVideoId } = useParams();

    return (<>
            <h1>Hello from new video config! {NotConvertedVideoId}</h1>
        </>
    );
}

function Path404(){

    const { slugId } = useParams();

    return (<>
            <h1>404. Create Oops. {slugId} not found.</h1>
        </>
    );
}

export default function SPage1Watch(params : {slug: string[]}) {
    return (
        <Router basename="/create">
            <Routes>
                <Route path="/:NotConvertedVideoId" element={<VariantTwo />} />
                <Route path="/" element={<Home />} />

                <Route path="*" element={<Path404 />} />
            </Routes>
        </Router>
    );
}
