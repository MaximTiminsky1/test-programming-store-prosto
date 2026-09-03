import type { z } from "zod";

import type { postSchema } from "./validation";

export type Post = z.infer<typeof postSchema>;
