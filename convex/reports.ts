import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new report
export const createReport = mutation({
  args: {
    title: v.string(),
    datasetId: v.id("datasets"),
    analysisId: v.id("analyses"),
    userId: v.string(),
    content: v.object({
      summary: v.string(),
      charts: v.array(v.object({
        type: v.string(),
        title: v.string(),
        data: v.any(),
      })),
      insights: v.array(v.string()),
    }),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("reports", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get user's reports
export const getUserReports = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get report by ID
export const getReport = query({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update report
export const updateReport = mutation({
  args: {
    id: v.id("reports"),
    title: v.optional(v.string()),
    content: v.optional(v.object({
      summary: v.string(),
      charts: v.array(v.object({
        type: v.string(),
        title: v.string(),
        data: v.any(),
      })),
      insights: v.array(v.string()),
    })),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});