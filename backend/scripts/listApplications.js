const mongoose = require('mongoose');
const path = require('path');

// Load environment from backend .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Application = require('../models/Application');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const apps = await Application.find().sort({ createdAt: -1 }).lean();
    console.log(JSON.stringify(apps, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error listing applications:', err.message || err);
    process.exit(1);
  }
})();
