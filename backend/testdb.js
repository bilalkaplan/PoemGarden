require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

async function check() {
  await mongoose.connect(uri);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  const poems = await mongoose.connection.db.collection('poems').find({}).toArray();
  console.log("Poems count in 'poemgarden' DB:", poems.length);
  
  // Also check 'test' DB
  const testDb = mongoose.connection.client.db('test');
  const testPoems = await testDb.collection('poems').find({}).toArray();
  console.log("Poems count in 'test' DB:", testPoems.length);
  process.exit(0);
}
check();
