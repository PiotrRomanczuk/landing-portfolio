import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/lib/env";

export default defineConfig({
  name: "default",
  title: "Romanczuk · Writing Desk",
  projectId,
  dataset,
  basePath: studioUrl,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
