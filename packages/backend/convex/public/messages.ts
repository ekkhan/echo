import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { search } from "../system/ai/tools/search";
// import { resolveConversation } from "../system/ai/tools/resolveConversation";
// import { escalateConversation } from "../system/ai/tools/escalateConversation";
// import { saveMessage } from "@convex-dev/agent";
// import { search } from "../system/ai/tools/search";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId,
      }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation is already resolved",
      });
    }

    //implement sucscription check

    // await ctx.runMutation(internal.system.contactSessions.refresh, {
    //   contactSessionId: args.contactSessionId,
    // })

    // const subscription = await ctx.runQuery(
    //   internal.system.subscriptions.getByOrganizationId, {
    //     organizationId: conversation.organizationId
    //   }
    // )

    // //TODO subscription check
    // const shouldTriggerAgent = conversation.status === "unresolved" && subscription?.status === "active";
    const shouldTriggerAgent = conversation.status === "unresolved";

    if (shouldTriggerAgent) {
    //   // Cast to any to avoid excessively deep TS instantiation from generic-heavy types
      await supportAgent.generateText(
        ctx,
        {
          threadId: args.threadId,
          tools: {
            resolveConversationTool: resolveConversation,
            escalateConversationTool: escalateConversation,
            searchTool: search,
          },
        },
        {
          prompt: args.prompt,
        }
      );
    } else {
        await supportAgent.saveMessage(ctx, {
            threadId: args.threadId,
            prompt: args.prompt,
        });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid",
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});