import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../../types/database";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
