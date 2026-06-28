import { createClient } from '@insforge/sdk';

const url = 'https://gdx6jrqh.us-east.insforge.app';
const key = 'anon_030ab5575136bd054a033602d00d91d4af4ce092cc94689a0cd18f2c2782da27';

const insforge = createClient({ baseUrl: url, anonKey: key });

async function testInsert() {
  console.log("Checking if trading_accounts exists...");
  const { data, error } = await insforge.database.from('trading_accounts').select('*').limit(1);
  
  if (error) {
    console.log("Error selecting accounts:");
    console.dir(error, { depth: null });
    // Also try checking raw response if possible, but PostgrestError usually has code
  } else {
    console.log("Success! Table exists. Data:", data);
  }
}

testInsert();
