import AuthServices from "../../services/auth/AuthServices.mjs";

export default class AuthControllers {
  #authService;
  constructor() {
    this.#authService = new AuthServices();
  }
  async register(req, res) {
    try {
      const { email, password, name, role } = req.body;
      const user = await this.#authService.register(email, password, name, role);
      res.status(201).json({ message: "User created", user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.#authService.login(email, password);
      res.status(200).json({ message: "User logged in", user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
