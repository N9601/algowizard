"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "../../types/database";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

export function createClient() {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey()
  );
}
