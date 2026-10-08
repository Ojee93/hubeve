import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userModel as User } from "@/models/userModel";

dotenv.config({ path: ".env.local" });

// create jsonwebtoken
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: maxAge,
  });
};

export const signup = async (req: any, res: any) => {
  //signUp user
  try {
    // console.log("body",req.body)
    const user = await User.create(req.body);
    const token = createToken(user._id);
    // res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: maxAge * 1000 });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      SameSite: "None",
      maxAge: maxAge * 1000,
    });
    res.status(201).json({
      status: "success",
      data: user._id,
    });
  } catch (err: any) {
    console.log("error", err.message);
    // const error = handleErrors(err.message);

    res.status(400).json({
      status: "fail",
      //   message: error
    });
  }
};

export const login = async (req: any, res: any) => {
  //login user
  const { userName, password } = req.body;

  try {
    const user = await User.login(userName, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      status: "success",
      data: user._id,
    });
  } catch (err: any) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const logOut = (_: any, res: any) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({
    status: "success",
    message: "logged out",
  });
};
