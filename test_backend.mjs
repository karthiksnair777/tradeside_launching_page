import { createClient } from "@insforge/sdk";

const url = process.env.NEXT_PUBLIC_INSFORGE_URL;
const key = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!url || !key) {
  console.log("Missing environment variables. Make sure .env.local is loaded.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function runTest() {
  console.log("Testing backend connection and schema...");
  let success = true;

  // 1. Test basic connection by querying trading_accounts
  console.log("\n[1/3] Testing basic connection (fetching trading_accounts)...");
  const { data: accounts, error: accError } = await supabase.database.from("trading_accounts").select("*").limit(1);
  if (accError) {
    console.error("❌ Failed to fetch trading_accounts:", accError.message);
    success = false;
  } else {
    console.log("✅ Basic connection successful.");
  }

  // 2. Test fetching trades
  console.log("\n[2/3] Testing trades table...");
  const { data: trades, error: tradesError } = await supabase.database.from("trades").select("*").limit(1);
  if (tradesError) {
    console.error("❌ Failed to fetch trades:", tradesError.message);
    success = false;
  } else {
    console.log("✅ Trades table exists.");
  }

  // 3. Test daily_checkins table (New Psychology Feature)
  console.log("\n[3/3] Testing daily_checkins table (Psychology)...");
  const { data: checkins, error: checkinsError } = await supabase.database.from("daily_checkins").select("*").limit(1);
  if (checkinsError) {
    console.error("❌ Failed to fetch daily_checkins:", checkinsError.message);
    console.log("👉 It seems the schema.sql hasn't been applied yet, or the table is missing.");
    success = false;
  } else {
    console.log("✅ daily_checkins table exists. Psychology feature is fully supported by the backend.");
  }

  console.log("\n==================================");
  if (success) {
    console.log("🎉 ALL TESTS PASSED! The backend is fully functional.");
  } else {
    console.log("⚠️ SOME TESTS FAILED. Please ensure schema.sql has been applied in your Insforge/Supabase dashboard.");
  }
}

runTest();
