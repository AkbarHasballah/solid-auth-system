import prisma from "../../config/prisma.mjs";

export default class UserRepository {
  async createUser(email, password, name, role) {
    return await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: role || "user",
      },
    });
  }
  async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }
}
