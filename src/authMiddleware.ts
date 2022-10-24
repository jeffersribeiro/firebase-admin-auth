import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const ensureAuthenticated = (request: Request, response: Response, next: NextFunction): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).send("Token de autenticação ausente!").end();
  }

  const [, token] = authHeader.split(" ");
  try {
    const { sub } = verify(token, "4a205836dc8e3c1e11e0ab23f814a457") as TokenPayload;
    request.user = {
      id: sub
    };

    return next();
  } catch (error) {
    response.status(401).send("Token de autenticação inválido!");
  }
};

export default ensureAuthenticated;
