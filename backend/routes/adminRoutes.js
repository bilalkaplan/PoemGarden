const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Database durumunu kontrol et
router.get('/check-dbs', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Tüm collections'ları listele
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Her collection'da kaç veri var?
    const collectionStats = {};
    for (const collName of collectionNames) {
      const count = await db.collection(collName).countDocuments();
      const sample = await db.collection(collName).findOne({});
      collectionStats[collName] = { count, sample };
    }

    res.json({
      collections: collectionNames,
      stats: collectionStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verileri test database'den poemgarden database'ne taşı
router.post('/migrate-from-test', async (req, res) => {
  try {
    const { adminPassword } = req.body;
    if (adminPassword !== 'admin123') {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    const testDb = mongoose.connection.client.db('test');
    const poemgardenDb = mongoose.connection.client.db('poemgarden');

    // Test database'deki collections'ları oku
    const testUsers = await testDb.collection('users').find({}).toArray();
    const testPoems = await testDb.collection('poems').find({}).toArray();

    // poemgarden database'ne yaz
    if (testUsers.length > 0) {
      await poemgardenDb.collection('users').insertMany(testUsers);
    }
    if (testPoems.length > 0) {
      await poemgardenDb.collection('poems').insertMany(testPoems);
    }

    res.json({ 
      message: 'Migration successful',
      usersCount: testUsers.length,
      poemsCount: testPoems.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Migration failed', error: err.message });
  }
});

// Test database'ni temizle (migration sonrası)
router.post('/clean-test-db', async (req, res) => {
  try {
    const { adminPassword } = req.body;
    if (adminPassword !== 'admin123') {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    const testDb = mongoose.connection.client.db('test');
    await testDb.collection('users').deleteMany({});
    await testDb.collection('poems').deleteMany({});

    res.json({ message: 'Test database cleaned' });
  } catch (err) {
    res.status(500).json({ message: 'Clean failed', error: err.message });
  }
});

module.exports = router;
