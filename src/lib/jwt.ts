import jwt from "jsonwebtoken";

export function signToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d"
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}

export function isTokenValid(token: string) {
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
}
