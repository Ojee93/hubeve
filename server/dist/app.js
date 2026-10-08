"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// import { createClient } from "redis";
const express_1 = __importDefault(require("express"));
// import morgan from "morgan";
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { assignSession, headerAuth, verifySseToken } from "./middleware";
// import { authRoutes, cronRoutes, sseTokenRoutes, streamRoutes } from "./routes";
// import { sseTokenAuth } from "./middleware";
// import {redisClient } from "./lib";
dotenv_1.default.config({ path: ".env.local" });
exports.app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: `${process.env.ORIGIN}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Authorization", "Content-Type"],
    "Access-Control-Allow-Credentials": true,
    credentials: true,
    optionsSuccessStatus: 204,
};
const session_secret = process.env.SESSION_SECRET || "";
exports.app.set("trust proxy", 1);
// Enable CORS with the above options
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
// app.use(
//   session({
//     name: "sid",
//     store: new RedisStore({
//       client: redisClient,
//       prefix: "sess:",
//       ttl: 60 * 60 * 24,
//     }),
//     secret: session_secret,
//     saveUninitialized: false, // Save new sessions that are uninitialized (i.e., anonymous sessions)
//     resave: false, // Don't save session if it hasn't been modified
//     cookie: {
//       httpOnly: true, // Essential: Prevents client-side JS from accessing the cookie
//       secure: process.env.NODE_ENV === "production", // Essential: Cookie only sent over HTTPS (set to false for local dev via HTTP)
//       sameSite: "lax", // Best practice to mitigate CSRF
//       maxAge: 1000 * 60 * 60 * 24, // Session expiration time (1 day)
//     },
//   })
// );
// app.use(assignSession);
// app.use(morgan("dev"));
exports.app.disable("x-powered-by");
// app.use("/v1/auth", headerAuth, authRoutes);
// app.use("/v1/ssetoken", sseTokenAuth, sseTokenRoutes);
// app.use("/v1/cron", cronRoutes);
// app.use("/v1/events", verifySseToken, streamRoutes);
