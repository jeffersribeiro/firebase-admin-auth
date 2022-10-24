import { sign } from "jsonwebtoken";
import * as admin from "firebase-admin";
import { compare, hash } from "bcryptjs";
import { Router, Request, Response } from "express";

import ensureAuthenticated from "./authMiddleware";

const router = Router();

router.post("/create-account", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    const hashPassword = await hash(password, 8);

    const { uid, emailVerified, phoneNumber, photoURL } = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    await admin.firestore().collection("/users").doc(uid).set({
      snapId: uid,
      emailVerified,
      phoneNumber,
      photoURL,
      hashPassword,
      email,
      password,
      displayName,
      optins: []
    });

    res.end(JSON.stringify({ status: "success" }));
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const users = await admin.firestore().collection("/users").where("email", "==", email).get();

    let user = undefined;
    users.forEach((doc) => {
      user = { snapId: doc.id, ...doc.data() };
    });

    if (!user) {
      res.status(403).json({ message: "user not found" });
      return;
    }

    const matchPassword = await compare(password, user.hashPassword);

    if (!matchPassword) {
      res.send("senha ou email incorretos!");
    }

    const token = sign({}, "4a205836dc8e3c1e11e0ab23f814a457", {
      subject: user.snapId,
      expiresIn: "365d"
    });

    res.json({ token, user });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    res.redirect("/login");
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

router.get("/user", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await admin.firestore().collection("/users").doc(req.user.id).get();
    res.json(user.data());
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

export default router;
