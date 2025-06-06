import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new dataset record
export const createDataset = mutation({
  args: {
    name: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    uploadedBy: v.string(),
    rowCount: v.number(),
    columnCount: v.number(),
    columns: v.array(v.object({
      name: v.string(),
      type: v.string(),
      nullable: v.boolean(),
    })),
    fileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("datasets", {
      ...args,
      uploadedAt: Date.now(),
      status: "processing",
    });
  },
});

// Get user's datasets
export const getUserDatasets = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("datasets")
      .withIndex("by_user", (q) => q.eq("uploadedBy", args.userId))
      .order("desc")
      .collect();
  },
});

// Get dataset by ID
export const getDataset = query({
  args: { id: v.id("datasets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update dataset status
export const updateDatasetStatus = mutation({
  args: {
    id: v.id("datasets"),
    status: v.union(v.literal("processing"), v.literal("ready"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});

// Get user stats for dashboard
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const datasets = await ctx.db
      .query("datasets")
      .withIndex("by_user", (q) => q.eq("uploadedBy", args.userId))
      .collect();

    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      datasets: datasets.length,
      analyses: analyses.length,
      reports: reports.length,
    };
  },
});

// Get recent activity
export const getRecentActivity = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const datasets = await ctx.db
      .query("datasets")
      .withIndex("by_user", (q) => q.eq("uploadedBy", args.userId))
      .order("desc")
      .take(10);

    return datasets.map(dataset => ({
      id: dataset._id,
      name: dataset.fileName,
      action: "Uploaded",
      time: dataset.uploadedAt,
    }));
  },
});