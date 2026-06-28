import { createClient } from '@insforge/sdk';

const url = 'https://gdx6jrqh.us-east.insforge.app';
const key = 'anon_030ab5575136bd054a033602d00d91d4af4ce092cc94689a0cd18f2c2782da27';

const insforge = createClient({ baseUrl: url, anonKey: key });

async function testConnection() {
  console.log("Fetching trades schema...");
  const { data, error } = await insforge.database.from('trades').select('*').limit(1);
  
  if (error) {
    console.log("Error querying trades:", error);
  } else {
    console.log("Success. Data shape:", data);
  }
}

testConnection();
