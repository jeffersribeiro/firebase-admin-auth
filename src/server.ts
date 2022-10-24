import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import morgan from "morgan";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";

import router from "./auth";

const { NODE_ENV } = process.env;

const origin =
  NODE_ENV === "development" ? "http://localhost:3000" : "https://web-skiuy5p3gq-uc.a.run.app";

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

app.set("trust proxy", 1);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(
  cors({
    credentials: true,
    origin
  })
);

app.use("/api/v1", router);

app.listen(3001, () => {
  console.log(`SERVICE: api || PORT: ${3001} || ENV: ${process.env.NODE_ENV}`);
});
