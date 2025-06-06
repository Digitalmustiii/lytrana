import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  datasets: defineTable({
    name: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    uploadedBy: v.string(), // Clerk user ID
    uploadedAt: v.number(),
    rowCount: v.number(),
    columnCount: v.number(),
    columns: v.array(v.object({
      name: v.string(),
      type: v.string(), // 'string', 'number', 'date'
      nullable: v.boolean(),
    })),
    fileUrl: v.optional(v.string()), // Convex file storage URL
    status: v.union(v.literal("processing"), v.literal("ready"), v.literal("error")),
  }).index("by_user", ["uploadedBy"]),

  analyses: defineTable({
    datasetId: v.id("datasets"),
    userId: v.string(),
    createdAt: v.number(),
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
  }).index("by_dataset", ["datasetId"]).index("by_user", ["userId"]),

  reports: defineTable({
    title: v.string(),
    datasetId: v.id("datasets"),
    analysisId: v.id("analyses"),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
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
    shareToken: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_dataset", ["datasetId"]),
});