"use client"

import { ChakraProvider, defaultConfig, createSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import theme from "../theme"
import { Providers } from "../../app/providers"
import {autoDiscover, createClient} from "@solana/client";
import { SolanaProvider } from "@solana/react-hooks";

const system = createSystem(defaultConfig, theme);

export const solanaClient = createClient({
    endpoint: process.env.SOLANA_ENDPOINT, // "https://api.devnet.solana.com",
    websocketEndpoint: process.env.SOLANA_WS_ENDPOINT, // "wss://api.devnet.solana.com",
    walletConnectors: autoDiscover(),
});

export function Provider(props: ColorModeProviderProps) {
  return (
      <Providers>
        <ChakraProvider value={system}>
            <SolanaProvider client={solanaClient}>
                <ColorModeProvider {...props} />
            </SolanaProvider>
        </ChakraProvider>
      </Providers>
  )
}
