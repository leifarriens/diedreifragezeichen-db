import { createAuthHooks } from "@ddfdb/client";

import { authClient } from "../auth-client";

export const { useSignIn } = createAuthHooks(authClient);
