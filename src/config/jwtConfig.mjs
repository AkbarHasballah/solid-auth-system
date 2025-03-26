import jwt from "jsonwebtoken";

export default class JwtConfig {
  static generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  }
  static verifytoken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  }
}
