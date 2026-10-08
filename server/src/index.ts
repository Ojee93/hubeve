import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import { app as server } from "./app";

async function start() {
  const databaseConfig = {
    "<username>": process.env.DATABASE_USER,
    "<password>": process.env.DATABASE_PASSWORD,
  };

  // const DB = "mongodb+srv://afolabiojee_db_user:lc9QS40BrGtqZ6gi@cluster0.oqehea8.mongodb.net/hubeve?retryWrites=true&w=majority&appName=Cluster0";

  const DB = (process.env.DATABASE_URI || "").replace(
    /<username>|<password>/gi,
    (matched: string) => {
      const replacementValue =
        databaseConfig[matched as keyof typeof databaseConfig];
      return replacementValue || "";
    }
  );

  mongoose
    .connect(DB, {
      maxPoolSize: 10,
      // serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("Database connected successfully");
    });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running at ${port}/`);
  });
}

start().catch((err) => {
  console.error("Startup failed", err);
  process.exit(1);
});
