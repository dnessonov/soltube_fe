import "@chakra-ui/react"

declare module "@chakra-ui/react" {
    interface HeadingProps {
        size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "homePageSlogan"
    }

    interface ButtonProps {
        href?: string
    }

    export interface Breakpoints {
        topNavBreak: string
    }

    export interface ThemeBreakpoints {
        topNavBreak: string
    }

    export interface FontSizes {
        topNavBreak: string
    }

    export interface ConfigCustom {
        breakpoints: {
            topNavBreak: string
        }
    }

    export type BreakpointsToken = "sm" | "md" | "lg" | "xl" | "2xl" | "topNavBreak"
    export type FontSizesToken = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "topNavBreak"

}

