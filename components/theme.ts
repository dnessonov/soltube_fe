import { stepsAnatomy, fileUploadAnatomy, fieldsetAnatomy, fieldAnatomy, radioCardAnatomy } from "@chakra-ui/react/anatomy"
import {defineConfig, defineSemanticTokens, type SystemConfig} from "@chakra-ui/react";

const semanticColors = defineSemanticTokens.colors({
    buttonText: {
        solidOneButtonTextColor: {
            value: "var(--foreground)",
        },
        ghostOneBlueButtonTextColor: {
            value: "var(--foreground)" /*{  base: "#0000ff", _osDark: "#f0f0ff" }*/,
        }
    },

    headerText: {
        topBarLogoColor: {
            value: {  base: "{colors.white.950}", _osDark: "{colors.black.950}" },
        },
        topBarLogoColor2ndPart: {
            value: {  base: "{colors.blue.500}", _osDark: "#6bb5f4" },
        }
    },

    topBarSty1Color1: {
        value: {  base: "#ffff00", _osDark: "{colors.white.950}"/*, _osLight: "#ffff00"*/ },
    }
})

const theme :SystemConfig = defineConfig({
    theme: {

        semanticTokens: {
            colors: semanticColors
        },

        breakpoints: {
            topNavBreak: "700px"
        },

        layerStyles: {
            topBarSty1: {
                desciption: "Test Layer Style 1",
                value: {
                    /*border: "1px solid",
                    borderColor: "topBarSty1Color1",
                    _osDark: {
                        border: "3px solid",
                    }*/
                },
            },

            frontPageSearchBoxInput: {
                value: {
                    "--focus-color": "var(--searchbar-focus-color)" ,
                    // focusColor: "#447abf",
                }
            },

            frontPageSearchBoxContainer: {
                value: {
                    width: { base: "100%", sm: "94%", md: "89%", lg: "846px" },
                    maxWidth: { base: "", md: "846px" }
                }
            },

            footerBarBox1: {
                value: {
                    borderTop: { base: "1px solid var(--footer-line-color)", _osDark: "1px solid var(--footer-line-color)" }
                }
            }

        },

        recipes: {
            button: {
                base: {
                    fontWeight: "bold",
                    justifyContent: "center"
                },
                variants: {
                    variant: {
                        solid: {
                            color: "buttonText.solidOneButtonTextColor"
                        },
                        surface: {
                            color: "buttonText.solidOneButtonTextColor"
                        },
                        ghost: {
                            color: "buttonText.ghostOneBlueButtonTextColor"
                        }

                    }
                }
            },

            heading: {
                variants: {
                    size: {
                        topBarLogo: {
                            fontSize: "90px",
                            letterSpacing: "-8px",
                            color: "headerText.topBarLogoColor"
                        },

                        homePageSlogan: {
                            fontFamily: "Work Sans Light",
                            fontSize: { base: "18px", sm: "22px", md: "42px", lg: "53px"},
                            paddingTop: { base: "14px", sm: "19px", md: "32px", lg: "43px"},
                            paddingBottom: "33px"
                        }
                    }
                }
            },

            text: {
                variants: {
                    color: {
                        topBarLogoSecondPart: {
                            color: "headerText.topBarLogoColor2ndPart"
                        }
                    }
                }
            },

            box: {
                variants: {
                    color: {
                        topBarSty1: {
                            aspectRatio: "square",
                            backgroundColor: "tomato",
                            borderColor: "aqua",
                            fontSize: "44px"
                        }
                    }
                }
            },

            input: {
                variants: {
                    variant: {

                    }
                }
            },

            separator: {
                variants: {
                    colorPalette: {
                        cyan: {
                            borderLeftColor: "var(--footer-separator-color)"
                        }
                    }
                }
            }

        },

        slotRecipes: {
            steps: {
                className: 'chakra-steps',
                slots: stepsAnatomy.keys(),
                base: {
                    title: {
                        color: "var(--steps-title-color)"
                    },
                    description: {
                        color: "var(--steps-description-color)"
                    },

                    prevTrigger: {
                        color: "var(--foreground)",
                        // _hover: { color: "#00ff00" },
                        // _disabled: { color: "#454545" }
                    },
                    nextTrigger: {
                        color: "var(--foreground)"
                    },

                }
            },
            fileUpload: {
                className: "chakra-file-upload",
                slots:fileUploadAnatomy.keys(),
                base: {
                    itemDeleteTrigger: {
                        bg: "transparent !important",
                        border: "none !important",
                        padding: "0",
                        width: "auto",
                        height: "53px",
                        minWidth: "auto",
                        cursor: "pointer",

                        color: "color-mix(in srgb, var(--foreground), transparent 35%)",

                        display: "inline-flex !important", // Use flex for alignment
                        alignItems: "center !important",   // Vertical center
                        justifyContent: "center !important", // Horizontal center
                        // height: "24px !important",

                        _hover: {
                            // color: "fg.error", // Turns red on hover
                            bg: "transparent", // Ensures no background appears on hover
                            border: "none !important",
                            color: "color-mix(in srgb, var(--foreground), transparent 5%)",
                        },

                        _dark: {
                            _hover: {
                                border: "none"
                            }
                        }
                    },
                    dropzone: {
                        bg: "var(--background)",
                        _hover: {
                            bg: "var(--background)",
                        }
                    },

                    item: {
                        bg: "var(--background)",
                        color: "var(--foreground)",
                        _hover: {
                            bg: "var(--background)",
                        },
                        height: "320px"
                    },

                    itemName: {
                        color: "var(--foreground)",
                    },

                    itemPreview: {
                        color: "color-mix(in srgb, var(--foreground), transparent 20%)",
                    },

                    itemSizeText: {
                        color: "color-mix(in srgb, var(--foreground), transparent 42%)",
                    }
                }
            },

            fieldset: {
                className: "chakra-fieldset",
                slots: fieldsetAnatomy.keys(),
                base: {
                    legend: {
                        textAlign: "left",
                        alignSelf: "flex-start",
                        fontWeight: "semibold",
                        color: "color-mix(in srgb, var(--foreground), transparent 3%)",
                        fontFamily: "Work Sans Medium",
                        //fontFamily: "Work Sans SemiBold",
                        fontSize: "25px",
                    },

                    helperText: {
                        textAlign: "left",
                        alignSelf: "flex-start",
                        fontFamily: "Work Sans Regular",
                        color: "color-mix(in srgb, var(--foreground), transparent 0%)",
                        fontWeight: "normal",
                        fontSize: "17px",
                    },

                    content: {
                        paddingBottom: "15px"
                    }
                }
            },

            field: {
                className: "chakra-field",
                slots: fieldAnatomy.keys(),
                base: {
                    label: {
                        paddingTop: "10px",
                        mt: 4,
                        fontFamily: "Work Sans Regular",
                        color: "color-mix(in srgb, var(--foreground), transparent 3%)",
                    },
                    helperText: {
                        fontFamily: "Work Sans Regular",
                        color: "color-mix(in srgb, var(--foreground), transparent 34%)",
                    }
                }
            },

            radioCard: {
                className: "chakra-radioCard",
                slots: radioCardAnatomy.keys(),
                base: {
                    item: {
                        _checked: {
                            // borderColor: "purple.600" /*"color-mix(in srgb, var(--foreground), transparent 35%)"*/,
                            // borderWidth: "10px"
                            // backgroundColor: "#ff0",
                            boxShadow: "none !important",
                            // borderColor: "color-mix(in srgb, var(--foreground), transparent 2%) !important",
                            //borderColor: "green.600 !important",
                            //borderWidth: "3px !important",
                            //borderStyle: "solid",
                        },
                        _active:{
                            borderColor: "blue.600"
                        },
                        _focus: {
                            borderColor: "green.600",
                            // backgroundColor: "#f00"
                            backgroundColor: "color-mix(in srgb, var(--foreground), transparent 99%)"
                        },
                        borderColor: "color-mix(in srgb, var(--foreground), transparent 74%)",

                        "& > div[data-state='checked']": {
                            boxShadow: "none !important",

                            // Force your custom border configurations with highest priority
/*                            borderWidth: "3px !important",
                            borderStyle: "solid !important",
                            borderColor: "color-mix(in srgb, var(--foreground), transparent 2%) !important",*/

                            // Wipe internal layout variable overrides if present
                            "--radio-card-box-shadow": "none !important",
                        }
                    }

                }
            }

        }
    }
});

export default theme;
