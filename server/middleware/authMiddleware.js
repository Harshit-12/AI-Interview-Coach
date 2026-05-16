import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
  try {

    console.log("Protect middleware called");
    const authHeader = req.headers.authorization;
    console.log("Auth header: ", authHeader);
    if (!authHeader) {
      console.log("No auth header");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    console.log("Extracted token: ", token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token: ", decoded);
    req.user = decoded; // { userId: ... }
    console.log("user : "+ req.user);
    next();

  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};