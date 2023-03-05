import type {NextPage} from 'next'
import tw from "twin.macro";
import React, {useEffect, useState} from "react";
import TextareaAutosize from 'react-textarea-autosize';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import useWebSocket, {ReadyState} from "react-use-websocket";

const SearchGPT: NextPage = () => {

    const [input, setInput] = useState<string>("");
    const [apiKey, setApiKey] = useState<string | undefined>(undefined);
    const {sendMessage, lastMessage, readyState} = useWebSocket("wss://searchgpt.perrysahnow.com");
    const [messages, setMessages] = useState<{ "type": "user" | "assistant", "message": string }[]>([]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        if (apiKey === undefined) return
        if (connectionStatus === "Open") {
            sendMessage(JSON.stringify({"type": "apikey", "apikey": apiKey}))
        }
        localStorage.setItem("apiKey", apiKey);
    }, [apiKey])

    useEffect(() => {
        const apiKey = localStorage.getItem("apiKey");
        if (apiKey !== null) {
            setApiKey(apiKey);
            sendMessage(JSON.stringify({"type": "apikey", "apikey": apiKey}))
        } else {
            setApiKey("")
        }
    }, [])

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            if (data.type === "message") {
                setMessages([...messages, {"type": "assistant", "message": data.message}]);
            }
        }
    }, [lastMessage]);

    return (
        <div css={tw`w-screen h-screen p-8  md:p-20 lg:px-36`}>
            <div css={tw`bg-sky-200 w-full h-full flex flex-col rounded-xl p-2`}>
                <div css={tw`text-5xl p-4 mx-auto font-sans font-medium`}>SearchGPT ({connectionStatus})</div>
                <div css={tw`text-xl pb-4 mx-auto font-sans`}>Note: SearchGPT can cost a lot if used in excess. Please
                    be careful.
                </div>
                <div css={tw`w-full px-8 flex flex-row gap-4 pb-2`}>
                    <span css={tw`my-auto`}>OpenAI Api Key: </span>
                    <input css={tw`h-8 rounded-full flex-grow flex-shrink focus:outline-none px-4`} value={apiKey}
                           onChange={v => setApiKey(v.target.value)} placeholder={"sk-..."}/>
                </div>
                <div css={tw`w-full h-full flex flex-col bg-orange-100 rounded-t-lg gap-4 p-4`}>
                    {messages.map((message, index) => {
                        return (
                            <ChatBubble key={index} text={message.message} user={message.type === "user"}/>
                        )
                    })}
                </div>
                <div css={tw`w-full flex flex-row bg-red-200 rounded-b-lg p-2`}>
                    <TextareaAutosize maxRows={8} minRows={1} value={input} onChange={v => setInput(v.target.value)}
                                      css={tw`rounded-lg p-2 w-full resize-none focus:outline-none bg-transparent`}/>
                    <div css={tw`mt-auto`} onClick={() => {
                        if (input !== "") {
                            setMessages([...messages, {"type": "user", "message": input}]);
                            setInput("");
                            if (connectionStatus === "Open") {
                                sendMessage(JSON.stringify({"type": "question", "question": input}))
                            }
                        }
                    }}>
                        <span css={tw`text-black p-1`}>
                            <FontAwesomeIcon icon={faPaperPlane} size={"2x"}/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChatBubble: ({text, user}: { text: string, user?: boolean }) => JSX.Element = ({text, user}) => {

    return (
        <div css={user ? tw`flex flex-row gap-4 justify-end` : tw`flex flex-row gap-4 justify-start`}>
            <div
                css={user ? tw`bg-blue-200 rounded-xl p-2 inline-block max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-5xl` : tw`bg-green-200 rounded-xl p-2 inline-block max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-5xl`}>
                <div css={tw`break-words`}>
                    {text}
                </div>
            </div>
        </div>
    )
}

export default SearchGPT
