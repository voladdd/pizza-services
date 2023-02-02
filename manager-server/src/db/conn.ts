import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

class DbInstance {
  private static mongoClient: MongoClient;

  static isInitialized(): boolean {
    return this.mongoClient !== undefined;
  }

  static getClient(): MongoClient {
    if (this.isInitialized()) return this.mongoClient;

    // Initialize the connection.
    this.mongoClient = new MongoClient(process.env.MONGO_URI);
    console.log("mongo client initialized");
    return this.mongoClient;
  }
}

export default DbInstance;
