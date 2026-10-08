
import jwt from "jsonwebtoken";
import { userModel as User } from "@/models/userModel";

export const protect = async (req:any, res:any, next:any) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated. Please log in.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
      { algorithms: ["HS256"] }
    );

    const user = await User.findById(decoded.sub)
      .select("_id userName email role")
      .lean();

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.userName,
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Restrict a route to specific roles.
export const authorize = (...allowedRoles:any) => {
  return (req:any, res:any, next:any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    next();
  };
};
