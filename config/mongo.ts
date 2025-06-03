import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI") || "mongodb://127.0.0.1:27017");

const db = client.database("domingueztechsolutions_db");
export const roadmapCollection = db.collection("roadmap");
