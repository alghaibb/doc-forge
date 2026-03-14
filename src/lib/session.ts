import { auth } from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({
    headers: {
      cookie: cookieStore.toString(),
    },
  });
  return session;
});

