import express from "express";
import dotenv from "dotenv";
import AuthController from "./src/controller/auth/AuthControllers.mjs";

dotenv.config();

const app = express();

app.use(express.json());

const authController = new AuthController();

app.post("/register", (req, res) => authController.register(req, res));
app.post("/login", (req, res) => authController.login(req, res));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
