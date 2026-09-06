import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"]
    },
    transpilePackages: ['@soltube/solana-video'],

    // Workaround for shared @soltube/solana-video library importing -- BEGIN
    turbopack: {
        // Tells Turbopack to treat the parent folder as the compilation root,
        // allowing it to safely follow the symlink outward.
        root: path.join(__dirname, '../../'),
    },
    // Workaround for shared @soltube/solana-video library importing -- END

    //output: 'export', // used for next build only (ng_build.sh uncomments it when doing build)
    /*webpack: (config, { isServer}) => {
        if(!isServer){
            config.plugins.push(new CompressionPlugin({}))
        }
        return config;
    }*/
};

export default nextConfig;
