// roadmapController.ts
import { Bson } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { roadmapCollection } from "../config/mongo.ts";
import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

/**
 * Fetch all roadmap entries
 */
export const getRoadmapItems = async (ctx: Context) => {
  try {
    const items = await roadmapCollection.find({}).toArray();
    ctx.response.status = 200;
    ctx.response.body = items;
  } catch (error) {
    ctx.throw(500, `Error fetching roadmap: ${error.message}`);
  }
};

/**
 * Create a new roadmap entry
 */
export const createRoadmapItem = async (ctx: Context) => {
  try {
    const body = await ctx.request.body().value;
    const { title, description, status, priority, targetRelease, tags } = body;

    if (!title || !description) {
      ctx.throw(400, "Title and description are required");
    }

    const newItem = {
      title,
      description,
      status: status || "planned",
      priority: priority || "medium",
      targetRelease: targetRelease || "TBD",
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertId = await roadmapCollection.insertOne(newItem);
    ctx.response.status = 201;
    ctx.response.body = { _id: insertId, ...newItem };
  } catch (error) {
    ctx.throw(500, `Failed to create roadmap item: ${error.message}`);
  }
};

/**
 * Update a roadmap item by ID
 */
export const updateRoadmapItem = async (ctx: Context) => {
  try {
    const id = ctx.params.id!;
    const updates = await ctx.request.body().value;

    const { matchedCount } = await roadmapCollection.updateOne(
      { _id: new Bson.ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
    );

    if (matchedCount) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Roadmap item updated" };
    } else {
      ctx.throw(404, "Roadmap item not found");
    }
  } catch (error) {
    ctx.throw(500, `Update failed: ${error.message}`);
  }
};

/**
 * Delete a roadmap item by ID
 */
export const deleteRoadmapItem = async (ctx: Context) => {
  try {
    const id = ctx.params.id!;
    const deleteCount = await roadmapCollection.deleteOne({
      _id: new Bson.ObjectId(id),
    });

    if (deleteCount) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Roadmap item deleted" };
    } else {
      ctx.throw(404, "Roadmap item not found");
    }
  } catch (error) {
    ctx.throw(500, `Delete failed: ${error.message}`);
  }
};