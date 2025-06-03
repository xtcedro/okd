import { Router } from "https://deno.land/x/oak/mod.ts";
import { searchSite } from "../controllers/searchController.ts";

const router = new Router();

// Define the GET /search route, mapped to the searchSite controller
router.get("/", searchSite);

export default router;
