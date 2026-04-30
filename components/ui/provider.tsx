"use client"

import { ChakraProvider, defaultConfig, createSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import theme from "../theme"
import { Providers } from "../../app/providers"

const system = createSystem(defaultConfig, theme);

export function Provider(props: ColorModeProviderProps) {
  return (
      <Providers>
        <ChakraProvider value={system}>
          <ColorModeProvider {...props} />
        </ChakraProvider>
      </Providers>
  )
}
