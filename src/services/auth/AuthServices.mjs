import UserRepository from "../../repositories/auth/UserRepository.mjs";
import BcryptConfig from "../../config/BcryptConfig.mjs";
import JwtConfig from "../../config/jwtConfig.mjs";

export default class AuthServices {
  #userRepository;

  constructor(userRepository = new UserRepository()) {
    this.#userRepository = userRepository;
  }
  async register(email, password, name, role) {
    const existingUSer = await this.#userRepository.findByEmail(email);
    if (existingUSer) {
      throw new Error("User already exists");
    }
    const hashedPassword = await BcryptConfig.hashPassword(password);
    return await this.#userRepository.createUser(email, hashedPassword, name, role);
  }

  async login(email, password) {
    const user = await this.#userRepository.findByEmail(email);

    if (!user || !(await BcryptConfig.comparePassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const token = JwtConfig.generateToken({ id_user: user.id_user, email: user.email });
    return {
      data: {
        status: "Login Successful",
        id_user: user.id_user,
        email: user.email,
        token,
      },
    };
  }
}
