import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
if (!uri) {
  throw new Error('MONGODB_URI is not set in .env');
}
if (!dbName) {
  throw new Error('MONGODB_DATABASE is not set in .env');
}

let client: MongoClient | null = null;
let db: Db | null = null;
let collection: Collection | null = null;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri!);
    await client.connect();
    db = client.db(dbName);
    collection = db.collection('user_timezones');
  }
  return collection!;
}

export async function setUserTimezone(userId: string, timezone: string): Promise<void> {
  const col = await connectDB();
  await col.updateOne(
    { userId },
    { $set: { userId, timezone } },
    { upsert: true }
  );
}

export async function getUserTimezone(userId: string): Promise<string | null> {
  const col = await connectDB();
  const doc = await col.findOne({ userId });
  return doc ? doc.timezone : null;
}
