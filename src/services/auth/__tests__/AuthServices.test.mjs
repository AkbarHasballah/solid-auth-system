import { jest, it, describe, expect } from "@jest/globals";
import AuthService from "../AuthServices.mjs";
import UserRepository from "../../../repositories/auth/UserRepository.mjs";
import JwtConfig from "../../../config/jwtConfig.mjs";
import BcryptConfig from "../../../config/BcryptConfig.mjs";

jest.mock("../../../repositories/auth/UserRepository.mjs");
jest.mock("../../../config/jwtConfig.mjs");
jest.mock("../../../config/BcryptConfig.mjs");

describe("AuthService - login", () => {
  let authService;
  let mockUserRepo;

  beforeEach(() => {
    // Reset semua mock
    jest.resetAllMocks();

    // Buat instance UserRepository dan mock fungsinya
    mockUserRepo = new UserRepository();
    mockUserRepo.findByEmail = jest.fn();
    mockUserRepo.createUser = jest.fn();

    authService = new AuthService(mockUserRepo);
  });

  it("should return token and user data when login is successful", async () => {
    const mockUser = {
      id_user: "ca49e332-dd79-4dd2-83a2-21b27ac508df",
      email: "akbar5@gmail.com",
      password: "$2b$10$vmSwh7ICFJVkJUmzw8NTqO1ecEMPsF8eEifJ/plAgD8JdAQxVzenq", // Hashed password
    };
  
    // Mock UserRepository's findByEmail method
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
   
    // Mock BcryptConfig's comparePassword method to return true
    jest.spyOn(BcryptConfig, 'comparePassword').mockResolvedValue(true);
    
    // Mock JwtConfig's generateToken method to return a fake token
    jest.spyOn(JwtConfig, 'generateToken').mockReturnValue("fake-jwt-token");
  
    // Call login method
    const result = await authService.login("akbar5@gmail.com", "123456");
  
    // Verify the result matches expected structure
    expect(result).toEqual({
      data: {
        status: "Login Successful",
        id_user: mockUser.id_user,
        email: mockUser.email,
        token: "fake-jwt-token",
      },
    });
  
    // Verify method calls with correct arguments
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(BcryptConfig.comparePassword).toHaveBeenCalledWith("123456", mockUser.password);
    expect(JwtConfig.generateToken).toHaveBeenCalledWith({
      id_user: "ca49e332-dd79-4dd2-83a2-21b27ac508df",
      email: "akbar5@gmail.com",
    });
  });

  it("should throw an error when email is not found", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(authService.login("test@example.com", "password123")).rejects.toThrow("Invalid email or password");
  });

  it("should throw an error when password is incorrect", async () => {
    const mockUser = {
      id_user: "123",
      email: "test@example.com",
      password: "hashedpassword",
    };
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    
    // Mock comparePassword untuk return false
    jest.spyOn(BcryptConfig, 'comparePassword').mockResolvedValue(false);

    await expect(authService.login("test@example.com", "wrongpassword")).rejects.toThrow("Invalid email or password");
  });

  it("should register a new user successfully", async () => {
    const mockUser = {
      id_user: "123",
      email: "newuser@example.com",
      password: "hashedpassword",
      name: "New User",
      role: "user",
    };
  
    mockUserRepo.findByEmail.mockResolvedValue(null);
    jest.spyOn(BcryptConfig, 'hashPassword').mockResolvedValue("hashedpassword");
    mockUserRepo.createUser.mockResolvedValue(mockUser);
  
    const result = await authService.register("newuser@example.com", "123456", "New User", "user");
  
    expect(result).toEqual(mockUser);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("newuser@example.com");
    expect(BcryptConfig.hashPassword).toHaveBeenCalledWith("123456");
    expect(mockUserRepo.createUser).toHaveBeenCalledWith(
      "newuser@example.com",
      "hashedpassword",
      "New User",
      "user"
    );
  });
  
  it("should throw an error when email is already in use", async () => {
    const mockUser = {
      id_user: "123",
      email: "test@example.com",
      password: "hashedpassword",
      name: "Test User",
      role: "user",
    };
  
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
  
    await expect(
      authService.register("test@example.com", "123456", "Test User", "user")
    ).rejects.toThrow("User already exists");
  });
  
});