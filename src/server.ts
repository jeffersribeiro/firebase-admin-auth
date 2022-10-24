import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import morgan from "morgan";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import session, { MemoryStore } from "express-session";
import express, { NextFunction, Request, Response } from "express";

import router from "./auth";

const serviceAccount = require("../macfor-74649-firebase-adminsdk-egw6h-5248f636c6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://macfor-74649-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();

firestore.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true
});

const app = express();

app.use(
  session({
    name: "__session",
    saveUninitialized: false,
    secret: "keyboard kat",
    store: new MemoryStore(),
    resave: false
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  express.json({
    limit: "100mb"
  })
);

app.use(cookieParser());

app.use(morgan("dev"));

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(403).json({ message: err.message });
  }

  next(err);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Set-Cookie");
  res.header("Access-Control-Allow-Credentials", "true");

  return next();
});

app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://web-skiuy5p3gq-uc.a.run.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

app.use("/api/v1", router);

app.get("/", (_: Request, res: Response) => {
  res.json({
    service: "fiebase-admin-auth",
    status: "ok",
    version: "1.0.0"
  });
});

app.listen(3001, () => {
  console.log(`SERVICE: api || PORT: ${3001} || ENV: ${process.env.NODE_ENV}`);
});
