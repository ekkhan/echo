"use client";

import { api } from "@workspace/backend/_generated/api";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";

import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
// import { DicebearAvatar } from "@workspace/ui/components/dicebearAvatar";
// import { GetCountryFlagUrl, GetCountryFromTimezone } from "@/lib/country-utils";
// import { ConversationStatusButton } from "../components/conversation-status-button";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Protect } from "@clerk/nextjs";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
    const conversation = useQuery(api.private.conversations.getOne, {
      conversationId,
    });

    const messages = useThreadMessages(
        api.private.messages.getMany,
        conversation?.threadId ? { threadId: conversation.threadId } : "skip",
        {
          initialNumItems: 10,
        }
    );

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        message: "",
      },
    });

    const createMessage = useMutation(api.private.messages.create);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          await createMessage({
            conversationId,
            prompt: values.message,
          });
    
          form.reset();
        } catch (error) {
          console.error(error);
        }
      };
    

    return (
        <div className="flex h-full flex-col bg-muted">
          <header className="flex items-center justify-between border-b bg-background p-2.5">
            <Button variant="ghost" size="sm">
              <MoreHorizontalIcon />
            </Button>
          </header>
          <AIConversation className="max-h-[calc(100vh-180px)]">
            <AIConversationContent>
              {toUIMessages(messages.results ?? [])?.map((message) => (
                <AIMessage
                  // reversed as we are typing as the assistant not the user
                  from={message.role === "user" ? "assistant" : "user"}
                  key={message.id}
                >
                   <AIMessageContent>
                     <AIResponse>{message.content}</AIResponse>
                   </AIMessageContent>
                   {message.role === "user" && (
                     <DicebearAvatar
                       seed={conversation?.contactSessionId ?? "user"}
                       size={32}
                    //    badgeImageUrl={countryFlagUrl}
                    />
                    )}
                </AIMessage>
              ))}
            </AIConversationContent>
            <AIConversationScrollButton />
          </AIConversation>

          <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting 
                    // ||
                    // isEnhancing
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved"
                      : "Type your response as an operator..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                {/* <Protect condition={(has) => has({ plan: "pro" })}> */}
                  <AIInputButton
                  disabled={
                    conversation?.status === "resolved" ||
                    // isUpdatingStatus ||
                    form.formState.isSubmitting ||
                    !form.formState.isValid
                  }
                //   onClick={handleEnhanceResponse}
                >
                  <Wand2Icon />
                  Enhance
                  {/* {isEnhancing ? "Enhancing..." : "Enhance"} */}
                </AIInputButton>
                {/* </Protect> */}
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting 
                //   ||
                //   isEnhancing
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
        </div>
)}
