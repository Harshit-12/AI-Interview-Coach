import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // { userId: ... }
    console.log("user : "+ req.user);
    next();

  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};