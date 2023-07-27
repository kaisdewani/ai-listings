"use client"

import * as z from "zod";
import { Heading } from "@/components/heading";
import { BedDoubleIcon, MessagesSquare, MessagesSquareIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import axios from "axios"
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Copy } from 'lucide-react';



const ImagePage = () => {
    const router = useRouter()
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            keywords: ""
        }
    });

    const isLoading = form.formState.isSubmitting

    // const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //     try {
    //         const userMessage: ChatCompletionRequestMessage = {
    //             role: "user",
    //             content: values.prompt
    //         }
    //         const newMessages = [...messages, userMessage]

    //         const response = await axios.post("/api/conversation", {
    //             messages: newMessages,
    //         })

    //         setMessages((current) => [...current, userMessage, response.data])

    //         form.reset();


    //     } catch (error: any) {
    //         //Pro Model here
    //         console.log(error)
    //     } finally {
    //         router.refresh();
    //     }
    // }

    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied!');
        } catch (err) {
            alert('Failed to copy text');
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Check if address is empty
        if (!values.address || values.address.length === 0) {
            alert("Address is a required field");
            return;
        }

        try {
            const systemMessage: ChatCompletionRequestMessage = {
                role: "system",
                content: `Generate property descriptions which are unique and personable using the following provided address: ${values.address}. Your capabilities include creating concise and engaging descriptions of properties with a maximum length of 250 words. You rely solely on the data provided for a specific home address to generate these listings. Your goal is to provide potential buyers with a clear and appealing overview of the property, emphasizing its key features and attributes based on the available data and user-specified keywords: ${values.keywords}. Only respond to questions related to real estate. If its not related answer eactly with "Please add the full address".(250 word limit)`
            };
            const userMessage1: ChatCompletionRequestMessage = {
                role: "user",
                content: values.address
            };
            const userMessage2: ChatCompletionRequestMessage = {
                role: "user",
                content: values.keywords || ""  // set to an empty string if keywords is null or undefined
            };
            const newMessages = [...messages, systemMessage];

            const response = await axios.post("/api/conversation", {
                messages: newMessages,
            });

            setMessages((current) => [...current, response.data]);

            form.reset();
        } catch (error: any) {
            console.log(error)
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Stage Your Room"
                description="Try staging with Ai"
                icon={BedDoubleIcon}
                iconColor="text-pink-700"
                bgColor="text-pink-700/10"
            />

            <div className="px-4 lg:px-8">

                {/* <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="
                            rounded-lg
                            border
                            w-full
                            p-4
                            px-3
                            md:px-6
                            foucs-within:shadow-sm
                            grid
                            grid-cols-12
                            gap-2
                        "
                    >
                        <FormField
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="How do I calculate the radius of a circle?"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                            Generate
                        </Button>
                    </form>
                </Form> */}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="
            rounded-lg
            border
            w-full
            p-4
            px-3
            md:px-6
            foucs-within:shadow-sm
            grid
            grid-cols-12
            gap-2
        "
                    >
                        <div className="col-span-12 lg:col-span-10 p-4 rounded-lg border w-full">
                            <FormField
                                name="address"
                                render={({ field }) => (
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="Listing Address"
                                            {...field}
                                        />
                                    </FormControl>
                                )}
                            />
                        </div>



                        <Button className="col-span-12 lg:col-span-2 w-full mt-4" disabled={isLoading} type="submit">
                            Generate
                        </Button>
                    </form>
                </Form>

            </div>
            <div className="space-y-4 mt-4">

                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                        <Loader />
                    </div>
                )}

                {messages.length === 0 && !isLoading && (
                    <div>
                        <Empty label="No conversation started" />
                    </div>
                )}
                <div className="flex flex-col-reverse gap-y-4">
                    {messages.filter(message => message.role !== "system").map((message) => (
                        <div
                            key={message.content}
                            className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg",
                                message.role == "user" ? "bg-white border border-black/10" : "bg-muted"
                            )}
                        >
                            {/* {message.role === "user" ? <UserAvatar /> : <BotAvatar />} */}
                            {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                            <p className="text-sm">
                                {message.content}
                            </p>
                            {message.role === 'assistant' && <button onClick={() => copyToClipboard(message.content || '')}><Copy /></button>}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default ImagePage;