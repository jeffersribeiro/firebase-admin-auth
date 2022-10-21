import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express from "express";
import admin from "firebase-admin";
import session from "express-session";
import cookieParser from "cookie-parser";

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

app.use(
  session({
    saveUninitialized: true,
    secret: "keyboard kat",
    resave: true
  })
);

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

app.listen(3001, () => {
  console.log(`SERVICE: api || PORT: ${3001} || ENV: ${process.env.NODE_ENV}`);
});
