import { createClient } from '@supabase/supabase-js';

const url = 'https://gdx6jrqh.us-east.insforge.app';
const key = 'anon_030ab5575136bd054a033602d00d91d4af4ce092cc94689a0cd18f2c2782da27';

const supabase = createClient(url, key);

async function testConnection() {
  console.log("Testing connection...");
  // Try to list tables or just run a simple select
  const { data, error } = await supabase.from('trades').select('*').limit(1);
  
  if (error) {
    if (error.code === '42P01') {
      console.log("Connected successfully, but 'trades' table does not exist yet.");
    } else {
      console.log("Error connecting:", error);
    }
  } else {
    console.log("Connected successfully. Data:", data);
  }
}

testConnection();
