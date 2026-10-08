import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userModel as User } from "@/models/userModel";

dotenv.config({ path: ".env" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const createToken = (user:any) => {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET || "fallback_secret",
    {
      subject: user._id.toString(),
      expiresIn: "1d",
      algorithm: "HS256",
    }
  );
};

const sendAuthCookie = (res:any, token:any) => {
  res.cookie("accessToken", token, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const publicUser = (user:any) => ({
  id: user._id.toString(),
  name: user.userName,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req:any, res:any) => {
  try {
    const { userName, email, password, role } = req.body;

    if (
      typeof userName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const cleanName = userName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    if (
      role !== undefined &&
      !["CUSTOMER", "MANAGER"].includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid account role",
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      userName: cleanName,
      email: cleanEmail,
      password,
      role: role ?? "CUSTOMER",
    });

    const token = createToken(user);
    sendAuthCookie(res, token);

    return res.status(201).json({
      message: "Account created successfully",
      user: publicUser(user),
    });
  } catch (error:any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Unable to create account",
    });
  }
};

// POST /api/auth/login
export const login = async (req:any, res:any) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await User.comparePassword(
      password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);
    sendAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (error:any) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in",
    });
  }
};

// POST /api/auth/logout
export const logout = (req:any, res:any) => {
  res.clearCookie("accessToken", cookieOptions);

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
