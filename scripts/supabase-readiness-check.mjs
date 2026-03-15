import fs from "node:fs";

function getEnvValue(envFile, name) {
  return (envFile.match(new RegExp(`^${name}=(.+)$`, "m")) || [])[1]?.trim();
}

async function readEndpoint(label, target, headers) {
  const response = await fetch(target, { headers });
  const body = await response.text();

  console.log(`[${label}] ${response.status}`);
  console.log(body);
}

async function main() {
  const envFile = fs.readFileSync(".env.local", "utf8");
  const url = getEnvValue(envFile, "NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnvValue(envFile, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or publishable key.");
  }

  await readEndpoint("auth-settings", `${url}/auth/v1/settings`, {
    apikey: key,
  });

  const restHeaders = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  await readEndpoint(
    "profiles",
    `${url}/rest/v1/profiles?select=id&limit=1`,
    restHeaders
  );

  await readEndpoint(
    "saved_visualizations",
    `${url}/rest/v1/saved_visualizations?select=id&limit=1`,
    restHeaders
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
