import { createClient } from "@insforge/sdk";

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL as string;
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY as string;

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
});
