import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token: readToken,
});

export function getClient(preview: boolean) {
  return preview ? draftClient : client;
}
