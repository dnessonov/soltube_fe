import { useRouter } from 'next/navigation';
import Layout1 from '@/components/my/layout1';
import * as React from "react";
import {
    Heading,
    Fieldset,
    Field,
    Input,
    Textarea,
    NativeSelect,
    Stack, Button, Text,
    Box,
    HStack, Icon, RadioCard
} from "@chakra-ui/react";
import {LuArrowRight, LuScanEye} from "react-icons/lu";



interface MyWrapperProps {
    // children: React.ReactNode; // ReactNode is the standard type for anything React can render
    pathVideoId: string | undefined;
}


export default function Home({ pathVideoId } : MyWrapperProps) {
    return (
        <Layout1>
            <Heading size="homePageSlogan">Publish Video <sup>On-Chain</sup></Heading>

            <Box justifyContent="center" alignItems="center" display="flex">
                <Fieldset.Root size="2xl" maxW="md" style={{borderWidth: "1px", borderColor: "#cecece", borderRadius: "10px", padding: "43px"}}>
                    <Stack>
                        <Fieldset.Legend>Video details</Fieldset.Legend>
                        <Fieldset.HelperText>
                            Please title your video and provide a short description.<br />
                            (This information will be saved on-chain.)
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root required>
                            <Field.Label>Title <Field.RequiredIndicator /></Field.Label>
                            <Input name="title" />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Description <Field.RequiredIndicator /></Field.Label>
                            <Textarea name="description" />
                            <Field.HelperText>Max 300 characters.</Field.HelperText>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Visibility</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field name="visibility">
                                    <option key="public" value="public">Public</option>
                                    <option key="private" value="private" disabled>Private (WIP)</option>
                                    <option key="ppv" value="ppv" disabled>Pay per View (WIP)</option>
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Permissions</Field.Label>
                            <RadioCard.Root defaultValue="public">
                                <RadioCard.Label>Select permission</RadioCard.Label>
                                <HStack align="stretch">
                                    <RadioCard.Item key="public" value="public">
                                        <RadioCard.ItemHiddenInput />
                                        <RadioCard.ItemControl>
                                            <RadioCard.ItemContent>
                                                <Icon size="xl" color="fg.muted" mb="2">
                                                    <LuArrowRight />
                                                </Icon>
                                                <RadioCard.ItemText>Public</RadioCard.ItemText>
                                                <RadioCard.ItemDescription>Video will be available to all by link</RadioCard.ItemDescription>
                                            </RadioCard.ItemContent>
                                            <RadioCard.ItemIndicator />
                                        </RadioCard.ItemControl>
                                    </RadioCard.Item>
                                    <RadioCard.Item key="private" value="private">
                                        <RadioCard.ItemHiddenInput />
                                        <RadioCard.ItemControl>
                                            <RadioCard.ItemContent>
                                                <Icon size="xl" color="fg.muted" mb="2">
                                                    <LuScanEye />
                                                </Icon>
                                                <RadioCard.ItemText>Private</RadioCard.ItemText>
                                                <RadioCard.ItemDescription>Video will be available to specific Solana addresses only</RadioCard.ItemDescription>
                                            </RadioCard.ItemContent>
                                            <RadioCard.ItemIndicator />
                                        </RadioCard.ItemControl>
                                    </RadioCard.Item>
                                </HStack>
                            </RadioCard.Root>
                            <NativeSelect.Root>
                                <NativeSelect.Field name="visibility">
                                    <option key="public" value="public">Public</option>
                                    <option key="private" value="private" disabled>Private (WIP)</option>
                                    <option key="ppv" value="ppv" disabled>Pay per View (WIP)</option>
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                        </Field.Root>

                    </Fieldset.Content>


                    <Button type="submit" alignSelf="flex-start">Submit</Button>

                </Fieldset.Root>
            </Box>
        </Layout1>
    )
}