import {notFound} from "next/navigation";
import SPage1Watch from "@/app/watch/page";

export const dynamicParams = true;

export function generateStaticParams() {
    // We return a dummy array. This creates a single static folder/file
    // during the build so Next.js doesn't complain.
    return [{ slug: ['index'] }];
}

export default async function SPage2Watch({ params }: { params: { slug: string[] } }) {
    //return SPage1Watch(params);

    const _inner_params = await params;

    return (
        <SPage1Watch slug={_inner_params.slug} />
    )
}