import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_INSFORGE_URL;
const key = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!url || !key) {
  console.log("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function runTest() {
  console.log("Testing backend connection for daily_checkins...");
  
  // Try to select from daily_checkins
  const { data, error } = await supabase.from("daily_checkins").select("*").limit(1);
  
  if (error) {
    console.error("Backend Test FAILED. The table 'daily_checkins' might not exist yet.");
    console.error("Error details:", error.message);
  } else {
    console.log("Backend Test PASSED. The table 'daily_checkins' exists and is accessible.");
    console.log("Data returned:", data);
  }
}

runTest();
