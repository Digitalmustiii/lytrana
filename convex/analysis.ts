import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create analysis result
export const createAnalysis = mutation({
  args: {
    datasetId: v.id("datasets"),
    userId: v.string(),
    statistics: v.object({
      numerical: v.array(v.object({
        column: v.string(),
        mean: v.number(),
        median: v.number(),
        std: v.number(),
        min: v.number(),
        max: v.number(),
        count: v.number(),
      })),
      categorical: v.array(v.object({
        column: v.string(),
        uniqueCount: v.number(),
        topValues: v.array(v.object({
          value: v.string(),
          count: v.number(),
        })),
      })),
    }),
    correlations: v.optional(v.array(v.object({
      column1: v.string(),
      column2: v.string(),
      correlation: v.number(),
    }))),
    aiInsights: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get analysis by dataset
export const getAnalysisByDataset = query({
  args: { datasetId: v.id("datasets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyses")
      .withIndex("by_dataset", (q) => q.eq("datasetId", args.datasetId))
      .first();
  },
});

// Get analysis by ID
export const getAnalysis = query({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update AI insights
export const updateAIInsights = mutation({
  args: {
    id: v.id("analyses"),
    insights: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { aiInsights: args.insights });
  },
});