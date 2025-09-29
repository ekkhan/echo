import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values" //convex validator library

export default defineSchema({
    users: defineTable({
        name: v.string(),
    }),
});