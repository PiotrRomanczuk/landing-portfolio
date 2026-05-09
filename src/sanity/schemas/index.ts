import type { SchemaTypeDefinition } from "sanity";

import { post } from "./post";
import { tag } from "./tag";
import { codeBlock } from "./blocks/code";
import { inlineImage } from "./blocks/image";
import { callout } from "./blocks/callout";
import { pullQuote } from "./blocks/pullQuote";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  tag,
  codeBlock,
  inlineImage,
  callout,
  pullQuote,
];
