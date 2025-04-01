const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

// Connect to the in-memory database before running tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clear all data between tests
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

// Close database connection and stop the in-memory server after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

// Mock environment variables
process.env.JWT_SECRET = "test_jwt_secret";
process.env.JWT_EXPIRE = "1h";
process.env.RAZORPAY_KEY_ID = "test_key_id";
process.env.RAZORPAY_KEY_SECRET = "test_key_secret";
process.env.CLOUDINARY_CLOUD_NAME = "test_cloud_name";
process.env.CLOUDINARY_API_KEY = "test_api_key";
process.env.CLOUDINARY_API_SECRET = "test_api_secret";
process.env.SMTP_HOST = "test_smtp_host";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "test_smtp_user";
process.env.SMTP_PASS = "test_smtp_pass";
process.env.SMTP_FROM = "test@example.com";
