import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"]
    },

    //output: 'export', // used for next build only (ng_build.sh uncomments it when doing build)
    /*webpack: (config, { isServer}) => {
        if(!isServer){
            config.plugins.push(new CompressionPlugin({}))
        }
        return config;
    }*/
};

export default nextConfig;
