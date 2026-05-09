import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

type ImageInput = Image | { asset?: unknown; _type?: string };

export function urlForImage(source: ImageInput | undefined | null) {
  if (!source || !("asset" in source) || !source.asset) return undefined;
  return builder.image(source as Image).auto("format").fit("max");
}
