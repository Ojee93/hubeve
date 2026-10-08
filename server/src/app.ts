import dotenv from "dotenv";
import session from "express-session";
// import { createClient } from "redis";
import express, { Express } from "express";
// import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { assignSession, headerAuth, verifySseToken } from "./middleware";
import { authRoutes, cronRoutes, sseTokenRoutes, streamRoutes } from "./routes";
import { sseTokenAuth } from "./middleware";
import {redisClient } from "./lib";

dotenv.config({ path: ".env.local" });

export const app: Express = express();

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

app.set("trust proxy", 1);
// Enable CORS with the above options
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: "sid",
    store: new RedisStore({
      client: redisClient,
      prefix: "sess:",
      ttl: 60 * 60 * 24,
    }),
    secret: session_secret,
    saveUninitialized: false, // Save new sessions that are uninitialized (i.e., anonymous sessions)
    resave: false, // Don't save session if it hasn't been modified
    cookie: {
      httpOnly: true, // Essential: Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Essential: Cookie only sent over HTTPS (set to false for local dev via HTTP)
      sameSite: "lax", // Best practice to mitigate CSRF
      maxAge: 1000 * 60 * 60 * 24, // Session expiration time (1 day)
    },
  })
);
app.use(assignSession);
// app.use(morgan("dev"));

app.disable("x-powered-by");

app.use("/v1/auth", headerAuth, authRoutes);
app.use("/v1/ssetoken", sseTokenAuth, sseTokenRoutes);
app.use("/v1/cron", cronRoutes);
app.use("/v1/events", verifySseToken, streamRoutes);
