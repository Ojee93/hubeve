"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
async function start() {
    const databaseConfig = {
        "<username>": process.env.DATABASE_USER,
        "<password>": process.env.DATABASE_PASSWORD,
    };
    // const DB = "mongodb+srv://afolabiojee_db_user:lc9QS40BrGtqZ6gi@cluster0.oqehea8.mongodb.net/hubeve?retryWrites=true&w=majority&appName=Cluster0";
    const DB = (process.env.DATABASE_URI || "").replace(/<username>|<password>/gi, (matched) => {
        const replacementValue = databaseConfig[matched];
        return replacementValue || "";
    });
    mongoose_1.default
        .connect(DB, {
        maxPoolSize: 10,
        // serverSelectionTimeoutMS: 5000,
    })
        .then(() => {
        console.log("Database connected successfully");
    });
    const port = process.env.PORT || 3000;
    app_1.app.listen(port, () => {
        console.log(`Server running at ${port}/`);
    });
}
start().catch((err) => {
    console.error("Startup failed", err);
    process.exit(1);
});
