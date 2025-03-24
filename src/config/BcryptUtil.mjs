import bcrypt from "bcryptjs";

export default class BcryptConfig {
  static async hashPassword(password) {
    return await bcrypt.hash(password);
  }
  static async comparePassword(hash, password) {
    return await bcrypt.compare(hash, password);
  }
}
