import type {NextPage} from 'next'
import tw from "twin.macro";
import React, {useEffect, useState} from "react";
import TextareaAutosize from 'react-textarea-autosize';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faMoon, faPaperPlane, faRotate, faSun} from "@fortawesome/free-solid-svg-icons";
import useWebSocket, {ReadyState} from "react-use-websocket";
import Twemoji from 'react-twemoji';
import {css} from "styled-components";
import Head from "next/head";

const SearchGPT: NextPage = () => {

    const [shift, setShift] = useState(false)
    const [dark, setDark] = useState<boolean | undefined>(undefined)
    const [input, setInput] = useState<string>("");
    const [apiKey, setApiKey] = useState<string | undefined>(undefined);
    const {sendMessage, lastMessage, readyState} = useWebSocket("wss://searchgptapi.perrysahnow.com", {
        shouldReconnect: () => false,
    });
    const [messages, setMessages] = useState<({ "type": "user" | "assistant" | "error" | "search", "message": string })[]>([
        // {"type": "Search", "message": "Test Message"},
        // {"type": "error", "message": "Test Message"},
        // {"type": "assistant", "message": "Test Message"},
        // {"type": "user", "message": "Test Message"},
    ]);

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
        if (dark === undefined) return
        localStorage.setItem("dark", dark.toString());
        document.body.className = dark ? "dark" : ""
    }, [dark])

    useEffect(() => {
        const apiKey = localStorage.getItem("apiKey");
        if (apiKey !== null) {
            setApiKey(apiKey);
            sendMessage(JSON.stringify({"type": "apikey", "apikey": apiKey}))
        } else {
            setApiKey("")
        }
        const dark = localStorage.getItem("dark");
        if (dark !== null) {
            setDark(dark === "true")
        } else {
            setDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
    }, [])

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            if (data.type === "message") {
                setMessages([{"type": "assistant", "message": data.message}, ...messages]);
            } else if (data.type === "error") {
                setMessages([{"type": "error", "message": data.error}, ...messages]);
            } else if (data.type === "Search") {
                setMessages([{"type": "search", "message": data.search}, ...messages]);
            }
        }
    }, [lastMessage]);

    return (
        <>
            <Head>
                <title>SearchGPT</title>
            </Head>
            <div css={tw`w-screen h-screen p-3 sm:p-8  md:p-20 lg:px-36 bg-white dark:bg-slate-800`}>
                <div
                    css={tw`bg-sky-100 dark:bg-slate-700 shadow-lg w-full h-full flex flex-col rounded-xl p-2 text-black dark:text-white`}>
                    <div css={tw`text-5xl p-4 mx-auto font-sans font-medium flex flex-row`}>SearchGPT</div>
                    <div css={tw`flex flex-row text-lg justify-center gap-2`}>
                        {"Status: "}
                        <div
                            css={{...tw`p-3 w-min h-min my-auto rounded-full shadow-sm`, ...(connectionStatus === "Open" ? tw`bg-green-400` : connectionStatus === "Connecting" ? tw`bg-orange-400` : tw`bg-red-400`)}}/>
                    </div>
                    <div css={tw`text-xl pt-2 pb-4 mx-auto font-sans`}>Please note that SearchGPT will cost a lot if
                        used in
                        excess.
                    </div>
                    <div css={tw`w-full px-8 flex flex-row gap-1 sm:gap-2 md:gap-4 pb-2 justify-center`}>
                        <span css={tw`my-auto`}>OpenAI Api Key: </span>
                        <input css={css`
                          max-width: 30rem;
                          ${tw`h-8 rounded-full flex-grow flex-shrink focus:outline-none px-4 shadow-md min-w-0 bg-white dark:bg-slate-600`}
                        `} value={apiKey}
                               onChange={v => setApiKey(v.target.value)} placeholder={"sk-..."}/>
                    </div>
                    <div
                        css={tw`w-full h-full flex flex-col rounded-t-lg gap-4 p-4 flex-col-reverse overflow-auto`}>
                        {messages.map((message, index) => {
                            return (
                                <ChatBubble key={messages.length - index} text={message.message} type={message.type}/>
                            )
                        })}
                    </div>
                    <div css={tw`w-full flex flex-row rounded-b-lg p-2 gap-2`}>
                        <TextareaAutosize maxRows={8} minRows={1} value={input} onChange={v => setInput(v.target.value)}
                                          placeholder={"Ask me a question..."}
                                          css={tw`rounded-lg p-2 w-full resize-none focus:outline-none bg-white dark:bg-slate-600 shadow-lg`}
                                          onKeyDown={event => {
                                              const key = event.key
                                              if (key === "Shift") setShift(true)
                                              if (!shift && key === "Enter") {
                                                  event.preventDefault()
                                                  if (input !== "") {
                                                      setMessages([{"type": "user", "message": input}, ...messages]);
                                                      setInput("");
                                                      if (connectionStatus === "Open") {
                                                          sendMessage(JSON.stringify({
                                                              "type": "question",
                                                              "question": input
                                                          }))
                                                      }
                                                  }
                                              }
                                          }}
                                          onKeyUp={event => {
                                              const key = event.key
                                              if (key === "Shift") setShift(false)
                                          }}
                        />
                        <div css={tw`mt-auto`} onClick={() => {
                            if (input !== "") {
                                setMessages([{"type": "user", "message": input}, ...messages]);
                                setInput("");
                                if (connectionStatus === "Open") {
                                    sendMessage(JSON.stringify({"type": "question", "question": input}))
                                }
                            }
                        }}>
                            <div css={tw`mb-2`}>
                            <span
                                css={tw`bg-white dark:bg-slate-600 rounded-full p-2.5 shadow-md hover:cursor-pointer inline-block w-10 h-10 flex flex-col justify-center`}>
                                <div>
                                    <FontAwesomeIcon icon={faPaperPlane} size={"lg"}/>
                                </div>
                            </span>
                            </div>
                        </div>
                        <div css={tw`mt-auto`} onClick={() => {
                            window.location.reload()
                        }}>
                            <div css={tw`mb-2`}>
                            <span
                                css={tw`bg-white dark:bg-slate-600 rounded-full p-2.5 shadow-md hover:cursor-pointer inline-block w-10 h-10 flex flex-col justify-center`}>
                                <div>
                                    <FontAwesomeIcon icon={faRotate} size={"lg"}/>
                                </div>
                            </span>
                            </div>
                        </div>
                        <div css={tw`mt-auto`} onClick={() => {
                            setDark(!dark)
                        }}>
                            <div css={tw`mb-2`}>
                            <span
                                css={tw`bg-white dark:bg-slate-600 rounded-full p-2.5 shadow-md hover:cursor-pointer inline-block w-10 h-10 flex flex-col justify-center`}>
                                <div>
                                    <FontAwesomeIcon icon={dark ? faMoon : faSun} size={"lg"}/>
                                </div>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const ChatBubble: ({text, type}: { text: string, type: string }) => JSX.Element = ({text, type}) => {
    switch (type) {
        case "search":
            return (
                <div css={tw`flex flex-row gap-4 justify-start`}>
                    <div
                        css={tw`p-2 inline-block max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-5xl`}>
                        <div css={tw`break-words flex flex-row gap-2`}>
                    <span css={tw`my-auto`}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </span>
                            <Twemoji options={{"size": "1.5rem"}}>
                        <span css={tw`font-bold whitespace-pre break-words`}>
                            {"Searching Google For: "}
                        </span>
                                {text}
                            </Twemoji>
                        </div>
                    </div>
                </div>
            )
        case "error":
            return (
                <div>
                    <div css={tw`break-words mx-auto p-3 flex flex-row justify-center`}>
                        <Twemoji options={{"size": "1.5rem whitespace-pre"}}>
                            {`Error: `}{text}
                        </Twemoji>
                    </div>
                </div>
            )
        case "user":
            return (
                <div
                    css={tw`flex flex-row gap-4 justify-end`}>
                    <div
                        css={tw`bg-blue-600 text-white shadow-md rounded-xl p-2 inline-block max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-5xl`}>
                        <div css={css`
                          white-space: break-spaces;
                          ${tw`break-words`}
                        `}>
                            <Twemoji options={{"size": "1.5rem"}}>
                                {text}
                            </Twemoji>
                        </div>
                    </div>
                </div>)
        default:
            return (
                <div
                    css={tw`flex flex-row gap-4 justify-start`}>
                    <div
                        css={tw`bg-gray-100 dark:bg-slate-800 shadow-md rounded-xl p-2 inline-block max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-5xl`}>
                        <div css={css`
                          white-space: break-spaces;
                          ${tw`break-words`}
                        `}>
                            <Twemoji options={{"size": "1.5rem"}}>
                                {text}
                            </Twemoji>
                        </div>
                    </div>
                </div>
            )
    }
}

export default SearchGPT
