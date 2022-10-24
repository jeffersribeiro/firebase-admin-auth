import * as admin from "firebase-admin";
import { Router, Request, Response, CookieOptions } from "express";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const options: CookieOptions = {
      maxAge: expiresIn,
      secure: true,
      httpOnly: true,
      sameSite: "none",
      domain: ".firebase-admin-auth-skiuy5p3gq-uc.a.run.app"
    };

    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn
    });

    res.cookie("__session", sessionCookie, options);
    res.end(JSON.stringify({ status: "success" }));
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const sessionCookie = req.cookies.session || "";
    res.clearCookie("session");

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);

    await admin.auth().revokeRefreshTokens(decodedClaims.sub);

    res.redirect("/login");
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

export default router;
