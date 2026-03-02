"use client";

import React, { Fragment } from "react";
import { useChat } from "@ai-sdk/react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Loader2 } from "lucide-react";

const RAGChatBot = () => {
  const [input, setInput] = React.useState("");
  const { messages, sendMessage, status, error, stop } = useChat();

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!input) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${index}`}>
                          <Message from={message.role}>
                            <MessageContent key={message.id}>
                              {part.text}
                            </MessageContent>
                          </Message>
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {/* //Loader */}
            {(status === "submitted" || status === "streaming") && <Loader2 />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="p-4">
          <PromptInput multiple className="mt-4" onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </PromptInputBody>
            <PromptInputTools>
              {/* Model selector, web search e.t.c */}
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default RAGChatBot;
